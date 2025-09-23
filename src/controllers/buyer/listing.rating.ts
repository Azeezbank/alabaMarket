import { Response, Request } from "express";
import prisma from "../../prisma.client.js";
import { AuthRequest } from "../../middlewares/auth.middleware.js";
import { JwtPayload } from "jsonwebtoken";


type CommentWithReplies = {
    id: string;
    content: string;
    createdAt: Date;
    user: {
        id: string;
        profile: { name: string | null; profile_pic: string | null } | null;
    };
    replies: CommentWithReplies[];
};


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
};


// Helper for seller rating comments with nested replies
async function getSellerRatingReplies(commentId: string): Promise<CommentWithReplies[]> {
  const replies = await prisma.sellerRatingComment.findMany({
    where: { parentId: commentId },
    select: {
      id: true,
      content: true,
      createdAt: true,
      user: {
        select: {
          id: true,
          profile: { select: { name: true, profile_pic: true } },
        },
      },
    },
    orderBy: { createdAt: "asc" },
  });

  return Promise.all(
    replies.map(async (reply) => ({
      ...reply,
      replies: await getSellerRatingReplies(reply.id),
    }))
  );
}

// Get average seller rating for a seller (userId) with comments
export const sellerReviewRatingAvg = async (req: AuthRequest, res: Response) => {
  const sellerId = req.params.sellerId;
  try {
    // average rating
    const avg = await prisma.sellerRating.aggregate({
      where: { userId: sellerId },
      _avg: { rating: true },
    });

    // fetch all ratings with root-level comments
    const ratings = await prisma.sellerRating.findMany({
      where: { userId: sellerId },
      select: {
        id: true,
        rating: true,
        comment: true,
        createdAt: true,
        customer: {
          select: {
            id: true,
            email: true,
            profile: {
              select: { name: true, profile_pic: true },
            },
          },
        },
        sellerRatingComment: {
          where: { parentId: null },
          select: {
            id: true,
            content: true,
            createdAt: true,
            user: {
              select: {
                id: true,
                profile: {
                  select: { name: true, profile_pic: true },
                },
              },
            },
          },
          orderBy: { createdAt: "desc" },
        },
      },
      orderBy: { createdAt: "desc" },
    });

    // attach recursive replies
    const ratingsWithReplies = await Promise.all(
      ratings.map(async (rating) => {
        const rootComments: CommentWithReplies[] = await Promise.all(
          rating.sellerRatingComment.map(async (comment) => ({
            ...comment,
            replies: await getSellerRatingReplies(comment.id),
          }))
        );
        return { ...rating, sellerRatingComment: rootComments };
      })
    );

    res.status(200).json({ avg, ratings: ratingsWithReplies });
  } catch (err: any) {
    console.error("Something went wrong, Failed to fetch seller rating", err);
    return res
      .status(500)
      .json({ message: "Something went wrong, Failed to fetch seller rating" });
  }
};

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


// Submit comment for seller rating
export const addSellerRatingComment = async (req: AuthRequest, res: Response) => {
  const ratingId = req.params.ratingId;
  const { content, parentId } = req.body;
  const userId = (req.user as JwtPayload)?.id;

  try {
    const rating = await prisma.sellerRating.findUnique({
      where: { id: ratingId },
    });

    if (!rating) {
      return res.status(404).json({ message: "Seller rating not found" });
    }

    const comment = await prisma.sellerRatingComment.create({
      data: {
        content,
        sellerRatingId: ratingId, // directly use ratingId
        userId,
        parentId: parentId || null,
      },
    });

    return res.status(201).json(comment);
  } catch (error) {
    console.error("Failed to add seller rating comment:", error);
    return res.status(500).json({ message: "Failed to add comment" });
  }
};


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
};

//Helper for product review with nested comments
async function getReplies(commentId: string): Promise<CommentWithReplies[]> {
    const replies = await prisma.reviewComment.findMany({
        where: { parentId: commentId },
        select: {
            id: true,
            content: true,
            createdAt: true,
            user: {
                select: {
                    id: true,
                    profile: { select: { name: true, profile_pic: true } },
                },
            },
        },
        orderBy: { createdAt: "asc" },
    });

    return Promise.all(
        replies.map(async (reply) => ({
            ...reply,
            replies: await getReplies(reply.id),
        }))
    );
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
                        id: true, content: true, createdAt: true,
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
                    },
                    orderBy: { createdAt: 'desc' },
                },
            },
            orderBy: { createdAt: 'desc' },
        });

        // attach recursive replies
        const reviewsWithReplies = await Promise.all(
            reviews.map(async (review) => {
                const reviewComments: CommentWithReplies[] = await Promise.all(
                    review.reviewComment.map(async (comment) => ({
                        ...comment,
                        replies: await getReplies(comment.id),
                    }))
                );
                return { ...review, reviewComment: reviewComments };
            })
        );

        res.status(200).json({ avg, reviews: reviewsWithReplies })
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
