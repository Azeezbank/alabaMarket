import { Response, Request } from "express";
import { JwtPayload } from "jsonwebtoken";
import prisma from "../../prisma.client.js";
import { AuthRequest } from "../../middlewares/auth.middleware.js";


//fetch all notification
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

//Fetch notification where type is Listings
export const listingNotification = async (req: AuthRequest, res: Response) => {
   const receiverId = (req.user as JwtPayload)?.id;
   const type = 'Listing updates'
  try {
    const listingNotification = await prisma.notification.findMany({
      where: { receiverId, type},
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
    });
    res.status(200).json(listingNotification)
  } catch (err: any) {
    console.error('Something went wrong, Failed to select listing notification')
  }
}

//Fetch notification where type is video calls
export const videoNotification = async (req: AuthRequest, res: Response) => {
   const receiverId = (req.user as JwtPayload)?.id;
   const type = 'Video calls'
  try {
    const videoNotification = await prisma.notification.findMany({
      where: { receiverId, type},
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
    });
    res.status(200).json(videoNotification)
  } catch (err: any) {
    console.error('Something went wrong, Failed to select listing notification')
  }
}

//Fetch notification where type is performance/Boosted ads
export const adNotification = async (req: AuthRequest, res: Response) => {
   const receiverId = (req.user as JwtPayload)?.id;
   const type = 'Boosted ad'
  try {
    const adNotification = await prisma.notification.findMany({
      where: { receiverId, type},
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
    });
    res.status(200).json(adNotification)
  } catch (err: any) {
    console.error('Something went wrong, Failed to select listing notification')
  }
}

//Fetch notification where type is Review and ratings
export const reviewNotification = async (req: AuthRequest, res: Response) => {
   const receiverId = (req.user as JwtPayload)?.id;
   const type = 'Review and ratings'
  try {
    const reviewNotification = await prisma.notification.findMany({
      where: { receiverId, type},
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
    });
    res.status(200).json(reviewNotification)
  } catch (err: any) {
    console.error('Something went wrong, Failed to select listing notification')
  }
}

