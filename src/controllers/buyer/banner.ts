import { Response, Request } from "express";
import prisma from "../../prisma.client.js";
import { AuthRequest } from "../../middlewares/auth.middleware.js";


// Get all active banners (not expired yet)
export const getActiveBanners = async (req: AuthRequest, res: Response) => {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 10;
    const skip = (page - 1) * limit;

  try {

    const total = await prisma.banner.count();

    const now = new Date();

    const banners = await prisma.banner.findMany({
      where: {
        startDate: { lte: now }, // banner already started
        endDate: { gt: now },    // and not expired
        status: "Active"         // optional: only if you also want Active
      },
      select: {
        id: true, image: true, title: true, page: true, placement: true, createdAt: true
      },
      orderBy: { createdAt: "desc" },
      skip,
        take: limit
    });

    res.status(200).json({page, limit, total, totalPage: Math.ceil(total / limit), banners });
  } catch (err: any) {
    console.error("Failed to fetch active banners", err);
    return res.status(500).json({ message: "Something went wrong, failed to fetch banners" });
  }
};