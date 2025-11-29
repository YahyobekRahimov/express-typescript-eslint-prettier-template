import { Router } from "express";
import jwt from "jsonwebtoken";
import bcryptjs from "bcryptjs";
import { pool } from "../db.js";
import { JWT_SECRET } from "../config/config.js";

const router = Router();

// Sign-in page (GET)
router.get("/signin", (req, res) => {
  res.render("signin", { error: null });
});

// Sign-in handler (POST)
router.post("/signin", async (req, res) => {
  const { username, password } = req.body;

  // Validate input
  if (!username || !password) {
    return res.render("signin", {
      error: "Username and password are required",
    });
  }

  try {
    const result = await pool.query(
      "SELECT id, username, role, password FROM users WHERE username = $1",
      [username],
    );

    if (result.rows.length === 0) {
      return res.render("signin", { error: "Invalid credentials" });
    }

    const user = result.rows[0];
    console.log("Fetched user from DB:", user);
    console.log("username", username);
    console.log("password:", password);
    // Compare password with hashed password
    const isPasswordValid = await bcryptjs.compare(password, user.password);

    if (!isPasswordValid) {
      return res.render("signin", {
        error: "Invalid credentials",
      });
    }

    // Generate JWT token (7 days expiration)
    const token = jwt.sign(
      { id: user.id, username: user.username, role: user.role },
      JWT_SECRET ?? "",
      { expiresIn: "7d" },
    );

    // Set httpOnly cookie
    res.cookie("authToken", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
    });

    console.log(`User ${username} signed in successfully`);
    return res.redirect("/dashboard");
  } catch (error) {
    console.error("Error during sign-in:", error);
    return res.render("signin", {
      error: "An error occurred. Please try again.",
    });
  }
});

// Logout handler
router.get("/logout", (req, res) => {
  res.clearCookie("authToken");
  res.redirect("/auth/signin");
});

export default router;
