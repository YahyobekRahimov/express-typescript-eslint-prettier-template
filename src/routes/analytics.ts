import { Router } from "express";
import { isAuthenticated, isAdmin } from "../middlewares/auth.js";
import { analyticsController } from "../controllers/analyticsController.js";

const router = Router();

// Get dashboard statistics
router.get(
  "/stats",
  isAuthenticated,
  isAdmin,
  analyticsController.getDashboardStats,
);

// Get delegate analytics
router.get(
  "/delegate/:delegate_id",
  isAuthenticated,
  analyticsController.getDelegateAnalytics,
);

// Get top startups by visits
router.get(
  "/top-startups",
  isAuthenticated,
  isAdmin,
  analyticsController.getTopStartups,
);

export default router;
