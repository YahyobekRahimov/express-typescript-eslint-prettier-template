import { describe, it, expect, beforeEach, vi } from "vitest";
import { Request, Response } from "express";
import { authController } from "../../controllers/authController.js";
import prisma from "../../lib/prisma.js";

vi.mock("../../lib/prisma.js");

describe("authController", () => {
  let mockReq: Partial<Request>;
  let mockRes: Partial<Response>;

  beforeEach(() => {
    mockReq = {
      body: {},
      cookies: {},
    };

    mockRes = {
      render: vi.fn().mockReturnThis(),
      redirect: vi.fn().mockReturnThis(),
      clearCookie: vi.fn().mockReturnThis(),
      cookie: vi.fn().mockReturnThis(),
    };

    vi.clearAllMocks();
  });

  describe("renderSignInPage", () => {
    it("should render login page", () => {
      authController.renderSignInPage(mockReq as Request, mockRes as Response);
      expect(mockRes.render).toHaveBeenCalledWith("pages/login/index", {
        error: null,
      });
    });
  });

  describe("signIn", () => {
    it("should handle invalid credentials", async () => {
      mockReq.body = { username: "test", password: "wrong" };
      vi.spyOn(prisma.users, "findUnique").mockResolvedValueOnce(null);

      await authController.signIn(mockReq as Request, mockRes as Response);
      expect(mockRes.render).toHaveBeenCalledWith(
        "pages/login/index",
        expect.objectContaining({ error: "Invalid credentials" }),
      );
    });

    it("should handle database errors", async () => {
      mockReq.body = { username: "test", password: "test" };
      vi.spyOn(prisma.users, "findUnique").mockRejectedValueOnce(
        new Error("DB error"),
      );

      await authController.signIn(mockReq as Request, mockRes as Response);
      expect(mockRes.render).toHaveBeenCalledWith(
        "pages/login/index",
        expect.objectContaining({
          error: "An error occurred. Please try again.",
        }),
      );
    });
  });

  describe("logout", () => {
    it("should clear cookie and redirect", () => {
      authController.logout(mockReq as Request, mockRes as Response);
      expect(mockRes.clearCookie).toHaveBeenCalledWith("authToken");
      expect(mockRes.redirect).toHaveBeenCalledWith("/auth/signin");
    });
  });
});
