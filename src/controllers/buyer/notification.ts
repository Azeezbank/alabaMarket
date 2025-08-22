import { Response, Request } from "express";
import { JwtPayload } from "jsonwebtoken";
import prisma from "../../prisma.client.js";
import { AuthRequest } from "../../middlewares/auth.middleware.js";

//Select all notification for buyer
export const getBuyerallNotifications = async (req: AuthRequest, res: Response) => {
  const userId = (req.user as JwtPayload)?.id;

  const page = parseInt(req.query.page as string) || 1;
  const limit = parseInt(req.query.limit as string) || 10;
  const skip = (page - 1) * limit;

  try {
    const total = await prisma.notification.count({
      where: { senderId: userId, isActive: true }
    });

    const notifications = await prisma.notification.findMany({
      where: { senderId: userId },
      select: {
        id: true,
        message: true,
        type: true,
        isRead: true,
        createdAt: true,
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

//select all read message
export const getBuyerReadNotifications = async (req: AuthRequest, res: Response) => {
  const userId = (req.user as JwtPayload)?.id;

  const page = parseInt(req.query.page as string) || 1;
  const limit = parseInt(req.query.limit as string) || 10;
  const skip = (page - 1) * limit;

  try {
    const total = await prisma.notification.count({
      where: { senderId: userId, isActive: true }
    });

    const notifications = await prisma.notification.findMany({
      where: { senderId: userId, isRead: true },
      select: {
        id: true,
        message: true,
        type: true,
        isRead: true,
        createdAt: true,
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


//Select all unread notification
export const getBuyerUnReadNotifications = async (req: AuthRequest, res: Response) => {
  const userId = (req.user as JwtPayload)?.id;

  const page = parseInt(req.query.page as string) || 1;
  const limit = parseInt(req.query.limit as string) || 10;
  const skip = (page - 1) * limit;

  try {
    const total = await prisma.notification.count({
      where: { senderId: userId, isActive: true }
    });

    const notifications = await prisma.notification.findMany({
      where: { senderId: userId, isRead: false },
      select: {
        id: true,
        message: true,
        type: true,
        isRead: true,
        createdAt: true,
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