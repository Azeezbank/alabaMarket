import { Response, Request } from "express";
import { JwtPayload } from "jsonwebtoken";
import prisma from "@/prisma";
import { AuthRequest } from "../../middlewares/auth.middleware";


export const createComment = async (req: AuthRequest, res: Response) => {
  const userId = (req.user as JwtPayload)?.id;
  const { productId, content } = req.body;

  if (!content || !productId) {
    return res.status(400).json({ message: "Product ID and content are required" });
  }

  try {
    const comment = await prisma.Comment.create({
      data: {
        content,
        productId,
        userId,
      },
      include: {
        user: true, // optionally include user info
      }
    });

    res.status(201).json({ message: "Comment created", comment });
  } catch (err) {
    console.error("Error creating comment:", err);
    res.status(500).json({ message: "Failed to create comment" });
  }
};

// Fetch comments for a product
export const getCommentsByProduct = async (req: Request, res: Response) => {
  const productId = req.params.productId;

  try {
    const comments = await prisma.Comment.findMany({
      where: { productId },
      orderBy: { createdAt: "desc" },
      include: { user: true } // include commenter info
    });

    res.status(200).json(comments);
  } catch (err) {
    console.error("Error fetching comments:", err);
    res.status(500).json({ message: "Failed to fetch comments" });
  }
};