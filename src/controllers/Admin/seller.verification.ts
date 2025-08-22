import { Response, Request } from "express";
import { JwtPayload } from "jsonwebtoken";
import prisma from "../../prisma.client.js";
import { AuthRequest } from "../../middlewares/auth.middleware.js";

//Fect seller verification review
export const sellerVerificationReview = async (req: AuthRequest, res: Response) => {
    try {
        const sellerVerification = await prisma.sellerVerification.findMany({
            select: {
                ID_card: true, createdAt: true, status: true,
                user: {
                    select: {
                        profile: {
                            select: {
                                name: true
                            }
                        },
                        sellerShop: {
                            select: {
                                storeName: true,
                                logo: true
                            }
                        }
                    }
                }
            }
        })
        res.status(200).json(sellerVerification)
    } catch (err: any) {
        console.error('Failed to select seller verification', err)
        return res.status(500).json({message: 'Something went wrong, Failed to select seller verification'})
    }
}

//Approve seller verification
export const approveSellerVerification = async (req: AuthRequest, res: Response) => {
    const verificationId = req.params.verificationId as string;
    const status = 'Approved';
    try {
        await prisma.sellerVerification.update({ where: { id: verificationId},
        data: {
            isVerified: true, status
        }
        })
        res.status(200).json({message: 'Seller Verified successfully'})
    } catch (err: any) {
        console.error('Failed to verified seller', err)
        return res.status(500).json({ message: 'Something went wrong, Failed to verified seller'})
    }
}

//Reject seller verification
export const rejectSellerVerification = async (req: AuthRequest, res: Response) => {
    const verificationId = req.params.verificationId as string;
    const status = 'Rejected';
    const reason = req.body.reason;
    const userId = (req.user as JwtPayload)?.id;
    try {
       const seller = await prisma.sellerVerification.update({ where: { id: verificationId},
        data: {
            status
        },
        include: {
            user: {
                select: {
                    id: true
                }
            }
        }
        })

        await prisma.actionLog.create({
            data: {
                sellerVerificationId: verificationId, type: 'Verification', action: 'Rejected', reason, performedBy: userId
            }
        });

        const sellerId = seller.user.id;
        const type = 'User Activity';

        await prisma.notification.create({
            data: {
                senderId: userId, message: reason, receiverId: sellerId, type
            }
        })

        res.status(200).json({ message: 'Seller verification rejected successfully'})
    } catch (err: any) {
        console.error('Failed to reject seller verification', err)
        return res.status(500).json({ message: 'Something went wrong, Failed to reject seller verification'})
    }
}