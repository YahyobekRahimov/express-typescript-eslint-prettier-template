import cookieParser from "cookie-parser";
import express from "express";
import rateLimit from "express-rate-limit";
import helmet from "helmet";
import morgan from "morgan";
// import userRoutes from "./modules/users/user.routes.js";
import { corsConfig } from "./middlewares/cors.js";
// import { errorHandler } from "./middlewares/error-handler.js";

const app = express();

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

// Routes
// app.use("/auth", userRoutes);

app.get("/", (req, res) => {
  res.render("index", { title: "Home Page" });
});

app.get("/signin", (req, res) => {
  res.render("signin", { error: null });
});

app.post("/signin", (req, res) => {
  const { username, password } = req.body;

  // TODO: Add authentication logic here
  // For now, just log the credentials
  console.log("Sign-in attempt:", { username, password });

  // Example: If credentials are empty, show error
  if (!username || !password) {
    return res.render("signin", {
      error: "Username and password are required",
    });
  }

  // TODO: Validate credentials against database
  // res.redirect("/dashboard");
  res.render("signin", { error: "Invalid credentials" });
});

// app.use(errorHandler);

export default app;
