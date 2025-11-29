import { Router } from "express";
import { isAuthenticated } from "../middlewares/auth.js";
import { dashboardController } from "../controllers/dashboardController.js";

const router = Router();

// Main dashboard page
router.get("/", isAuthenticated, dashboardController.renderDashboard);

// Delegates page
router.get("/delegates", isAuthenticated, dashboardController.renderDelegates);

// Startups page
router.get("/startups", isAuthenticated, dashboardController.renderStartups);

// Recommendations page
router.get(
  "/recommendations",
  isAuthenticated,
  dashboardController.renderRecommendations,
);

// Scan logs page
router.get("/scan-logs", isAuthenticated, dashboardController.renderScanLogs);

// Analytics page
router.get("/analytics", isAuthenticated, dashboardController.renderAnalytics);

export default router;
