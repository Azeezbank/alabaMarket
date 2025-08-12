import { Response, Request } from "express";
import { JwtPayload } from "jsonwebtoken";
import prisma from "@/prisma";
import { AuthRequest } from "../../middlewares/auth.middleware";



export const getNotifications = async (req: AuthRequest, res: Response) => {
  const receiverId = (req.user as JwtPayload)?.id;

  const page = parseInt(req.query.page as string) || 1;
  const limit = parseInt(req.query.limit as string) || 10;
  const skip = (page - 1) * limit;

  try {
    const total = await prisma.notification.count({
      where: { receiverId, isActive: true }
    });

    const notifications = await prisma.notification.findMany({
      where: { receiverId },
      select: {
        id: true,
        message: true,
        type: true,
        isRead: true,
        createdAt: true,
        user: {
          select: {
            id: true,
            profile: {
              select: {
                name: true
              }
            }
          }
        }
      },
      orderBy: { createdAt: 'desc' },
      skip,
      take: limit
    });

    res.status(200).json({
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit),
      notifications
    });
  } catch (error) {
    console.error("Error fetching notifications:", error);
    res.status(500).json({ message: "Failed to fetch notifications" });
  }
};