import { Router } from "express";
import { isAuthenticated } from "../middlewares/auth.js";

const router = Router();

// Main dashboard page
router.get("/", isAuthenticated, (req, res) => {
  const user = req.user;
  res.render("pages/home/index", {
    user,
    isAdmin: user?.role === "admin",
    isStaff: user?.role === "staff",
  });
});

export default router;
