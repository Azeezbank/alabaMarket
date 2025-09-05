import { Response, Request } from "express";
import { JwtPayload } from "jsonwebtoken";
import prisma from "../../prisma.client.js";
import { AuthRequest } from "../../middlewares/auth.middleware.js";
import { imagekit } from '../../service/Imagekit.js';


export const SellerVerification = async (req: AuthRequest, res: Response) => {
    const userId = (req.user as JwtPayload)?.id;

    try {
        if (!req.files) {
            console.error("No file uploaded");
            return res.status(400).json({ message: "No file uploaded" });
        }


        const files = req.files as { [fieldname: string]: Express.Multer.File[] };

        // Upload to ImageKit
        const idcard = await imagekit.upload({
            file: files.idCard[0].buffer,
            fileName: files.idCard[0].originalname,
            folder: "/uploads/seller_verification",
        });

        //Upload passport
        const passsprt = await imagekit.upload({
            file: files.passport[0].buffer,
            fileName: files.passport[0].originalname,
            folder: "/uploads/seller_verification",
        });

        //Save to DB
        const savedRecord = await prisma.sellerVerification.create({
            data: {
                userId: userId,
                ID_card: idcard.url,
                selfie: passsprt.url,
                createdAt: new Date()
            }
        })

        res.status(201).json({ message: "Files uploaded and saved successfully", data: savedRecord });
    } catch (error: any) {
        console.error("Failed to upload files", error);
        return res.status(500).json({ message: "Failed to upload files" });
    }
};

//Update seller verification
export const updateVerificationIdCard = async (req: AuthRequest, res: Response) => {
    const userid = (req.user as JwtPayload)?.id;
    try {
        if (!req.file) {
            console.error("No file uploaded");
            return res.status(400).json({ message: "No file uploaded" });
        }

        const files = req.files as { [fieldname: string]: Express.Multer.File[] };

        // Upload to ImageKit
        const idcard = await imagekit.upload({
            file: files.idCard[0].buffer,
            fileName: files.idCard[0].originalname,
            folder: "/uploads/seller_verification",
        });

        // Update in DB
        const updatedRecord = await prisma.sellerVerification.update({
            where: { userId: userid },
            data: {
                ID_card: idcard.url
            }
        });

        res.status(200).json({ message: "File updated successfully", updatedRecord });
    } catch (err: any) {
        console.error("Failed to update file", err);
        return res.status(500).json({ message: "Failed to update file" });
    }
}

//Chexk if user is a seller or not
export const isSeller = async (req: AuthRequest, res: Response) => {
    const userId = (req.user as JwtPayload)?.id;
    try {
        const isSeller = await prisma.user.findUnique({ where: { id: userId},
        select: {
            profile: {
                select: {
                    role: true
                }
            }
        }
        })

        const sellerRole = isSeller?.profile?.role;
        if (!sellerRole || sellerRole !== 'Seller' ) {
            console.log('User is not a seller, proceed to become a seller')
            return res.status(400).json({ message: 'User is not a seller, proceed to become a seller'})
        }
        res.status(200).json(isSeller)
    } catch (err: any) {
        console.error('Something went wrong, failed to check user role status', err)
        return res.status(500).json({message: 'Something went wrong, failed to check user role status' })
    }
}