import { Request, Response } from "express";
import prisma from "../lib/prisma.js";

export const analyticsController = {
  getDashboardStats: async (req: Request, res: Response) => {
    try {
      const [
        totalDelegates,
        totalStartups,
        totalRecommendations,
        visitedRecommendations,
        totalScans,
        totalStaffMembers,
      ] = await Promise.all([
        prisma.delegates.count(),
        prisma.startups.count(),
        prisma.recommendations.count(),
        prisma.recommendations.count({ where: { is_visited: true } }),
        prisma.scan_log.count(),
        prisma.users.count({ where: { role: "staff" } }),
      ]);

      const visitationRate =
        totalRecommendations > 0
          ? ((visitedRecommendations / totalRecommendations) * 100)
              .toFixed(2)
              .toString()
          : "0";

      res.json({
        success: true,
        data: {
          totalDelegates,
          totalStartups,
          totalRecommendations,
          visitedRecommendations,
          visitationRate,
          totalScans,
          totalStaffMembers,
        },
      });
    } catch (error) {
      console.error("Error fetching dashboard stats:", error);
      res.status(500).json({
        success: false,
        message: "An error occurred while fetching dashboard stats",
      });
    }
  },

  getDelegateAnalytics: async (req: Request, res: Response) => {
    const { delegate_id } = req.params;

    try {
      const delegate = await prisma.delegates.findUnique({
        where: { id: parseInt(delegate_id) },
      });

      if (!delegate) {
        return res.status(404).json({
          success: false,
          message: "Delegate not found",
        });
      }

      const [
        totalRecommendations,
        visitedRecommendations,
        recommendationsList,
      ] = await Promise.all([
        prisma.recommendations.count({
          where: { delegate_id: parseInt(delegate_id) },
        }),
        prisma.recommendations.count({
          where: {
            delegate_id: parseInt(delegate_id),
            is_visited: true,
          },
        }),
        prisma.recommendations.findMany({
          where: { delegate_id: parseInt(delegate_id) },
          select: {
            id: true,
            startup_id: true,
            is_visited: true,
            visited_at: true,
            startups: {
              select: { name: true },
            },
          },
        }),
      ]);

      const visitationRate =
        totalRecommendations > 0
          ? ((visitedRecommendations / totalRecommendations) * 100)
              .toFixed(2)
              .toString()
          : "0";

      const recommendations = recommendationsList.map((rec) => ({
        id: rec.id,
        startup_id: rec.startup_id,
        is_visited: rec.is_visited,
        visited_at: rec.visited_at,
        startup_name: rec.startups?.name,
      }));

      res.json({
        success: true,
        data: {
          delegate_id: parseInt(delegate_id),
          delegate_name: delegate.name,
          stats: {
            totalRecommendations,
            visitedCount: visitedRecommendations,
            visitationRate,
          },
          recommendations,
        },
      });
    } catch (error) {
      console.error("Error fetching delegate analytics:", error);
      res.status(500).json({
        success: false,
        message: "An error occurred while fetching delegate analytics",
      });
    }
  },

  getTopStartups: async (req: Request, res: Response) => {
    try {
      const data = await prisma.startups.findMany({
        select: {
          id: true,
          name: true,
          booth_number: true,
        },
      });

      const startupsWithStats = await Promise.all(
        data.map(async (startup) => {
          const [recommendationCount, visitCount] = await Promise.all([
            prisma.recommendations.count({
              where: { startup_id: startup.id },
            }),
            prisma.recommendations.count({
              where: { startup_id: startup.id, is_visited: true },
            }),
          ]);

          return {
            id: startup.id,
            name: startup.name,
            booth_number: startup.booth_number,
            recommendation_count: recommendationCount,
            visit_count: visitCount,
          };
        }),
      );

      // Sort by visit count descending
      const sorted = startupsWithStats.sort(
        (a, b) => b.visit_count - a.visit_count,
      );

      res.json({
        success: true,
        data: sorted,
      });
    } catch (error) {
      console.error("Error fetching top startups:", error);
      res.status(500).json({
        success: false,
        message: "An error occurred while fetching top startups",
      });
    }
  },
};
