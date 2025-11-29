import { Router } from "express";
import bcryptjs from "bcryptjs";
import prisma from "../lib/prisma.js";
import { isAuthenticated, isAdmin } from "../middlewares/auth.js";

const router = Router();

// Get all staff users (Admin only) - GET (renders page)
router.get("/", isAuthenticated, isAdmin, async (req, res) => {
  try {
    const users = await prisma.users.findMany({
      where: { role: "staff" },
      select: {
        id: true,
        username: true,
        role: true,
        created_at: true,
        updated_at: true,
      },
      orderBy: { created_at: "desc" },
    });

    res.render("pages/user-management/index", {
      user: req.user,
      isAdmin: true,
      users,
    });
  } catch (error) {
    console.error("Error fetching users:", error);
    res.render("pages/user-management/index", {
      user: req.user,
      isAdmin: true,
      users: [],
      error: "Failed to load users",
    });
  }
});

// Add new user (Admin only) - POST
router.post("/", isAuthenticated, isAdmin, async (req, res) => {
  console.log(req.body);
  const { username, password } = req.body;

  // Validate input
  if (!username || !password) {
    return res.status(400).json({
      success: false,
      message: "Username and password are required",
    });
  }

  try {
    // Check if username already exists
    const existingUser = await prisma.users.findUnique({
      where: { username },
    });

    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: "Username already exists",
      });
    }

    // Hash the password
    const hashedPassword = await bcryptjs.hash(password, 10);

    // Create new user
    const user = await prisma.users.create({
      data: {
        username,
        password: hashedPassword,
        role: "staff",
      },
      select: {
        id: true,
        username: true,
        role: true,
        created_at: true,
      },
    });

    res.json({
      success: true,
      message: "User created successfully",
      user,
    });
  } catch (error) {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const err = error as any;
    console.error("Error creating user:", error);
    if (err.code === "P2002") {
      return res.status(400).json({
        success: false,
        message: "Username already exists",
      });
    }
    res.status(500).json({
      success: false,
      message: "An error occurred while creating the user",
    });
  }
});

// Update user (Admin only) - PUT
router.put("/:id", isAuthenticated, isAdmin, async (req, res) => {
  const { id } = req.params;
  const { password } = req.body;

  // Validate input
  if (!password) {
    return res.status(400).json({
      success: false,
      message: "Password is required",
    });
  }

  try {
    // Hash the password
    const hashedPassword = await bcryptjs.hash(password, 10);

    // Update user
    const user = await prisma.users.update({
      where: { id: parseInt(id) },
      data: { password: hashedPassword },
      select: {
        id: true,
        username: true,
        role: true,
      },
    });

    res.json({
      success: true,
      message: "User updated successfully",
      user,
    });
  } catch (error) {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const err = error as any;
    console.error("Error updating user:", error);
    if (err.code === "P2025") {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }
    res.status(500).json({
      success: false,
      message: "An error occurred while updating the user",
    });
  }
});

// Delete user (Admin only) - DELETE
router.delete("/:id", isAuthenticated, isAdmin, async (req, res) => {
  const { id } = req.params;

  try {
    // Delete user
    await prisma.users.delete({
      where: { id: parseInt(id) },
    });

    res.json({
      success: true,
      message: "User deleted successfully",
    });
  } catch (error) {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const err = error as any;
    console.error("Error deleting user:", error);
    if (err.code === "P2025") {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }
    res.status(500).json({
      success: false,
      message: "An error occurred while deleting the user",
    });
  }
});

export default router;
