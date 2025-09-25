import { Response, Request } from "express";
import { JwtPayload } from "jsonwebtoken";
import prisma from "../../prisma.client.js";
import { AuthRequest } from "../../middlewares/auth.middleware.js";
import { imagekit } from '../../service/Imagekit.js';

//Select all from promotional Banner Management
export const getBannerMgt = async (req: AuthRequest, res: Response) => {
    const page = parseInt(req.query.page as string) || 1;
  const limit = parseInt(req.query.limit as string) || 10;
  const skip = (page - 1) * limit;

    try {
        const total = await prisma.banner.count();

        const banner = await prisma.banner.findMany({
            select: {
                id: true, image: true, title: true, page: true, placement: true, uploadedBy: true, startDate: true, endDate: true, status: true
            },
            orderBy: { createdAt: 'desc' },
            skip,
            take: limit
        })
        res.status(200).json({page, limit, total, totalPage: Math.ceil(total / limit), banner})
    } catch (err: any) {
        console.error('Failed to select banners', err)
        return res.status(500).json({ message: 'Something went wrong, Failed to select banners' })
    }
}

//Upload new promotional banner
export const createBanner = async (req: AuthRequest, res: Response) => {
    const { title, page, placement, startDate, endDate, status } = req.body; // status is enum, Active Scheduled, Expired, Inactive. startDate, endDate should be DateTime
    const userId = (req.user as JwtPayload)?.id;
    try {

        // 1. Ensure both exist
    if (!startDate || !endDate) {
      return res.status(400).json({ message: "Start date and end date are required" });
    }

    // 2. Convert to Date objects
    const start = new Date(startDate);
    const end = new Date(endDate);

    // 3. Validate format
    if (isNaN(start.getTime()) || isNaN(end.getTime())) {
      return res.status(400).json({ message: "Invalid date format. Use ISO 8601 format." });
    }

    // 4. Ensure start < end
    if (start >= end) {
      return res.status(400).json({ message: "Start date must be before end date" });
    }

        const uploadedBy = await prisma.user.findUnique({
            where: { id: userId },
            select: {
                profile: {
                    select: {
                        name: true, role: true
                    }
                }
            }
        })
        if (!uploadedBy || uploadedBy.profile?.role !== "Admin") {
            console.log('No uploader found');
            return res.status(404).json({ message: 'Unauthorized, available for admin only ' })
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

        await prisma.banner.create({
            data: {
                image: result.url, title, page, placement, uploadedBy: `Admin (${uploadedBy.profile?.name})`, startDate: start, endDate: end, status
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
    const { title, page, placement, startDate, endDate, status } = req.body;  // status is enum, Active Scheduled, Expired, Inactive. startDate, endDate should be DateTime
    const userId = (req.user as JwtPayload)?.id;
    const bannerId = req.params.bannerId;
    try {

        // 1. Ensure both exist
    if (!startDate || !endDate) {
      return res.status(400).json({ message: "Start date and end date are required" });
    }

    // 2. Convert to Date objects
    const start = new Date(startDate);
    const end = new Date(endDate);

    // 3. Validate format
    if (isNaN(start.getTime()) || isNaN(end.getTime())) {
      return res.status(400).json({ message: "Invalid date format. Use ISO 8601 format." });
    }

    // 4. Ensure start < end
    if (start >= end) {
      return res.status(400).json({ message: "Start date must be before end date" });
    }

        const uploadedBy = await prisma.user.findUnique({
            where: { id: userId },
            select: {
                profile: {
                    select: {
                        name: true, role: true
                    }
                }
            }
        })
        if (!uploadedBy || uploadedBy.profile?.role !== "Admin") {
            console.log('No uploader found');
            return res.status(404).json({ message: 'Unauthorized, available for admin only' })
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

        await prisma.banner.update({
            where: { id: bannerId },
            data: {
                image: result.url, title, page, placement, uploadedBy: `Admin (${uploadedBy.profile?.name})`, startDate: start, endDate: end, status
            }
        })
        res.status(200).json({ message: 'Banner updated successfully' })
    } catch (err: any) {
        console.error('failed to create banner', err)
        return res.status(500).json({ message: 'Something went wrong, failed to update banner' })
    }
}

//Delete banner
export const deleteBanner = async (req: AuthRequest, res: Response) => {
    const bannerId = req.params.bannerId as string;

    try {
        await prisma.banner.delete({ where: { id: bannerId } })
        res.status(200).json({ message: 'Banner deleted successfully' })
    } catch (err: any) {
        console.error('Failed to delete banner', err)
        return res.status(500).json({ message: 'Something went wrong, failed to delete banner' })
    }
};


//Create banner packages and pricing
export const createBannerPackages = async (req: AuthRequest, res: Response) => {
    const { name, price, duration, placement, status } = req.body;  //status is enum, Active, Inactive
    try {
        await prisma.bannerPlans.create({
            data: {
                name, price, duration, placement, status
            }
        })
        res.status(201).json({ message: 'New banner package created successfully' })
    } catch (err: any) {
        console.error('Failed to create banner package', err)
        return res.status(500).json({ message: 'Something went wrong, Failed to create banner package'})
    }
};

//Edit banner package and pricing
export const editbannerPackage = async (req: AuthRequest, res: Response) => {
    const bannerId = req.params.bannerId;
    const { name, price, duration, placement, status } = req.body;
    try {
        await prisma.bannerPlans.update({ where: { id: bannerId },
        data: {
            name, price, duration, placement, status
        }
        })
        res.status(200).json({ message: 'Banner package updated successfuly'})
    } catch (err: any) {
        console.error('Failed to edit banner package', err)
        return res.status(500).json({ message: 'Something went wrong, Failed to edit banner package'})
    }
}

//get all banner packages
export const allBannerPackages = async (req: AuthRequest, res: Response) => {
    try {
        const bannerPackage = await prisma.bannerPlans.findMany();
        res.status(200).json(bannerPackage)
    } catch (err: any) {
        console.error('Failed to select banner package', err)
        return res.status(500).json({ message: 'Something went wrong, Failed to select banner package'})
    }
}

//Delete banner package
export const deleteBannerPackage = async (req: AuthRequest, res: Response) => {
    const bannerId = req.params.bannerId;
    try {
        await prisma.bannerPlans.delete({ where: { id: bannerId}})
        res.status(200).json({ message: 'Banner package deleted successfully'})
    } catch (err: any) {
        console.error('Failed to delete banner package', err)
        return res.status(500).json({ message: 'something went wrong, Failed to delete banner package'})
    }
}




// //Select all packages and pricing
// export const boostPackages = async (req: AuthRequest, res: Response) => {
//     const page = parseInt(req.query.page as string) || 1;
//     const limit = parseInt(req.query.limit as string) || 10;
//     const skip = (page - 1) * limit;
//     try {
//         const packages = await prisma.boostPackages.findMany({
//             include: {
//                 boostPackagesDetails: true
//             },
//             orderBy: { createdAt: 'desc' },
//             skip,
//             take: limit
//         });
//         res.status(200).json(packages)
//     } catch (err: any) {
//         console.error('Failed to select boost packages', err)
//         return res.status(500).json({ message: 'Something went wrong, Failed to select boost packages' })
//     }
// }

// //Add new boost packages
// export const newBoostPackages = async (req: AuthRequest, res: Response) => {
//     const { plan, type, placement, duration1, price1, duration2, price2, duration3, price3, duration4, price4, status } = req.body;
//     try {

//         const periods = [
//       { duration: duration1, price: price1 },
//       { duration: duration2, price: price2 },
//       { duration: duration3, price: price3 },
//       { duration: duration4, price: price4 }
//     ].filter(p => p.duration && p.price !== undefined); // remove empty ones

//     if (periods.length === 0) {
//       return res.status(400).json({ error: "At least one duration & price is required" });
//     }
//         await prisma.boostPackages.create({
//             data: {
//                 plan, type, placement,
//                 boostPackagesDetails: {
//                     create: periods
//                 }
//             }
//         })

//         res.status(200).json({message: 'New boost package added successfully'})
//     } catch (err: any) {
//         console.error('Failed to add new packages', err)
//         return res.status(500).json({message: 'Something went wrong, Failed to add new packages'})
//     }
// }

// //Edit boost package
// export const editBoostPackages = async (req: AuthRequest, res: Response) => {
//     const packageId = req.params.packageId as string;
//     const { plan, type, placement, duration1, price1, duration2, price2, duration3, price3, duration4, price4, status } = req.body;
//     try {

//             const periods = [
//       { duration: duration1, price: price1 },
//       { duration: duration2, price: price2 },
//       { duration: duration3, price: price3 },
//       { duration: duration4, price: price4 }
//     ].filter(p => p.duration && p.price !== undefined); // remove empty ones

//     if (periods.length === 0) {
//       return res.status(400).json({ error: "At least one duration & price is required" });
//     }

//         await prisma.boostPackages.update({ where: {id: packageId},
//             data: {
//                 plan, type, placement,
//                 boostPackagesDetails: {
//                     create: periods
//                 }
//             }
//         })

//         res.status(200).json({message: 'Boost package updated successfully'})
//     } catch (err: any) {
//         console.error('Failed to update boost packages', err)
//         return res.status(500).json({message: 'Something went wrong, Failed to update boost packages'})
//     }
// }


// //Delete boost packages
// export const deletePackages = async (req: AuthRequest, res: Response) => {
//     const packageId = req.params.packageId as string;
//     try {
//         await prisma.boostPackages.delete({ where: {id: packageId}})
//         res.status(200).json({message: 'Boost plan deleted successfully'})
//     } catch (err: any) {
//         console.error('Failed to delete boost plan', err)
//         return res.status(500).json({message: 'Something went wrong, Failed to delete boost plan'})
//     }
// }