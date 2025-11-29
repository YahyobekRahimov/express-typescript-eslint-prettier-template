import { Request, Response } from "express";
import prisma from "../lib/prisma.js";
import { CreateRecommendationInput } from "../validators/schemas.js";

export const recommendationController = {
  getAllRecommendations: async (req: Request, res: Response) => {
    try {
      const data = await prisma.recommendations.findMany({
        select: {
          id: true,
          delegate_id: true,
          startup_id: true,
          is_visited: true,
          visited_at: true,
          delegates: {
            select: { name: true },
          },
          startups: {
            select: { name: true },
          },
        },
        orderBy: { id: "desc" },
      });

      const formatted = data.map((rec) => ({
        id: rec.id,
        delegate_id: rec.delegate_id,
        startup_id: rec.startup_id,
        is_visited: rec.is_visited,
        visited_at: rec.visited_at,
        delegate_name: rec.delegates?.name,
        startup_name: rec.startups?.name,
      }));

      res.json({
        success: true,
        data: formatted,
      });
    } catch (error) {
      console.error("Error fetching recommendations:", error);
      res.status(500).json({
        success: false,
        message: "An error occurred while fetching recommendations",
      });
    }
  },

  getRecommendationsByDelegate: async (req: Request, res: Response) => {
    const { delegate_id } = req.params;

    try {
      const data = await prisma.recommendations.findMany({
        where: { delegate_id: parseInt(delegate_id) },
        select: {
          id: true,
          delegate_id: true,
          startup_id: true,
          is_visited: true,
          visited_at: true,
          startups: {
            select: {
              id: true,
              name: true,
              booth_number: true,
            },
          },
        },
      });

      const formatted = data.map((rec) => ({
        id: rec.id,
        delegate_id: rec.delegate_id,
        startup_id: rec.startup_id,
        is_visited: rec.is_visited,
        visited_at: rec.visited_at,
        startup: rec.startups,
      }));

      res.json({
        success: true,
        data: formatted,
      });
    } catch (error) {
      console.error("Error fetching delegate recommendations:", error);
      res.status(500).json({
        success: false,
        message: "An error occurred while fetching recommendations",
      });
    }
  },

  getRecommendationById: async (req: Request, res: Response) => {
    const { id } = req.params;

    try {
      const data = await prisma.recommendations.findUnique({
        where: { id: parseInt(id) },
        select: {
          id: true,
          delegate_id: true,
          startup_id: true,
          is_visited: true,
          visited_at: true,
          delegates: {
            select: { name: true },
          },
          startups: {
            select: { name: true },
          },
        },
      });

      if (!data) {
        return res.status(404).json({
          success: false,
          message: "Recommendation not found",
        });
      }

      const formatted = {
        id: data.id,
        delegate_id: data.delegate_id,
        startup_id: data.startup_id,
        is_visited: data.is_visited,
        visited_at: data.visited_at,
        delegate_name: data.delegates?.name,
        startup_name: data.startups?.name,
      };

      res.json({
        success: true,
        data: formatted,
      });
    } catch (error) {
      console.error("Error fetching recommendation:", error);
      res.status(500).json({
        success: false,
        message: "An error occurred while fetching the recommendation",
      });
    }
  },

  createRecommendation: async (req: Request, res: Response) => {
    const { delegate_id, startup_id } = req.body as CreateRecommendationInput;

    try {
      // Check if recommendation already exists
      const existingRecommendation = await prisma.recommendations.findUnique({
        where: {
          delegate_id_startup_id: {
            delegate_id,
            startup_id,
          },
        },
      });

      if (existingRecommendation) {
        return res.status(400).json({
          success: false,
          message:
            "Recommendation already exists for this delegate-startup pair",
        });
      }

      // Create recommendation
      const data = await prisma.recommendations.create({
        data: {
          delegate_id,
          startup_id,
        },
        select: {
          id: true,
          delegate_id: true,
          startup_id: true,
          is_visited: true,
          visited_at: true,
        },
      });

      res.status(201).json({
        success: true,
        message: "Recommendation created successfully",
        data,
      });
    } catch (error) {
      console.error("Error creating recommendation:", error);
      res.status(500).json({
        success: false,
        message: "An error occurred while creating the recommendation",
      });
    }
  },

  markAsVisited: async (req: Request, res: Response) => {
    const { id } = req.params;

    try {
      const data = await prisma.recommendations.update({
        where: { id: parseInt(id) },
        select: {
          id: true,
          delegate_id: true,
          startup_id: true,
          is_visited: true,
          visited_at: true,
        },
        data: {
          is_visited: true,
          visited_at: new Date(),
        },
      });

      res.json({
        success: true,
        message: "Recommendation marked as visited",
        data,
      });
    } catch (error) {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const err = error as any;
      console.error("Error marking recommendation as visited:", error);
      if (err.code === "P2025") {
        return res.status(404).json({
          success: false,
          message: "Recommendation not found",
        });
      }
      res.status(500).json({
        success: false,
        message: "An error occurred while updating the recommendation",
      });
    }
  },

  deleteRecommendation: async (req: Request, res: Response) => {
    const { id } = req.params;

    try {
      // Delete recommendation
      await prisma.recommendations.delete({
        where: { id: parseInt(id) },
      });

      res.json({
        success: true,
        message: "Recommendation deleted successfully",
      });
    } catch (error) {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const err = error as any;
      console.error("Error deleting recommendation:", error);
      if (err.code === "P2025") {
        return res.status(404).json({
          success: false,
          message: "Recommendation not found",
        });
      }
      res.status(500).json({
        success: false,
        message: "An error occurred while deleting the recommendation",
      });
    }
  },
};
