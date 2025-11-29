import { Router } from "express";
import prisma from "../lib/prisma.js";
import { isAuthenticated, isAdmin } from "../middlewares/auth.js";
import type { ScanLogResponse } from "../types/api.js";

const router = Router();

// Get all scan logs (Admin only)
router.get("/", isAuthenticated, isAdmin, async (req, res) => {
  try {
    const data = await prisma.scan_log.findMany({
      select: {
        id: true,
        staff_user_id: true,
        delegate_id: true,
        scan_time: true,
        users: {
          select: { username: true },
        },
        delegates: {
          select: { name: true },
        },
      },
      orderBy: { scan_time: "desc" },
    });

    const formatted: ScanLogResponse[] = data.map((log) => ({
      id: log.id,
      staff_user_id: log.staff_user_id,
      delegate_id: log.delegate_id,
      scan_time: log.scan_time,
      staff_username: log.users?.username,
      delegate_name: log.delegates?.name,
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
});

// Log a scan (Staff & Admin)
router.post("/", isAuthenticated, async (req, res) => {
  const { delegate_id } = req.body;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const staff_user_id = (req.user as any)?.id;

  // Validate required fields
  if (!delegate_id || !staff_user_id) {
    return res.status(400).json({
      success: false,
      message: "delegate_id is required",
    });
  }

  try {
    // Check if delegate exists
    const delegateExists = await prisma.delegates.findUnique({
      where: { id: parseInt(delegate_id) },
    });

    if (!delegateExists) {
      return res.status(404).json({
        success: false,
        message: "Delegate not found",
      });
    }

    // Create scan log
    const data = await prisma.scan_log.create({
      data: {
        staff_user_id: parseInt(staff_user_id),
        delegate_id: parseInt(delegate_id),
        scan_time: new Date(),
      },
      select: {
        id: true,
        staff_user_id: true,
        delegate_id: true,
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
});

// Get scan logs for a specific staff member (Admin only)
router.get(
  "/staff/:staff_user_id",
  isAuthenticated,
  isAdmin,
  async (req, res) => {
    const { staff_user_id } = req.params;

    try {
      const data = await prisma.scan_log.findMany({
        where: { staff_user_id: parseInt(staff_user_id) },
        select: {
          id: true,
          staff_user_id: true,
          delegate_id: true,
          scan_time: true,
          delegates: {
            select: { name: true },
          },
        },
        orderBy: { scan_time: "desc" },
      });

      const formatted: ScanLogResponse[] = data.map((log) => ({
        id: log.id,
        staff_user_id: log.staff_user_id,
        delegate_id: log.delegate_id,
        scan_time: log.scan_time,
        delegate_name: log.delegates?.name,
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
);

// Get scan logs for a specific delegate (Admin only)
router.get(
  "/delegate/:delegate_id",
  isAuthenticated,
  isAdmin,
  async (req, res) => {
    const { delegate_id } = req.params;

    try {
      const data = await prisma.scan_log.findMany({
        where: { delegate_id: parseInt(delegate_id) },
        select: {
          id: true,
          staff_user_id: true,
          delegate_id: true,
          scan_time: true,
          users: {
            select: { username: true },
          },
        },
        orderBy: { scan_time: "desc" },
      });

      const formatted: ScanLogResponse[] = data.map((log) => ({
        id: log.id,
        staff_user_id: log.staff_user_id,
        delegate_id: log.delegate_id,
        scan_time: log.scan_time,
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
);

export default router;
