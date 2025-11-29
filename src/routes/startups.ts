import { Router } from "express";
import { isAuthenticated, isAdmin } from "../middlewares/auth.js";
import { validateRequest } from "../middlewares/validate-request.js";
import {
  CreateStartupSchema,
  UpdateStartupSchema,
} from "../validators/schemas.js";
import { startupController } from "../controllers/startupController.js";

const router = Router();

// Get all startups (Staff & Admin)
router.get("/", isAuthenticated, startupController.getAllStartups);

// Get startup by ID
router.get("/:id", isAuthenticated, startupController.getStartupById);

// Create startup (Admin only)
router.post(
  "/",
  isAuthenticated,
  isAdmin,
  validateRequest(CreateStartupSchema),
  startupController.createStartup,
);

// Update startup (Admin only)
router.put(
  "/:id",
  isAuthenticated,
  isAdmin,
  validateRequest(UpdateStartupSchema),
  startupController.updateStartup,
);

// Delete startup (Admin only)
router.delete(
  "/:id",
  isAuthenticated,
  isAdmin,
  startupController.deleteStartup,
);

export default router;
