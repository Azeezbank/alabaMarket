import { Response, Request } from "express";
import { JwtPayload } from "jsonwebtoken";
import prisma from "../../prisma.client.js";
import { AuthRequest } from "../../middlewares/auth.middleware.js";
import { imagekit } from '../../service/Imagekit.js';

//Create product categories
export const productCategories = async (req: AuthRequest, res: Response) => {
    const { category } = req.body;

    try {
        if (!req.file) {
            return res.status(400).json({ message: "No file uploaded" });
        }

        // Upload file buffer to ImageKit
                const result = await imagekit.upload({
                    file: req.file.buffer,
                    fileName: req.file.originalname,
                    folder: "/uploads/category",
                });

                await prisma.category.create({
                    data: {
                        image: result.url, name: category
                    }
                })

                res.status(201).json({ message: 'Category created'})
    } catch (err: any) {
        console.error('Something went wrong, Failed to create category', err)
        return res.status(500).json({ message: 'Something went wrong, Failed to create category'});
    }
}

//Fetch all category
export const getCategories = async (req: AuthRequest, res: Response) => {
    try {
        const categories = await prisma.category.findMany({
            select: {
                id: true, image: true, name: true
            }
        })

        res.status(200).json(categories)
    } catch (err: any) {
        console.error('Something went wrong', err)
        return res.status(500).json({message: 'Something went wrong' })
    }
};