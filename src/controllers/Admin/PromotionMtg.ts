import { Response, Request } from "express";
import { JwtPayload } from "jsonwebtoken";
import prisma from "../../prisma.client.js";
import { AuthRequest } from "../../middlewares/auth.middleware.js";
import { imagekit } from '../../service/Imagekit.js';

//Select all from promotional Banner Management
export const promoBannerMgt = async (req: AuthRequest, res: Response) => {
    try {
        const banner = await prisma.promoBannerMgt.findMany({
            select: {
                id: true, image: true, title: true, page: true, placement: true, uploadedBy: true, startDate: true, endDate: true, status: true
            },
            orderBy: { createdAt: 'desc' },
        })
        res.status(200).json(banner)
    } catch (err: any) {
        console.error('Failed to select banners', err)
        return res.status(500).json({ message: 'Something went wrong, Failed to select banners' })
    }
}

//Upload new promotional banner
export const createBanner = async (req: AuthRequest, res: Response) => {
    const { title, page, placement, startDate, endDate, status } = req.body;
    const userId = (req.user as JwtPayload)?.id;
    try {

        const uploadedBy = await prisma.user.findUnique({
            where: { id: userId },
            select: {
                profile: {
                    select: {
                        name: true
                    }
                }
            }
        })
        if (!uploadedBy) {
            console.log('No uploader found');
            return res.status(404).json({ message: 'No uploader found' })
        }

        // Upload file buffer to ImageKit
    if (!req.file) {
      return res.status(400).json({ message: "No file provided" });
    }

        const result = await imagekit.upload({
            file: req.file.buffer,
            fileName: req.file.originalname,
            folder: "/uploads/banner",
        });

        await prisma.promoBannerMgt.create({
            data: {
                image: result.url, title, page, placement, uploadedBy: uploadedBy.profile?.name, startDate, endDate, status
            }
        })
        res.status(200).json({ message: 'Banner created successfully' })
    } catch (err: any) {
        console.error('failed to create banner', err)
        return res.status(500).json({ message: 'Something went wrong, failed to create banner' })
    }
}

//Update promotional Banner
export const updateBanner = async (req: AuthRequest, res: Response) => {
    const { title, page, placement, startDate, endDate, status } = req.body;
    const userId = (req.user as JwtPayload)?.id;
    const bannerId = req.params.bannerId;
    try {

        const uploadedBy = await prisma.user.findUnique({
            where: { id: userId },
            select: {
                profile: {
                    select: {
                        name: true
                    }
                }
            }
        })
        if (!uploadedBy) {
            console.log('No uploader found');
            return res.status(404).json({ message: 'No uploader found' })
        }
        // Upload file buffer to ImageKit
         if (!req.file) {
      return res.status(400).json({ message: "No file provided" });
    }
    
        const result = await imagekit.upload({
            file: req.file.buffer,
            fileName: req.file.originalname,
            folder: "/uploads/banner",
        });

        await prisma.promoBannerMgt.update({
            where: { id: bannerId },
            data: {
                image: result.url, title, page, placement, uploadedBy: uploadedBy.profile?.name, startDate, endDate, status
            }
        })
        res.status(200).json({ message: 'Banner created successfully' })
    } catch (err: any) {
        console.error('failed to create banner', err)
        return res.status(500).json({ message: 'Something went wrong, failed to create banner' })
    }
}

//Delete banner
export const deleteBanner = async (req: AuthRequest, res: Response) => {
    const bannerId = req.params.bannerId as string;
    try {
        await prisma.promoBannerMgt.delete({ where: { id: bannerId }})
        res.status(200).json({message: 'Banner deleted successfully'})
    } catch (err: any) {
        console.error('Failed to delete banner', err)
        return res.status(500).json({ message: 'Something went wrong, failed to delete banner'})
    }
}

//Select all packages and pricing
// export const boostPackages = async (req: AuthRequest, res: Response) => {
//     try {
//         const packages = await prisma.
//     }
// }