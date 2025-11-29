import cookieParser from "cookie-parser";
import express from "express";
import rateLimit from "express-rate-limit";
import helmet from "helmet";
import morgan from "morgan";
import userRoutes from "./routes/users.js";
import dashboardRoutes from "./routes/dashboard.js";
import { corsConfig } from "./middlewares/cors.js";
import { verifyJWT } from "./middlewares/auth.js";
import path from "path";
import { fileURLToPath } from "url";
// import { errorHandler } from "./middlewares/error-handler.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

// Serve static files from the 'public' directory
app.use(express.static(path.join(__dirname, "public")));

// Serve JS files from views directory
app.use("/js", express.static(path.join(__dirname, "../src/views/js")));

app.set("view engine", "ejs");
app.set("views", "src/views");

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

// JWT verification middleware
app.use(verifyJWT);

// Routes
app.use("/auth", userRoutes);
app.use("/dashboard", dashboardRoutes);

app.get("/", (req, res) => {
  if (!req.user) {
    return res.redirect("/auth/signin");
  }
  return res.redirect("/dashboard");
});

// app.use(errorHandler);

export default app;
