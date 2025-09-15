import { Response, Request } from "express";
// import { JwtPayload } from "jsonwebtoken";
import prisma from "../../prisma.client.js";
import { AuthRequest } from "../../middlewares/auth.middleware.js";
import { JwtPayload } from "jsonwebtoken";


//Create or update product rating by buyer
export const productrating = async (req: AuthRequest, res: Response) => {
    const { productId } = req.params;
    const userId = (req.user as JwtPayload)?.id;
    const stars = parseInt(req.body.stars);
    const comment = req.body.comment;
    try {
        await prisma.productReview.upsert({
            where: {
                userId_productId: {
                    userId: userId,
                    productId: productId
                }
            },
            update: {
                stars,
                comment
            },
            create: {
                stars,
                comment,
                productId: productId,
                userId: userId,
            }
        });

        return res.status(200).json({ message: "Product rated successfully." });
    } catch (err: any) {
        console.error('Something went wrong, Failed to rate product', err)
        return res.status(500).json({ message: 'Something went wrong, Failed to rate product' })
    }
}

//Get average rating for a product, such as 4.8 and the reviews
export const productReviewRatingAvg = async (req: AuthRequest, res: Response) => {
    const { productId } = req.params;
    try {
        const avg = await prisma.productReview.aggregate({
            where: { productId },
            _avg: { stars: true }
        });

        const reviews = await prisma.productReview.findMany({
            where: { productId },
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
        console.error('Something went wrong, Failed to rate product', err)
        return res.status(500).json({ message: 'Something went wrong, Failed to rate product' })
    }
}

//Get rating distribution, numbers of 1, 2, 3, 4, 5
export const productratingDistribution = async (req: AuthRequest, res: Response) => {
    const { productId } = req.params;
    try {
        const distribution = await prisma.productReview.groupBy({
            by: ['stars'],
            where: { productId },
            _count: { stars: true },
            orderBy: { stars: 'asc' }
        });

        res.status(200).json(distribution)
    } catch (err: any) {
        console.error('Something went wrong, Failed to get rating distribution', err)
        return res.status(500).json({ message: 'Something went wrong, Failed to get rating distribution' })
    }
}
