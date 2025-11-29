import { Router } from "express";
import prisma from "../lib/prisma.js";
import { isAuthenticated, isAdmin } from "../middlewares/auth.js";

const router = Router();

// Get all delegates (Staff & Admin)
router.get("/", isAuthenticated, async (req, res) => {
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
});

// Get delegate by ID
router.get("/:id", isAuthenticated, async (req, res) => {
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
});

// Get delegate by badge_id (QR code scan)
router.get("/badge/:badge_id", isAuthenticated, async (req, res) => {
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
});

// Create delegate (Admin only)
router.post("/", isAuthenticated, isAdmin, async (req, res) => {
  const { badge_id, name, email, job_title, company_name } = req.body;

  // Validate required fields
  if (!badge_id || !name) {
    return res.status(400).json({
      success: false,
      message: "badge_id and name are required",
    });
  }

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
});

// Update delegate (Admin only)
router.put("/:id", isAuthenticated, isAdmin, async (req, res) => {
  const { id } = req.params;
  const { name, email, job_title, company_name } = req.body;

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
});

// Delete delegate (Admin only)
router.delete("/:id", isAuthenticated, isAdmin, async (req, res) => {
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
});

export default router;
