import { Router } from "express";
import { isAuthenticated } from "../middlewares/auth.js";
import { validateRequest } from "../middlewares/validate-request.js";
import { CreateScanLogSchema } from "../validators/schemas.js";
import { scanLogController } from "../controllers/scanLogController.js";

const router = Router();

// Get all scans (Admin only)
router.get("/", isAuthenticated, scanLogController.getAllScans);

// Get scans by staff member
router.get(
  "/staff/:staff_user_id",
  isAuthenticated,
  scanLogController.getScansByStaff,
);

// Get scans by delegate
router.get(
  "/delegate/:delegate_id",
  isAuthenticated,
  scanLogController.getScansByDelegate,
);

// Log a scan (Staff & Admin)
router.post(
  "/",
  isAuthenticated,
  validateRequest(CreateScanLogSchema),
  scanLogController.createScan,
);

export default router;
