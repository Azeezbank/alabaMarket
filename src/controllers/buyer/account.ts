import { Response, Request } from "express";
import { JwtPayload } from "jsonwebtoken";
import prisma from "../../prisma.client.js";
import { AuthRequest } from "../../middlewares/auth.middleware.js";
import { imagekit } from '../../service/Imagekit.js';

//Update user account
export const buyerSetting = async (req: AuthRequest, res: Response) => {
    const userId = (req.user as JwtPayload)?.id;
    const { name, email, phoneNumber } = req.body;
    try {
        if (!req.file) {
            return res.status(400).json({ message: "No file uploaded" });
        }

        // Upload file buffer to ImageKit
        const result = await imagekit.upload({
            file: req.file.buffer,
            fileName: req.file.originalname,
            folder: "/uploads/buyer",
        });

        await prisma.user.update({
            where: { id: userId },
            data: {
                email, phone: phoneNumber,
                profile: {
                    update: {
                        name,
                        profile_pic: result.url
                    }
                }
            }
        })

        res.status(200).json({ message: 'Profile updated successfully' })
    } catch (err: any) {
        console.error('Something went wrong, failed to update buyer profile', err)
        return res.status(500).json({ message: 'Something went wrong, failed to update buyer profile' })
    }
};