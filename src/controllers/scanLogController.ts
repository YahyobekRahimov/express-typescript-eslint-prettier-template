import { Request, Response } from "express";
import prisma from "../lib/prisma.js";
import { CreateScanLogInput } from "../validators/schemas.js";

export const scanLogController = {
  getAllScans: async (req: Request, res: Response) => {
    try {
      const data = await prisma.scan_log.findMany({
        select: {
          id: true,
          delegate_id: true,
          staff_user_id: true,
          scan_time: true,
          delegates: {
            select: {
              id: true,
              name: true,
              badge_id: true,
            },
          },
          users: {
            select: {
              id: true,
              username: true,
            },
          },
        },
        orderBy: { scan_time: "desc" },
      });

      const formatted = data.map((log) => ({
        id: log.id,
        delegate_id: log.delegate_id,
        staff_user_id: log.staff_user_id,
        scan_time: log.scan_time,
        delegate_name: log.delegates?.name,
        staff_username: log.users?.username,
      }));

      res.json({
        success: true,
        data: formatted,
      });
    } catch (error) {
      console.error("Error fetching scan logs:", error);
      res.status(500).json({
        success: false,
        message: "An error occurred while fetching scan logs",
      });
    }
  },

  getScansByStaff: async (req: Request, res: Response) => {
    const { staff_user_id } = req.params;

    try {
      const data = await prisma.scan_log.findMany({
        where: { staff_user_id: parseInt(staff_user_id) },
        select: {
          id: true,
          delegate_id: true,
          staff_user_id: true,
          scan_time: true,
          delegates: {
            select: {
              id: true,
              name: true,
              badge_id: true,
            },
          },
        },
        orderBy: { scan_time: "desc" },
      });

      const formatted = data.map((log) => ({
        id: log.id,
        delegate_id: log.delegate_id,
        staff_user_id: log.staff_user_id,
        scan_time: log.scan_time,
        delegate_name: log.delegates?.name,
        delegate_badge_id: log.delegates?.badge_id,
      }));

      res.json({
        success: true,
        data: formatted,
      });
    } catch (error) {
      console.error("Error fetching staff scans:", error);
      res.status(500).json({
        success: false,
        message: "An error occurred while fetching scan logs",
      });
    }
  },

  getScansByDelegate: async (req: Request, res: Response) => {
    const { delegate_id } = req.params;

    try {
      const data = await prisma.scan_log.findMany({
        where: { delegate_id: parseInt(delegate_id) },
        select: {
          id: true,
          delegate_id: true,
          staff_user_id: true,
          scan_time: true,
          users: {
            select: {
              id: true,
              username: true,
            },
          },
        },
        orderBy: { scan_time: "desc" },
      });

      const formatted = data.map((log) => ({
        id: log.id,
        delegate_id: log.delegate_id,
        staff_user_id: log.staff_user_id,
        scan_time: log.scan_time,
        staff_username: log.users?.username,
      }));

      res.json({
        success: true,
        data: formatted,
      });
    } catch (error) {
      console.error("Error fetching delegate scans:", error);
      res.status(500).json({
        success: false,
        message: "An error occurred while fetching scan logs",
      });
    }
  },

  createScan: async (req: Request, res: Response) => {
    const { delegate_id } = req.body as CreateScanLogInput;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const staff_user_id = (req.user as any)?.id;

    try {
      // Check if delegate exists
      const delegateExists = await prisma.delegates.findUnique({
        where: { id: delegate_id },
      });

      if (!delegateExists) {
        return res.status(404).json({
          success: false,
          message: "Delegate not found",
        });
      }

      // Log the scan
      const data = await prisma.scan_log.create({
        data: {
          delegate_id,
          staff_user_id,
        },
        select: {
          id: true,
          delegate_id: true,
          staff_user_id: true,
          scan_time: true,
        },
      });

      res.status(201).json({
        success: true,
        message: "Scan logged successfully",
        data,
      });
    } catch (error) {
      console.error("Error logging scan:", error);
      res.status(500).json({
        success: false,
        message: "An error occurred while logging the scan",
      });
    }
  },
};
