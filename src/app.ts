import cookieParser from "cookie-parser";
import express from "express";
import rateLimit from "express-rate-limit";
import helmet from "helmet";
import morgan from "morgan";
import swaggerUi from "swagger-ui-express";
import userRoutes from "./modules/users/user.routes.js";

import { swaggerSpec } from "./config/swagger.js";
import { corsConfig } from "./middlewares/cors.js";
// import { errorHandler } from "./middlewares/error-handler.js";
import { connectDB } from "./db.js";

const app = express();

connectDB();

// Body Parsers
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Security Middlewares
app.use(corsConfig);
app.use(helmet());
app.use(cookieParser());
app.use(rateLimit({ windowMs: 15 * 60 * 1000, max: 1000 }));

// Logging
app.use(morgan("dev"));

// Swagger API Route
app.use("/api", swaggerUi.serve, swaggerUi.setup(swaggerSpec));

// Routes
app.use("/auth", userRoutes);

// app.use(errorHandler);

export default app;
