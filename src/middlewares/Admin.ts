import { Request, Response, NextFunction } from "express";
import { JwtPayload } from "jsonwebtoken";
import { AuthRequest } from "./auth.middleware";
import prisma from '../prisma.client';

export const isAdmin = async (req: AuthRequest, res: Response, next: NextFunction) => {
    try {
        const userId = (req.user as JwtPayload)?.id;
        const admin = await prisma.user.findUnique({
            where: { id: userId },
            select: {
                id: true,
                profile: {
                    select: {
                        role: true
                    }
                }
            }
        });

        if (!admin) {
            console.log('No admin found')
            return res.status(404).json({ message: 'Failed, no user found' })
        }
        if (admin.profile?.role !== 'Admin') {
            console.log('Unathorized, only accessible for admin')
            return res.status(400).json({ message: 'Unathorized, only accessible for admin' })
        }

        next();
    } catch (error) {
        return res.status(401).json({ message: "Unauthorized" });
    }
};