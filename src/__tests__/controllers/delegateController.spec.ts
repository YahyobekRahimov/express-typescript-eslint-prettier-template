/* eslint-disable @typescript-eslint/no-explicit-any */
import { describe, it, expect, beforeEach, vi } from "vitest";
import { Request, Response } from "express";
import { delegateController } from "../../controllers/delegateController.js";
import prisma from "../../lib/prisma.js";

vi.mock("../../lib/prisma.js");

describe("delegateController", () => {
  let mockReq: Partial<Request>;
  let mockRes: Partial<Response>;

  beforeEach(() => {
    mockReq = {
      body: {},
      params: {},
    };

    mockRes = {
      status: vi.fn().mockReturnThis(),
      json: vi.fn().mockReturnThis(),
    };

    vi.clearAllMocks();
  });

  describe("getAllDelegates", () => {
    it("should return list of delegates", async () => {
      vi.spyOn(prisma.delegates, "findMany").mockResolvedValueOnce([]);

      await delegateController.getAllDelegates(
        mockReq as Request,
        mockRes as Response,
      );
      expect(mockRes.json).toHaveBeenCalledWith(
        expect.objectContaining({ success: true }),
      );
    });

    it("should handle database errors", async () => {
      vi.spyOn(prisma.delegates, "findMany").mockRejectedValueOnce(
        new Error("DB error"),
      );

      await delegateController.getAllDelegates(
        mockReq as Request,
        mockRes as Response,
      );
      expect(mockRes.status).toHaveBeenCalledWith(500);
    });
  });

  describe("getDelegateById", () => {
    it("should return 404 when not found", async () => {
      mockReq.params = { id: "999" };
      vi.spyOn(prisma.delegates, "findUnique").mockResolvedValueOnce(null);

      await delegateController.getDelegateById(
        mockReq as Request,
        mockRes as Response,
      );
      expect(mockRes.status).toHaveBeenCalledWith(404);
    });

    it("should return delegate when found", async () => {
      mockReq.params = { id: "1" };
      vi.spyOn(prisma.delegates, "findUnique").mockResolvedValueOnce({
        id: 1,
        name: "John",
      } as any);

      await delegateController.getDelegateById(
        mockReq as Request,
        mockRes as Response,
      );
      expect(mockRes.json).toHaveBeenCalledWith(
        expect.objectContaining({ success: true }),
      );
    });
  });

  describe("getDelegateByBadgeId", () => {
    it("should find delegate by badge", async () => {
      mockReq.params = { badge_id: "BADGE123" };
      vi.spyOn(prisma.delegates, "findUnique").mockResolvedValueOnce({
        badge_id: "BADGE123",
      } as any);

      await delegateController.getDelegateByBadgeId(
        mockReq as Request,
        mockRes as Response,
      );
      expect(mockRes.json).toHaveBeenCalledWith(
        expect.objectContaining({ success: true }),
      );
    });
  });

  describe("createDelegate", () => {
    it("should return 400 when badge exists", async () => {
      mockReq.body = {
        badge_id: "BADGE123",
        name: "John",
        email: "john@test.com",
        job_title: "Dev",
        company_name: "Corp",
      };
      vi.spyOn(prisma.delegates, "findUnique").mockResolvedValueOnce({
        badge_id: "BADGE123",
      } as any);

      await delegateController.createDelegate(
        mockReq as Request,
        mockRes as Response,
      );
      expect(mockRes.status).toHaveBeenCalledWith(400);
    });

    it("should create delegate on success", async () => {
      mockReq.body = {
        badge_id: "BADGE456",
        name: "Jane",
        email: "jane@test.com",
        job_title: "Designer",
        company_name: "Design Co",
      };
      vi.spyOn(prisma.delegates, "findUnique").mockResolvedValueOnce(null);
      vi.spyOn(prisma.delegates, "create").mockResolvedValueOnce({
        id: 2,
      } as any);

      await delegateController.createDelegate(
        mockReq as Request,
        mockRes as Response,
      );
      expect(mockRes.status).toHaveBeenCalledWith(201);
    });
  });

  describe("updateDelegate", () => {
    it("should return 404 when not found", async () => {
      mockReq.params = { id: "999" };
      mockReq.body = { name: "Updated" };
      vi.spyOn(prisma.delegates, "findUnique").mockResolvedValueOnce(null);

      await delegateController.updateDelegate(
        mockReq as Request,
        mockRes as Response,
      );
      expect(mockRes.status).toHaveBeenCalledWith(404);
    });

    it("should update delegate on success", async () => {
      mockReq.params = { id: "1" };
      mockReq.body = { name: "Updated" };
      vi.spyOn(prisma.delegates, "findUnique").mockResolvedValueOnce({
        id: 1,
      } as any);
      vi.spyOn(prisma.delegates, "update").mockResolvedValueOnce({
        id: 1,
        name: "Updated",
      } as any);

      await delegateController.updateDelegate(
        mockReq as Request,
        mockRes as Response,
      );
      expect(mockRes.json).toHaveBeenCalledWith(
        expect.objectContaining({ success: true }),
      );
    });
  });

  describe("deleteDelegate", () => {
    it("should delete delegate successfully", async () => {
      mockReq.params = { id: "1" };
      vi.spyOn(prisma.delegates, "delete").mockResolvedValueOnce({} as any);

      await delegateController.deleteDelegate(
        mockReq as Request,
        mockRes as Response,
      );
      expect(mockRes.json).toHaveBeenCalledWith(
        expect.objectContaining({ success: true }),
      );
    });

    it("should handle not found error", async () => {
      mockReq.params = { id: "999" };
      vi.spyOn(prisma.delegates, "delete").mockRejectedValueOnce({
        code: "P2025",
      });

      await delegateController.deleteDelegate(
        mockReq as Request,
        mockRes as Response,
      );
      expect(mockRes.status).toHaveBeenCalledWith(404);
    });
  });
});
