import { Request, Response } from "express";

export const dashboardController = {
  renderDashboard: (req: Request, res: Response) => {
    res.render("pages/home/index", {
      user: req.user,
      isAdmin: req.user?.role === "admin",
    });
  },

  renderDelegates: (req: Request, res: Response) => {
    res.render("pages/delegates/index", {
      user: req.user,
      isAdmin: req.user?.role === "admin",
    });
  },

  renderStartups: (req: Request, res: Response) => {
    res.render("pages/startups/index", {
      user: req.user,
      isAdmin: req.user?.role === "admin",
    });
  },

  renderRecommendations: (req: Request, res: Response) => {
    res.render("pages/recommendations/index", {
      user: req.user,
      isAdmin: req.user?.role === "admin",
    });
  },

  renderScanLogs: (req: Request, res: Response) => {
    res.render("pages/scan-logs/index", {
      user: req.user,
      isAdmin: req.user?.role === "admin",
    });
  },

  renderAnalytics: (req: Request, res: Response) => {
    res.render("pages/analytics/index", {
      user: req.user,
      isAdmin: req.user?.role === "admin",
    });
  },
};
