import { Router } from "express";
import { isAuthenticated, isAdmin } from "../middlewares/auth.js";
import { validateRequest } from "../middlewares/validate-request.js";
import {
  CreateDelegateSchema,
  UpdateDelegateSchema,
} from "../validators/schemas.js";
import { delegateController } from "../controllers/delegateController.js";

const router = Router();

// Get all delegates (Staff & Admin)
router.get("/", isAuthenticated, delegateController.getAllDelegates);

// Get delegate by ID
router.get("/:id", isAuthenticated, delegateController.getDelegateById);

// Get delegate by badge_id (QR code scan)
router.get(
  "/badge/:badge_id",
  isAuthenticated,
  delegateController.getDelegateByBadgeId,
);

// Create delegate (Admin only)
router.post(
  "/",
  isAuthenticated,
  isAdmin,
  validateRequest(CreateDelegateSchema),
  delegateController.createDelegate,
);

// Update delegate (Admin only)
router.put(
  "/:id",
  isAuthenticated,
  isAdmin,
  validateRequest(UpdateDelegateSchema),
  delegateController.updateDelegate,
);

// Delete delegate (Admin only)
router.delete(
  "/:id",
  isAuthenticated,
  isAdmin,
  delegateController.deleteDelegate,
);

export default router;
