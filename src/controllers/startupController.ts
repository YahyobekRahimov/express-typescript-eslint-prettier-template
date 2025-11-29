import { Request, Response } from "express";
import prisma from "../lib/prisma.js";
import {
  CreateStartupInput,
  UpdateStartupInput,
} from "../validators/schemas.js";

export const startupController = {
  getAllStartups: async (req: Request, res: Response) => {
    try {
      const data = await prisma.startups.findMany({
        select: {
          id: true,
          name: true,
          email: true,
          description: true,
          industry: true,
          booth_number: true,
          created_at: true,
        },
        orderBy: { created_at: "desc" },
      });

      res.json({
        success: true,
        data,
      });
    } catch (error) {
      console.error("Error fetching startups:", error);
      res.status(500).json({
        success: false,
        message: "An error occurred while fetching startups",
      });
    }
  },

  getStartupById: async (req: Request, res: Response) => {
    const { id } = req.params;

    try {
      const data = await prisma.startups.findUnique({
        where: { id: parseInt(id) },
        select: {
          id: true,
          name: true,
          email: true,
          description: true,
          industry: true,
          booth_number: true,
          created_at: true,
        },
      });

      if (!data) {
        return res.status(404).json({
          success: false,
          message: "Startup not found",
        });
      }

      res.json({
        success: true,
        data,
      });
    } catch (error) {
      console.error("Error fetching startup:", error);
      res.status(500).json({
        success: false,
        message: "An error occurred while fetching the startup",
      });
    }
  },

  createStartup: async (req: Request, res: Response) => {
    const { name, email, description, industry, booth_number } =
      req.body as CreateStartupInput;

    try {
      // Create new startup
      const data = await prisma.startups.create({
        data: {
          name,
          email,
          description,
          industry,
          booth_number,
        },
        select: {
          id: true,
          name: true,
          email: true,
          description: true,
          industry: true,
          booth_number: true,
          created_at: true,
        },
      });

      res.status(201).json({
        success: true,
        message: "Startup created successfully",
        data,
      });
    } catch (error) {
      console.error("Error creating startup:", error);
      res.status(500).json({
        success: false,
        message: "An error occurred while creating the startup",
      });
    }
  },

  updateStartup: async (req: Request, res: Response) => {
    const { id } = req.params;
    const { name, email, description, industry, booth_number } =
      req.body as UpdateStartupInput;

    try {
      // Check if startup exists
      const existingStartup = await prisma.startups.findUnique({
        where: { id: parseInt(id) },
      });

      if (!existingStartup) {
        return res.status(404).json({
          success: false,
          message: "Startup not found",
        });
      }

      // Update startup
      const data = await prisma.startups.update({
        where: { id: parseInt(id) },
        data: {
          ...(name !== undefined && { name }),
          ...(email !== undefined && { email }),
          ...(description !== undefined && { description }),
          ...(industry !== undefined && { industry }),
          ...(booth_number !== undefined && { booth_number }),
        },
        select: {
          id: true,
          name: true,
          email: true,
          description: true,
          industry: true,
          booth_number: true,
          created_at: true,
        },
      });

      res.json({
        success: true,
        message: "Startup updated successfully",
        data,
      });
    } catch (error) {
      console.error("Error updating startup:", error);
      res.status(500).json({
        success: false,
        message: "An error occurred while updating the startup",
      });
    }
  },

  deleteStartup: async (req: Request, res: Response) => {
    const { id } = req.params;

    try {
      // Delete startup
      await prisma.startups.delete({
        where: { id: parseInt(id) },
      });

      res.json({
        success: true,
        message: "Startup deleted successfully",
      });
    } catch (error) {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const err = error as any;
      console.error("Error deleting startup:", error);
      if (err.code === "P2025") {
        return res.status(404).json({
          success: false,
          message: "Startup not found",
        });
      }
      res.status(500).json({
        success: false,
        message: "An error occurred while deleting the startup",
      });
    }
  },
};
