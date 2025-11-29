import { Router } from "express";
import { isAuthenticated, isAdmin } from "../middlewares/auth.js";
import { validateRequest } from "../middlewares/validate-request.js";
import { CreateRecommendationSchema } from "../validators/schemas.js";
import { recommendationController } from "../controllers/recommendationController.js";

const router = Router();

// Get all recommendations (Admin only)
router.get(
  "/",
  isAuthenticated,
  isAdmin,
  recommendationController.getAllRecommendations,
);

// Get recommendations by delegate
router.get(
  "/delegate/:delegate_id",
  isAuthenticated,
  recommendationController.getRecommendationsByDelegate,
);

// Get recommendation by ID
router.get(
  "/:id",
  isAuthenticated,
  recommendationController.getRecommendationById,
);

// Create recommendation (Admin only)
router.post(
  "/",
  isAuthenticated,
  isAdmin,
  validateRequest(CreateRecommendationSchema),
  recommendationController.createRecommendation,
);

// Mark recommendation as visited (Staff & Admin)
router.put(
  "/:id/visit",
  isAuthenticated,
  recommendationController.markAsVisited,
);

// Delete recommendation (Admin only)
router.delete(
  "/:id",
  isAuthenticated,
  isAdmin,
  recommendationController.deleteRecommendation,
);

export default router;
