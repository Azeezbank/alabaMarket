import { Response, Request } from "express";
import prisma from "../../prisma.client.js";
import { AuthRequest } from "../../middlewares/auth.middleware.js";
import { JwtPayload } from "jsonwebtoken";


//Create or update seller rating by buyer
export const sellerRating = async (req: AuthRequest, res: Response) => {
    const customerId = req.params.customerId;
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


//Create or update product rating by buyer
export const productRating = async (req: AuthRequest, res: Response) => {
    const productId = req.params.productId;
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
        console.error('Something went wrong, Failed to rate product.', err)
        return res.status(500).json({ message: 'Something went wrong, Failed to rate product' })
    }
}

//Get average rating for a product, such as 4.8 and the reviews
export const productReviewRatingAvg = async (req: AuthRequest, res: Response) => {
    const productId = req.params.productId;
    try {
        const avg = await prisma.productReview.aggregate({
            where: { productId },
            _avg: { stars: true }
        });

        const reviews = await prisma.productReview.findMany({
            where: { productId },
            select: {
                id: true,
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
                },
                reviewComment: {
                    where: { parentId: null },
                    select: {
                        id: true, content: true,
                        user: {
                            select: {
                                id: true,
                                profile: {
                                    select: {
                                        name: true, profile_pic: true,
                                    }
                                }
                            }
                        },
                    
                       
                        replies: {
                            select: {
                                id: true, content: true,
                                user: {
                                    select: {
                                        id: true,
                                        profile: {
                                            select: {
                                                name: true, profile_pic: true,
                                            }
                                        }
                                    }
                                
                            },
                            
                                replies: {
                                    select: {
                                        id: true, content: true,
                                        user: {
                                            select: {
                                                id: true,
                                                profile: {
                                                    select: {
                                                        name: true, profile_pic: true,
                                                    }
                                                }
                                            }
                                        
                                    },
                                    
                                        replies: {
                                            select: {
                                                id: true, content: true,
                                                user: {
                                                    select: {
                                                        id: true,
                                                        profile: {
                                                            select: {
                                                                name: true, profile_pic: true,
                                                            }
                                                        }
                                                    }
                                                
                                            },
                                            
                                                replies: {
                                                    select: {
                                                        id: true, content: true,
                                                        user: {
                                                            select: {
                                                                id: true,
                                                                profile: {
                                                                    select: {
                                                                        name: true, profile_pic: true,
                                                                    }
                                                                }
                                                            }
                                                        },
                                                    
                                                    
                                                        replies: {
                                                            select: {
                                                                id: true, content: true,
                                                                user: {
                                                                    select: {
                                                                        id: true,
                                                                        profile: {
                                                                            select: {
                                                                                name: true, profile_pic: true,
                                                                            }
                                                                        }
                                                                    }
                                                                }
                                                            }
                                                        }
                                        }
                                                }
                                                }
                                                }
                                                }
                                                    
                                                
                                            
                                        
                                    
                                }
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
};

//Get product rating distribution, numbers of 1, 2, 3, 4, 5
export const productRatingDistribution = async (req: AuthRequest, res: Response) => {
    const productId = req.params.productId;
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

//Submit comment for buyer product rating
export const addProductReviewComment = async (req: AuthRequest, res: Response) => {
    const reviewId = req.params.reviewId;
    const { content, parentId } = req.body; // parentId optional
    const userId = (req.user as JwtPayload)?.id;

    try {
        const review = await prisma.productReview.findUnique({
            where: { id: reviewId },
        });

        if (!review) {
            return res.status(404).json({ message: "Review not found" });
        }

        const comment = await prisma.reviewComment.create({
            data: {
                content,
                productReviewId: review.id,
                userId,
                parentId: parentId ? parentId : null,
            },
        });

        return res.status(201).json(comment);
    } catch (error) {
        return res.status(500).json({ message: "Failed to add comment", error });
    }
};
