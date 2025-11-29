import { Router } from "express";
import { isAuthenticated, isAdmin } from "../middlewares/auth.js";

const router = Router();

// Dashboard main page
router.get("/", isAuthenticated, (req, res) => {
  const user = req.user;
  res.render("dashboard/index", {
    user,
    isAdmin: user?.role === "admin",
    isStaff: user?.role === "staff",
  });
});

// User management page (Admin only)
router.get("/users", isAuthenticated, isAdmin, (req, res) => {
  res.render("dashboard/user-management", {
    user: req.user,
    isAdmin: true,
  });
});

// TODO: Add more dashboard routes here
// Staff page 1
// router.get("/page1", isAuthenticated, isStaff, (req, res) => {
//   res.render("dashboard/page1", { user: req.user });
// });

// Staff page 2
// router.get("/page2", isAuthenticated, isStaff, (req, res) => {
//   res.render("dashboard/page2", { user: req.user });
// });

export default router;
