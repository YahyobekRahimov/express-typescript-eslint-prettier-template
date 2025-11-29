import { Request, Response } from "express";
import prisma from "../lib/prisma.js";
import {
  CreateDelegateInput,
  UpdateDelegateInput,
} from "../validators/schemas.js";

export const delegateController = {
  getAllDelegates: async (req: Request, res: Response) => {
    try {
      const data = await prisma.delegates.findMany({
        select: {
          id: true,
          badge_id: true,
          name: true,
          email: true,
          job_title: true,
          company_name: true,
          created_at: true,
        },
        orderBy: { created_at: "desc" },
      });
      res.json({
        success: true,
        data,
      });
    } catch (error) {
      console.error("Error fetching delegates:", error);
      res.status(500).json({
        success: false,
        message: "An error occurred while fetching delegates",
      });
    }
  },

  getDelegateById: async (req: Request, res: Response) => {
    const { id } = req.params;

    try {
      const data = await prisma.delegates.findUnique({
        where: { id: parseInt(id) },
        select: {
          id: true,
          badge_id: true,
          name: true,
          email: true,
          job_title: true,
          company_name: true,
          created_at: true,
        },
      });

      if (!data) {
        return res.status(404).json({
          success: false,
          message: "Delegate not found",
        });
      }

      res.json({
        success: true,
        data,
      });
    } catch (error) {
      console.error("Error fetching delegate:", error);
      res.status(500).json({
        success: false,
        message: "An error occurred while fetching the delegate",
      });
    }
  },

  getDelegateByBadgeId: async (req: Request, res: Response) => {
    const { badge_id } = req.params;

    try {
      const data = await prisma.delegates.findUnique({
        where: { badge_id },
        select: {
          id: true,
          badge_id: true,
          name: true,
          email: true,
          job_title: true,
          company_name: true,
          created_at: true,
        },
      });

      if (!data) {
        return res.status(404).json({
          success: false,
          message: "Delegate not found",
        });
      }

      res.json({
        success: true,
        data,
      });
    } catch (error) {
      console.error("Error fetching delegate by badge_id:", error);
      res.status(500).json({
        success: false,
        message: "An error occurred while fetching the delegate",
      });
    }
  },

  createDelegate: async (req: Request, res: Response) => {
    const { badge_id, name, email, job_title, company_name } =
      req.body as CreateDelegateInput;

    try {
      // Check if badge_id already exists
      const existingDelegate = await prisma.delegates.findUnique({
        where: { badge_id },
      });

      if (existingDelegate) {
        return res.status(400).json({
          success: false,
          message: "Badge ID already exists",
        });
      }

      // Create new delegate
      const data = await prisma.delegates.create({
        data: {
          badge_id,
          name,
          email,
          job_title,
          company_name,
        },
        select: {
          id: true,
          badge_id: true,
          name: true,
          email: true,
          job_title: true,
          company_name: true,
          created_at: true,
        },
      });

      res.status(201).json({
        success: true,
        message: "Delegate created successfully",
        data,
      });
    } catch (error) {
      console.error("Error creating delegate:", error);
      res.status(500).json({
        success: false,
        message: "An error occurred while creating the delegate",
      });
    }
  },

  updateDelegate: async (req: Request, res: Response) => {
    const { id } = req.params;
    const { name, email, job_title, company_name } =
      req.body as UpdateDelegateInput;

    try {
      // Check if delegate exists
      const existingDelegate = await prisma.delegates.findUnique({
        where: { id: parseInt(id) },
      });

      if (!existingDelegate) {
        return res.status(404).json({
          success: false,
          message: "Delegate not found",
        });
      }

      // Update delegate
      const data = await prisma.delegates.update({
        where: { id: parseInt(id) },
        data: {
          ...(name !== undefined && { name }),
          ...(email !== undefined && { email }),
          ...(job_title !== undefined && { job_title }),
          ...(company_name !== undefined && { company_name }),
        },
        select: {
          id: true,
          badge_id: true,
          name: true,
          email: true,
          job_title: true,
          company_name: true,
          created_at: true,
        },
      });

      res.json({
        success: true,
        message: "Delegate updated successfully",
        data,
      });
    } catch (error) {
      console.error("Error updating delegate:", error);
      res.status(500).json({
        success: false,
        message: "An error occurred while updating the delegate",
      });
    }
  },

  deleteDelegate: async (req: Request, res: Response) => {
    const { id } = req.params;

    try {
      // Delete delegate
      await prisma.delegates.delete({
        where: { id: parseInt(id) },
      });

      res.json({
        success: true,
        message: "Delegate deleted successfully",
      });
    } catch (error) {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const err = error as any;
      console.error("Error deleting delegate:", error);
      if (err.code === "P2025") {
        return res.status(404).json({
          success: false,
          message: "Delegate not found",
        });
      }
      res.status(500).json({
        success: false,
        message: "An error occurred while deleting the delegate",
      });
    }
  },
};
