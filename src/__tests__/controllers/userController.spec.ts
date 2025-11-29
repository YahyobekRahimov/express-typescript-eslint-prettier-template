/* eslint-disable @typescript-eslint/no-explicit-any */
import { describe, it, expect, beforeEach, vi } from "vitest";
import { Request, Response } from "express";
import { userController } from "../../controllers/userController.js";
import prisma from "../../lib/prisma.js";
import bcryptjs from "bcryptjs";

vi.mock("../../lib/prisma.js");
vi.mock("bcryptjs");

describe("userController", () => {
  let mockReq: Partial<Request>;
  let mockRes: Partial<Response>;

  beforeEach(() => {
    mockReq = {
      body: {},
      params: {},
      user: { id: 1, username: "admin" },
    };

    mockRes = {
      status: vi.fn().mockReturnThis(),
      json: vi.fn().mockReturnThis(),
      render: vi.fn().mockReturnThis(),
    };

    vi.clearAllMocks();
  });

  describe("getAllUsers", () => {
    it("should render users page on success", async () => {
      vi.spyOn(prisma.users, "findMany").mockResolvedValueOnce([]);

      await userController.getAllUsers(mockReq as Request, mockRes as Response);
      expect(mockRes.render).toHaveBeenCalledWith(
        "pages/user-management/index",
        expect.any(Object),
      );
    });

    it("should render with empty list on error", async () => {
      vi.spyOn(prisma.users, "findMany").mockRejectedValueOnce(
        new Error("DB error"),
      );

      await userController.getAllUsers(mockReq as Request, mockRes as Response);
      expect(mockRes.render).toHaveBeenCalledWith(
        "pages/user-management/index",
        expect.objectContaining({ users: [] }),
      );
    });
  });

  describe("createUser", () => {
    it("should return 400 when username exists", async () => {
      mockReq.body = { username: "existing", password: "pass" };
      vi.spyOn(prisma.users, "findUnique").mockResolvedValueOnce({
        id: 1,
      } as any);

      await userController.createUser(mockReq as Request, mockRes as Response);
      expect(mockRes.status).toHaveBeenCalledWith(400);
    });

    it("should create user on success", async () => {
      mockReq.body = { username: "newuser", password: "pass" };
      vi.spyOn(prisma.users, "findUnique").mockResolvedValueOnce(null);
      vi.spyOn(bcryptjs, "hash").mockResolvedValueOnce("hashed" as any);
      vi.spyOn(prisma.users, "create").mockResolvedValueOnce({ id: 2 } as any);

      await userController.createUser(mockReq as Request, mockRes as Response);
      expect(mockRes.status).toHaveBeenCalledWith(201);
    });
  });

  describe("updateUserPassword", () => {
    it("should return 404 when user not found", async () => {
      mockReq.params = { id: "999" };
      vi.spyOn(prisma.users, "findUnique").mockResolvedValueOnce(null);

      await userController.updateUserPassword(
        mockReq as Request,
        mockRes as Response,
      );
      expect(mockRes.status).toHaveBeenCalledWith(404);
    });

    it("should update password on success", async () => {
      mockReq.params = { id: "1" };
      mockReq.body = { password: "newpass" };
      vi.spyOn(prisma.users, "findUnique").mockResolvedValueOnce({
        id: 1,
      } as any);
      vi.spyOn(bcryptjs, "hash").mockResolvedValueOnce("hashed" as any);
      vi.spyOn(prisma.users, "update").mockResolvedValueOnce({ id: 1 } as any);

      await userController.updateUserPassword(
        mockReq as Request,
        mockRes as Response,
      );
      expect(mockRes.json).toHaveBeenCalledWith(
        expect.objectContaining({ success: true }),
      );
    });
  });

  describe("deleteUser", () => {
    it("should delete user successfully", async () => {
      mockReq.params = { id: "1" };
      vi.spyOn(prisma.users, "delete").mockResolvedValueOnce({} as any);

      await userController.deleteUser(mockReq as Request, mockRes as Response);
      expect(mockRes.json).toHaveBeenCalledWith(
        expect.objectContaining({ success: true }),
      );
    });

    it("should handle not found error", async () => {
      mockReq.params = { id: "999" };
      vi.spyOn(prisma.users, "delete").mockRejectedValueOnce({
        code: "P2025",
      });

      await userController.deleteUser(mockReq as Request, mockRes as Response);
      expect(mockRes.status).toHaveBeenCalledWith(404);
    });
  });
});
