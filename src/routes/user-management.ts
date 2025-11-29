import { Router } from "express";
import { isAuthenticated, isAdmin } from "../middlewares/auth.js";
import { validateRequest } from "../middlewares/validate-request.js";
import {
  CreateUserSchema,
  UpdateUserPasswordSchema,
} from "../validators/schemas.js";
import { userController } from "../controllers/userController.js";

const router = Router();

// Get all staff users (Admin only) - GET (renders page)
router.get("/", isAuthenticated, isAdmin, userController.getAllUsers);

// Add new user (Admin only) - POST
router.post(
  "/",
  isAuthenticated,
  isAdmin,
  validateRequest(CreateUserSchema),
  userController.createUser,
);

// Update user password (Admin only) - PUT
router.put(
  "/:id",
  isAuthenticated,
  isAdmin,
  validateRequest(UpdateUserPasswordSchema),
  userController.updateUserPassword,
);

// Delete user (Admin only) - DELETE
router.delete("/:id", isAuthenticated, isAdmin, userController.deleteUser);

export default router;
