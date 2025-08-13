import prisma from "../../prisma.client.js";
export const getNotifications = async (req, res) => {
    const receiverId = req.user?.id;
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
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
    }
    catch (error) {
        console.error("Error fetching notifications:", error);
        res.status(500).json({ message: "Failed to fetch notifications" });
    }
};
