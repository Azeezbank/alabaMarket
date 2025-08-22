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
        res.status(201).json({ message: 'Banner created successfully' })
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
        await prisma.promoBannerMgt.delete({ where: { id: bannerId } })
        res.status(200).json({ message: 'Banner deleted successfully' })
    } catch (err: any) {
        console.error('Failed to delete banner', err)
        return res.status(500).json({ message: 'Something went wrong, failed to delete banner' })
    }
}

//Select all packages and pricing
export const boostPackages = async (req: AuthRequest, res: Response) => {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 10;
    const skip = (page - 1) * limit;
    try {
        const packages = await prisma.boostPackages.findMany({
            include: {
                boostPackagesDetails: true
            },
            orderBy: { createdAt: 'desc' },
            skip,
            take: limit
        });
        res.status(200).json(packages)
    } catch (err: any) {
        console.error('Failed to select boost packages', err)
        return res.status(500).json({ message: 'Something went wrong, Failed to select boost packages' })
    }
}

//Add new boost packages
export const newBoostPackages = async (req: AuthRequest, res: Response) => {
    const { plan, type, placement, duration1, price1, duration2, price2, duration3, price3, duration4, price4, status } = req.body;
    try {

        const periods = [
      { duration: duration1, price: price1 },
      { duration: duration2, price: price2 },
      { duration: duration3, price: price3 },
      { duration: duration4, price: price4 }
    ].filter(p => p.duration && p.price !== undefined); // remove empty ones

    if (periods.length === 0) {
      return res.status(400).json({ error: "At least one duration & price is required" });
    }
        await prisma.boostPackages.create({
            data: {
                plan, type, placement,
                boostPackagesDetails: {
                    create: periods
                }
            }
        })

        res.status(200).json({message: 'New boost package added successfully'})
    } catch (err: any) {
        console.error('Failed to add new packages', err)
        return res.status(500).json({message: 'Something went wrong, Failed to add new packages'})
    }
}

//Edit boost package
export const editBoostPackages = async (req: AuthRequest, res: Response) => {
    const packageId = req.params.packageId as string;
    const { plan, type, placement, duration1, price1, duration2, price2, duration3, price3, duration4, price4, status } = req.body;
    try {

            const periods = [
      { duration: duration1, price: price1 },
      { duration: duration2, price: price2 },
      { duration: duration3, price: price3 },
      { duration: duration4, price: price4 }
    ].filter(p => p.duration && p.price !== undefined); // remove empty ones

    if (periods.length === 0) {
      return res.status(400).json({ error: "At least one duration & price is required" });
    }

        await prisma.boostPackages.update({ where: {id: packageId},
            data: {
                plan, type, placement,
                boostPackagesDetails: {
                    create: periods
                }
            }
        })

        res.status(200).json({message: 'Boost package updated successfully'})
    } catch (err: any) {
        console.error('Failed to update boost packages', err)
        return res.status(500).json({message: 'Something went wrong, Failed to update boost packages'})
    }
}


//Delete boost packages
export const deletePackages = async (req: AuthRequest, res: Response) => {
    const packageId = req.params.packageId as string;
    try {
        await prisma.boostPackages.delete({ where: {id: packageId}})
        res.status(200).json({message: 'Boost plan deleted successfully'})
    } catch (err: any) {
        console.error('Failed to delete boost plan', err)
        return res.status(500).json({message: 'Something went wrong, Failed to delete boost plan'})
    }
}