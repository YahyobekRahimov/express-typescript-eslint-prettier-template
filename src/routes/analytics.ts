import { Router } from "express";
import prisma from "../lib/prisma.js";
import { isAuthenticated, isAdmin } from "../middlewares/auth.js";
import type {
  DashboardStatsResponse,
  DelegateAnalyticsResponse,
  TopStartupResponse,
} from "../types/api.js";

const router = Router();

// Get dashboard statistics (Admin only)
router.get("/stats", isAuthenticated, isAdmin, async (req, res) => {
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
      prisma.recommendations.count({
        where: { is_visited: true },
      }),
      prisma.scan_log.count(),
      prisma.users.count({
        where: { role: "staff" },
      }),
    ]);

    const visitationRate =
      totalRecommendations > 0
        ? ((visitedRecommendations / totalRecommendations) * 100).toFixed(2) +
          "%"
        : "0%";

    const stats: DashboardStatsResponse = {
      totalDelegates,
      totalStartups,
      totalRecommendations,
      visitedRecommendations,
      totalScans,
      totalStaffMembers,
      visitationRate,
    };

    res.json({
      success: true,
      data: stats,
    });
  } catch (error) {
    console.error("Error fetching statistics:", error);
    res.status(500).json({
      success: false,
      message: "An error occurred while fetching statistics",
    });
  }
});

// Get analytics for a specific delegate (Admin only)
router.get(
  "/delegate/:delegate_id",
  isAuthenticated,
  isAdmin,
  async (req, res) => {
    const { delegate_id } = req.params;

    try {
      // Get delegate info
      const delegate = await prisma.delegates.findUnique({
        where: { id: parseInt(delegate_id) },
        select: {
          id: true,
          name: true,
          email: true,
          job_title: true,
          company_name: true,
        },
      });

      if (!delegate) {
        return res.status(404).json({
          success: false,
          message: "Delegate not found",
        });
      }

      // Get delegate recommendations stats
      const [totalRecommendations, visitedCount] = await Promise.all([
        prisma.recommendations.count({
          where: { delegate_id: parseInt(delegate_id) },
        }),
        prisma.recommendations.count({
          where: {
            delegate_id: parseInt(delegate_id),
            is_visited: true,
          },
        }),
      ]);

      // Get recommendations details
      const recommendations = await prisma.recommendations.findMany({
        where: { delegate_id: parseInt(delegate_id) },
        select: {
          id: true,
          startup_id: true,
          is_visited: true,
          visited_at: true,
          startups: {
            select: {
              name: true,
              booth_number: true,
            },
          },
        },
        orderBy: { visited_at: "desc" },
      });

      const visitationRate =
        totalRecommendations > 0
          ? ((visitedCount / totalRecommendations) * 100).toFixed(2) + "%"
          : "0%";

      const formattedRecommendations = recommendations.map((rec) => ({
        id: rec.id,
        startup_id: rec.startup_id,
        is_visited: rec.is_visited,
        visited_at: rec.visited_at,
        startup_name: rec.startups?.name ?? null,
        booth_number: rec.startups?.booth_number ?? null,
      }));

      const analyticsData: DelegateAnalyticsResponse = {
        delegate,
        stats: {
          totalRecommendations,
          visitedCount,
          visitationRate,
        },
        recommendations: formattedRecommendations,
      };

      res.json({
        success: true,
        data: analyticsData,
      });
    } catch (error) {
      console.error("Error fetching delegate analytics:", error);
      res.status(500).json({
        success: false,
        message: "An error occurred while fetching delegate analytics",
      });
    }
  },
);

// Get top startups by visits (Admin only)
router.get("/top-startups", isAuthenticated, isAdmin, async (req, res) => {
  try {
    const result = await prisma.startups.findMany({
      select: {
        id: true,
        name: true,
        booth_number: true,
        recommendations: {
          select: { id: true, is_visited: true },
        },
      },
    });

    const formatted: TopStartupResponse[] = result
      .map((startup) => ({
        id: startup.id,
        name: startup.name,
        booth_number: startup.booth_number,
        recommendation_count: startup.recommendations.length,
        visit_count: startup.recommendations.filter((r) => r.is_visited).length,
      }))
      .sort((a, b) => b.visit_count - a.visit_count)
      .slice(0, 10);

    res.json({
      success: true,
      data: formatted,
    });
  } catch (error) {
    console.error("Error fetching top startups:", error);
    res.status(500).json({
      success: false,
      message: "An error occurred while fetching top startups",
    });
  }
});

export default router;
