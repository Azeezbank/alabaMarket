import { Response, Request } from "express";
import { JwtPayload } from "jsonwebtoken";
import prisma from "../../prisma.client.js";
import { AuthRequest } from "../../middlewares/auth.middleware.js";

//Select all banner packages
export const allBannerPackages = async (req: AuthRequest, res: Response) => {
    try {
        const bannerPackage = await prisma.bannerPlans.findMany({ where: {status: 'Active'}, 
            orderBy: { createdAt: 'desc' } });
        res.status(200).json(bannerPackage)
    } catch (err: any) {
        console.error('Failed to select banner package', err)
        return res.status(500).json({ message: 'Something went wrong, Failed to select banner package'})
    }
}