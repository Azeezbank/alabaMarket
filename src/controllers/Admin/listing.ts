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

        res.status(200).jsonp(listing)
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


//Fetch all boost campaign review
// export const boostCampain = async (req: AuthRequest, res: Response) => {
//     const page = parseInt(req.query.page as string) || 1;
//     const limit = parseInt(req.query.limit as string) || 10;
//     const skip = (page - 1) * limit;
//     try {

//         const campaign = await prisma.boostAd.findMany({
//             include: {
//                 user: {
//                     select: {
//                         profile: {
//                             select: {
//                                 name: true
//                             }
//                         }
//                     }
//                 }
//             },
//             orderBy: { createdAt: 'desc' },
//             skip,
//             take: limit
//         })

//         res.status(200).json(campaign)
//     } catch (err: any) {
//         console.error('Failed to select boost campaign', err)
//         return res.status(500).json({ message: 'Somthing went wrong, Failed to select boost campaign' })
//     }
// }

// update boosted product to active
// export const updateCampaign = async (req: AuthRequest, res: Response) => {
//     const userId = (req.user as JwtPayload)?.id;
//     const campaignId = req.params.campaignId as string;
//     const { status, duration } = req.body; //Duration in days

//     let durationInDays;
//     if (duration === 'Weekly') {
//         durationInDays = 7
//     } else if (duration === 'Monthly') {
//         durationInDays = 30
//     } else if (duration === 'Quarterly') {
//         durationInDays = 90
//     } else if (duration === 'Yearly') {
//         durationInDays = 365
//     } else {
//         console.log('No pln period found')
//         durationInDays = 30

//     }

//     const startDate = new Date();
//     const endDate = new Date(startDate);
//     endDate.setDate(startDate.getDate() + durationInDays);
//     try {
//         // find seller id
//         const seller = await prisma.boostAd.findUnique({
//             where: { id: campaignId },
//             include: {
//                 user: {
//                     select: {
//                         id: true
//                     }
//                 }
//             }
//         })
//         await prisma.boostAd.update({
//             where: { id: campaignId },
//             data: {
//                 startDate, endDate, status
//             }
//         })
//         const message = 'Your listing boost Ads has been approved';
//         const type = 'Boost Ads';

//         await prisma.notification.create({
//             data: {
//                 senderId: userId, message, receiverId: seller?.user?.id, type
//             }
//         })

//         res.status(200).json({ message: 'Boost campaign approved' })
//     } catch (err: any) {
//         console.error('Faied to approve ads', err)
//         return res.status(500).json({ message: 'Something went wrong, failed to approve boost ad' })
//     }
// }

//Pause or suspend listing boost status
// export const updateCampaignStatus = async (req: AuthRequest, res: Response) => {
//     const campaignId = req.params.campaignId as string;
//     const userId = (req.user as JwtPayload)?.id;
//     const { status, reason } = req.body;
//     try {
//         await prisma.boostAd.update({
//             where: { id: campaignId },
//             data: {
//                 status
//             }
//         })

//         // find seller id
//         const seller = await prisma.boostAd.findUnique({
//             where: { id: campaignId },
//             include: {
//                 user: {
//                     select: {
//                         id: true
//                     }
//                 }
//             }
//         });

//         await prisma.actionLog.create({
//             data: {
//                 boostAdId: campaignId, type: 'Boost Ads', reason, performedBy: userId
//             }
//         })

//         const sellerIs = seller?.user?.id;
//         const type = 'Boost Ads';
//         await prisma.notification.create({
//             data: {
//                 senderId: userId, message: reason, receiverId: sellerIs, type
//             }
//         })

//         res.status(200).json({ message: 'Boost updated successfully' })
//     } catch (err: any) {
//         console.error('Failed to update campaign status', err)
//         return res.status(500).json({ message: 'Somrthing went wrong, Failed to update campaign status' })
//     }
// }