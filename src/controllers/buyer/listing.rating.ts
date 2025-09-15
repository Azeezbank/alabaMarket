import { Response, Request } from "express";
import prisma from "../../prisma.client.js";
import { AuthRequest } from "../../middlewares/auth.middleware.js";
import { JwtPayload } from "jsonwebtoken";


//Create or update product rating by buyer
export const sellerRating = async (req: AuthRequest, res: Response) => {
    const { customerId } = req.params;
    const userId = (req.user as JwtPayload)?.id;
    const rating = parseInt(req.body.stars);
    const comment = req.body.comment;
    try {
        await prisma.sellerRating.upsert({
            where: {
                userId_customerId: {
                    userId: userId,
                    customerId: customerId
                }
            },
            update: {
                rating,
                comment
            },
            create: {
                rating,
                comment,
                customerId: customerId,
                userId: userId,
            }
        });

        return res.status(200).json({ message: "Seller rated successfully." });
    } catch (err: any) {
        console.error('Something went wrong, Failed to rate seller.', err)
        return res.status(500).json({ message: 'Something went wrong, Failed to rate seller' })
    }
}

//Get average rating for a product, such as 4.8 and the reviews
export const sellerReviewRatingAvg = async (req: AuthRequest, res: Response) => {
    const { customerId } = req.params;
    try {
        const avg = await prisma.sellerRating.aggregate({
            where: { customerId },
            _avg: { rating: true }
        });

        const reviews = await prisma.sellerRating.findMany({
            where: { customerId },
            select: {
                comment: true,
                createdAt: true,
                user: {
                    select: {
                        id: true,
                        email: true,
                        profile: {
                            select: {
                                name: true,
                                profile_pic: true
                            }
                        }
                    }
                }
            },
            orderBy: { createdAt: 'desc' }
        });

        res.status(200).json({ avg, reviews })
    } catch (err: any) {
        console.error('Something went wrong, Failed to rate seller', err)
        return res.status(500).json({ message: 'Something went wrong, Failed to rate seller' })
    }
}

//Get rating distribution, numbers of 1, 2, 3, 4, 5
export const sellerRatingDistribution = async (req: AuthRequest, res: Response) => {
    const { customerId } = req.params;
    try {
        const distribution = await prisma.sellerRating.groupBy({
            by: ['rating'],
            where: { customerId },
            _count: { rating: true },
            orderBy: { rating: 'asc' }
        });

        res.status(200).json(distribution)
    } catch (err: any) {
        console.error('Something went wrong, Failed to get rating distribution', err)
        return res.status(500).json({ message: 'Something went wrong, Failed to get rating distribution' })
    }
}
