import { Request, Response } from "express";
import jwt from "jsonwebtoken";
import bcryptjs from "bcryptjs";
import prisma from "../lib/prisma.js";
import { JWT_SECRET } from "../config/config.js";
import { SignInInput } from "../validators/schemas.js";

export const authController = {
  renderSignInPage: (req: Request, res: Response) => {
    res.render("pages/login/index", { error: null });
  },

  signIn: async (req: Request, res: Response) => {
    const { username, password } = req.body as SignInInput;

    try {
      const user = await prisma.users.findUnique({
        where: { username },
        select: {
          id: true,
          username: true,
          role: true,
          password: true,
        },
      });

      if (!user) {
        return res.render("pages/login/index", {
          error: "Invalid credentials",
        });
      }

      // Compare password with hashed password
      const isPasswordValid = await bcryptjs.compare(password, user.password);

      if (!isPasswordValid) {
        return res.render("pages/login/index", {
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
      return res.render("pages/login/index", {
        error: "An error occurred. Please try again.",
      });
    }
  },

  logout: (req: Request, res: Response) => {
    res.clearCookie("authToken");
    res.redirect("/auth/signin");
  },
};
