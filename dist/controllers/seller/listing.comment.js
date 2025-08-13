import prisma from "../../prisma.client.js";
export const createComment = async (req, res) => {
    const userId = req.user?.id;
    const { productId, content } = req.body;
    if (!content || !productId) {
        return res.status(400).json({ message: "Product ID and content are required" });
    }
    try {
        const comment = await prisma.comment.create({
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
    }
    catch (err) {
        console.error("Error creating comment:", err);
        res.status(500).json({ message: "Failed to create comment" });
    }
};
// Fetch comments for a product
export const getCommentsByProduct = async (req, res) => {
    const productId = req.params.productId;
    try {
        const comments = await prisma.comment.findMany({
            where: { productId },
            orderBy: { createdAt: "desc" },
            include: { user: true } // include commenter info
        });
        res.status(200).json(comments);
    }
    catch (err) {
        console.error("Error fetching comments:", err);
        res.status(500).json({ message: "Failed to fetch comments" });
    }
};
