import { Router } from "express";
import { validateRequest } from "../middlewares/validate-request.js";
import { SignInSchema } from "../validators/schemas.js";
import { authController } from "../controllers/authController.js";

const router = Router();

// Sign-in page (GET)
router.get("/signin", authController.renderSignInPage);

// Sign-in handler (POST)
router.post("/signin", validateRequest(SignInSchema), authController.signIn);

// Logout handler
router.get("/logout", authController.logout);

export default router;
