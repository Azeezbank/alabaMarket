import { Response, Request } from "express";
import { JwtPayload } from "jsonwebtoken";
import prisma from "../../prisma.client.js";
import { AuthRequest } from "../../middlewares/auth.middleware.js";


//Fetch all  listing
export const allListing = async (req: AuthRequest, res: Response) => {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 10;
    const skip = (page - 1) * limit;
    try {

        const total = await prisma.product.count();
        const listing = await prisma.product.findMany({
            include: {
                productPhoto: true,
                productPricing: true,
                productVideo: true,
                productReview: true,
                user: {
                    select: {
                        profile: {
                            select: {
                                name: true, profile_pic: true
                            }
                        }
                    }
                }
            },
            orderBy: { createdAt: 'desc' },
            skip,
            take: limit
        })

        res.status(200).jsonp({ listing, page, limit, total, totalPages: Math.ceil(total / limit) })
    } catch (err: any) {
        console.error({ message: ']Something went wrong, failed to select free listing', err })
        return res.status(500).json({ message: 'Something went wrong, failed to select free listing' })
    }
}

//Approve listing
export const approveListing = async (req: AuthRequest, res: Response) => {
    const productId = req.params.productId as string;
    const userId = (req.user as JwtPayload)?.id;
    try {

        await prisma.product.update({
            where: { id: productId },
            data: {
                status: 'Approved'
            }
        })

        //Find product owner
        const owner = await prisma.product.findUnique({
            where: { id: productId },
            select: {
                user: {
                    select: {
                        id: true
                    }
                }
            }
        });

        const type = 'Approved Listing';
        const message = 'Your listing has benn approved';

        await prisma.notification.create({
            data: {
                senderId: userId, message, receiverId: owner?.user.id, type
            }
        });

        res.status(200).json({ message: 'Listing accepted and notificatiojn sent' })
    } catch (err: any) {
        console.error('Failed to Accept Listing', err)
        return res.status(500).json({ message: 'Something went wrong, Failed to accept Listing' })
    }
}

// reject free listing request
export const rejectListing = async (req: AuthRequest, res: Response) => {
    const productId = req.params.productId as string;
    const reason = req.body.reason;
    const userId = (req.user as JwtPayload)?.id;
    try {

        await prisma.product.update({
            where: { id: productId },
            data: {
                status: 'Rejected'
            }
        })

        await prisma.actionLog.create({
            data: {
                productId, type: 'Listing', action: 'Rejected', reason, performedBy: userId
            }
        });

        //Find product owner
        const owner = await prisma.product.findUnique({
            where: { id: productId },
            select: {
                user: {
                    select: {
                        id: true
                    }
                }
            }
        });

        const type = 'Flagged Listing';

        await prisma.notification.create({
            data: {
                senderId: userId, message: reason, receiverId: owner?.user.id, type
            }
        });

        res.status(200).json({ message: 'Listing Rejected and notificatiojn sent' })
    } catch (err: any) {
        console.error('Failed to reject Listing', err)
        return res.status(500).json({ message: 'Something went wrong, Failed to reject Listing' })
    }
}
