import { Response, Request } from "express";
import { JwtPayload } from "jsonwebtoken";
import prisma from "../../prisma.client.js";
import { AuthRequest } from "../../middlewares/auth.middleware.js";

//Like and unlike a product
export const likes = async (req: AuthRequest, res: Response) => {
  const userId = (req.user as JwtPayload)?.id;
  const productId = req.params.productId;
  try {
    const existing = await prisma.likes.findUnique({
      where: { userId_productId: { userId, productId } },
    });

    if (existing) {
      // Remove like
      await prisma.likes.delete({
        where: { userId_productId: { userId, productId } },
      });
    } else {
      // Add like
      await prisma.likes.create({
        data: { userId, productId },
      });
    }

    // Count total likes for the product
    const likeCount = await prisma.likes.count({
      where: { productId },
    });

    res.status(201).json({ message: 'Likes/unliked successfully', likeCount })
  } catch (err: any) {
    console.error('Something went wrong, failed to Like or unlike product', err)
    return res.status(500).json({ message: 'Something went wrong, failed to Like or unlike product' })
  }
}


//Love a product
export const love = async (req: AuthRequest, res: Response) => {
  const userId = (req.user as JwtPayload)?.id;
  const productId = req.params.productId;
  try {
    const existing = await prisma.love.findUnique({
      where: { userId_productId: { userId, productId } },
    });

    if (existing) {
      // Remove love
      await prisma.love.delete({
        where: { userId_productId: { userId, productId } },
      });
    } else {
      // Add love
      await prisma.love.create({
        data: { userId, productId },
      });
    }

    // Count total love for the product
    const loveCount = await prisma.love.count({
      where: { productId },
    });

    res.status(201).json({ message: 'Loved successfully', loveCount })
  } catch (err: any) {
    console.error('Something went wrong, failed to Like or unlove product', err)
    return res.status(500).json({ message: 'Something went wrong, failed to Like or unlove product' })
  }
}