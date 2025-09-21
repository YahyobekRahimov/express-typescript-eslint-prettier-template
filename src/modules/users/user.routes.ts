import { Router } from "express";
import { protect } from "../../middlewares/auth-middleware.js";
import {
  authenticateWithGoogle,
  getMe,
  getUsersRoute,
  // handleCallback,
  login,
  register,
} from "../../modules/users/user.controller.js";

const router = Router();

/**
 * @openapi
 * /auth/me:
 *   get:
 *     summary: Get the logged in user
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: The current user
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/User'
 *       401:
 *         description: Unauthorized
 */
router.get("/me", protect, getMe);

/**
 * @openapi
 * /auth/users:
 *   get:
 *     summary: Returns a list of all users
 *     tags: [Users]
 *     responses:
 *       200:
 *         description: The list of the users
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/User'
 */
router.get("/users", getUsersRoute);

/**
 * @openapi
 * /auth/register:
 *   post:
 *     summary: Create a new user
 *     tags: [Users]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/CreateUserDto'
 *     responses:
 *       201:
 *         description: The user was successfully created
 *       400:
 *         description: Bad request
 */
router.post("/register", register);

/**
 * @openapi
 * /auth/login:
 *   post:
 *     summary: Log in a user
 *     tags: [Users]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               username:
 *                 type: string
 *               password:
 *                 type: string
 *     responses:
 *       200:
 *         description: The user was successfully logged in
 *       400:
 *         description: Bad request
 */
router.post("/login", login);

/**
 * @openapi
 * /auth/google:
 *   post:
 *     summary: Redirect the user to OAuth provider
 *     tags: [Users]
 *     responses:
 *       200:
 *          description: The redirecting to google Auth provider
 *       400:
 *          description: Bad request
 */
router.get("/google", authenticateWithGoogle);

// router.get("/callback", handleCallback);

export default router;
