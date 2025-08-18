import { Response, Request } from "express";
import prisma from "../../prisma.client.js";
import { AuthRequest } from "../../middlewares/auth.middleware.js";

//Fetch all categories
export const fetchcategories = async (req: AuthRequest, res: Response) => {
    try {
        const categories = await prisma.category.findMany({
            select: {
                id: true, image: true, name: true, createdAt: true,
                _count: {
                    select: {
                        product: true
                    }
                }
            }
        });

        res.status(200).json(categories)
    } catch (err: any) {
        console.error('Something went wrong, Failed to select categories', err)
        return res.status(500).json({ message: 'Something went wrong, Failed to select categories' })
    }
};
