import { Router } from "express";
import { isAuthenticated } from "../middlewares/auth.js";
import { dashboardController } from "../controllers/dashboardController.js";

const router = Router();

// Main dashboard page
router.get("/", isAuthenticated, dashboardController.renderDashboard);

export default router;
