/* eslint-disable @typescript-eslint/no-explicit-any */
import { describe, it, expect, beforeEach, vi } from "vitest";
import { Request, Response } from "express";
import { analyticsController } from "../../controllers/analyticsController.js";
import prisma from "../../lib/prisma.js";

vi.mock("../../lib/prisma.js");

describe("analyticsController", () => {
  let mockReq: Partial<Request>;
  let mockRes: Partial<Response>;

  beforeEach(() => {
    mockReq = { params: {} };
    mockRes = {
      status: vi.fn().mockReturnThis(),
      json: vi.fn().mockReturnThis(),
    };
    vi.clearAllMocks();
  });

  describe("getDashboardStats", () => {
    it("should return dashboard statistics", async () => {
      const recCountSpy = vi.spyOn(prisma.recommendations, "count");
      vi.spyOn(prisma.delegates, "count").mockResolvedValue(50 as any);
      vi.spyOn(prisma.startups, "count").mockResolvedValue(30 as any);
      recCountSpy.mockResolvedValueOnce(100 as any);
      recCountSpy.mockResolvedValueOnce(75 as any);
      vi.spyOn(prisma.scan_log, "count").mockResolvedValue(250 as any);
      vi.spyOn(prisma.users, "count").mockResolvedValue(5 as any);

      await analyticsController.getDashboardStats(
        mockReq as Request,
        mockRes as Response,
      );

      expect(mockRes.json).toHaveBeenCalledWith(
        expect.objectContaining({
          success: true,
          data: expect.any(Object),
        }),
      );
    });

    it("should handle database errors", async () => {
      vi.spyOn(prisma.delegates, "count").mockRejectedValueOnce(
        new Error("DB error"),
      );

      await analyticsController.getDashboardStats(
        mockReq as Request,
        mockRes as Response,
      );

      expect(mockRes.status).toHaveBeenCalledWith(500);
    });
  });

  describe("getDelegateAnalytics", () => {
    it("should return 404 when delegate not found", async () => {
      mockReq.params = { delegate_id: "999" };
      vi.spyOn(prisma.delegates, "findUnique").mockResolvedValueOnce(null);

      await analyticsController.getDelegateAnalytics(
        mockReq as Request,
        mockRes as Response,
      );

      expect(mockRes.status).toHaveBeenCalledWith(404);
    });

    it("should return delegate analytics when found", async () => {
      mockReq.params = { delegate_id: "1" };
      vi.spyOn(prisma.delegates, "findUnique").mockResolvedValueOnce({
        id: 1,
        name: "John",
      } as any);
      const recCountSpy = vi.spyOn(prisma.recommendations, "count");
      recCountSpy.mockResolvedValueOnce(10 as any);
      recCountSpy.mockResolvedValueOnce(5 as any);
      vi.spyOn(prisma.recommendations, "findMany").mockResolvedValueOnce(
        [] as any,
      );

      await analyticsController.getDelegateAnalytics(
        mockReq as Request,
        mockRes as Response,
      );

      expect(mockRes.json).toHaveBeenCalledWith(
        expect.objectContaining({
          success: true,
          data: expect.objectContaining({ delegate_id: 1 }),
        }),
      );
    });
  });

  describe("getTopStartups", () => {
    it("should return startups sorted by visits", async () => {
      vi.spyOn(prisma.startups, "findMany").mockResolvedValueOnce([
        { id: 1, name: "Startup A", booth_number: 1 },
        { id: 2, name: "Startup B", booth_number: 2 },
      ] as any);

      const recCountSpy = vi.spyOn(prisma.recommendations, "count");
      recCountSpy.mockResolvedValueOnce(10 as any);
      recCountSpy.mockResolvedValueOnce(8 as any);
      recCountSpy.mockResolvedValueOnce(5 as any);
      recCountSpy.mockResolvedValueOnce(3 as any);

      await analyticsController.getTopStartups(
        mockReq as Request,
        mockRes as Response,
      );

      expect(mockRes.json).toHaveBeenCalledWith(
        expect.objectContaining({
          success: true,
          data: expect.any(Array),
        }),
      );
    });

    it("should handle database errors", async () => {
      vi.spyOn(prisma.startups, "findMany").mockRejectedValueOnce(
        new Error("DB error"),
      );

      await analyticsController.getTopStartups(
        mockReq as Request,
        mockRes as Response,
      );

      expect(mockRes.status).toHaveBeenCalledWith(500);
    });
  });
});
