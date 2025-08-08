import { Response, Request } from "express";
import { JwtPayload } from "jsonwebtoken";
import { PrismaClient } from "@prisma/client";
import { AuthRequest } from "../../middlewares/auth.middleware";
import { imagekit } from '../../service/Imagekit';

const prisma = new PrismaClient();


export const createShop = async (req: AuthRequest, res: Response) => {
    const userId = (req.user as JwtPayload)?.id;

    try {
        if (!req.file) {
            return res.status(400).json({ message: "No file uploaded" });
        }

        // Upload file buffer to ImageKit
        const result = await imagekit.upload({
            file: req.file.buffer,
            fileName: req.file.originalname,
            folder: "/uploads/seller_shop",
        });

        // Extract additional form fields
        const { name, description, address, contact, most_sell } = req.body;

        // Save to DB
        const savedRecord = await prisma.SellerShop.create({
            data: {
                name,
                logo: result.url,
                description,
                address,
                contact,
                most_sell,
                fileUrl: result.url,
                userId: userId,
                createdAt: new Date()
            },
        });

        res.status(201).json({
            message: "File uploaded and saved successfully",
            data: savedRecord,
        });
    } catch (error: any) {
        console.error("Failed to create shop", error);
        return res.status(500).json({ message: "Failed to create shop" });
    }
};