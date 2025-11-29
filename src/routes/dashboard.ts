import { Router } from "express";
import bcryptjs from "bcryptjs";
import { pool } from "../db.js";
import { isAuthenticated, isAdmin } from "../middlewares/auth.js";

const router = Router();

// Dashboard main page
router.get("/", isAuthenticated, (req, res) => {
  const user = req.user;
  res.render("pages/home/index", {
    user,
    isAdmin: user?.role === "admin",
    isStaff: user?.role === "staff",
  });
});

// User management page (Admin only)
router.get("/users", isAuthenticated, isAdmin, async (req, res) => {
  try {
    const result = await pool.query(
      "SELECT id, username, role, created_at FROM users WHERE role = 'staff' ORDER BY created_at DESC",
    );
    res.render("pages/user-management/index", {
      user: req.user,
      isAdmin: true,
      users: result.rows,
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
router.post("/users", isAuthenticated, isAdmin, async (req, res) => {
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
    const existingUser = await pool.query(
      "SELECT id FROM users WHERE username = $1",
      [username],
    );

    if (existingUser.rows.length > 0) {
      return res.status(400).json({
        success: false,
        message: "Username already exists",
      });
    }

    // Hash the password
    const hashedPassword = await bcryptjs.hash(password, 10);

    // Insert new user
    const result = await pool.query(
      "INSERT INTO users (username, password, role, created_at) VALUES ($1, $2, 'staff', NOW()) RETURNING id, username, role, created_at",
      [username, hashedPassword],
    );

    res.json({
      success: true,
      message: "User created successfully",
      user: result.rows[0],
    });
  } catch (error) {
    console.error("Error creating user:", error);
    res.status(500).json({
      success: false,
      message: "An error occurred while creating the user",
    });
  }
});

// TODO: Add more dashboard routes here
// Staff page 1
// router.get("/page1", isAuthenticated, isStaff, (req, res) => {
//   res.render("dashboard/page1", { user: req.user });
// });

// Staff page 2
// router.get("/page2", isAuthenticated, isStaff, (req, res) => {
//   res.render("dashboard/page2", { user: req.user });
// });

export default router;
