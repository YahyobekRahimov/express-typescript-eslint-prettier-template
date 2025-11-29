import { Request, Response } from "express";

export const dashboardController = {
  renderDashboard: (req: Request, res: Response) => {
    res.render("pages/home/index", {
      user: req.user,
      isAdmin: req.user?.role === "admin",
    });
  },
};
