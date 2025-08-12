import { Request, Response } from "express";
import { JwtPayload } from "jsonwebtoken";
import { AuthRequest } from '../../middlewares/auth.middleware';
import prisma from "@/prisma";


//Fetch all buyers
export const GetBuyers = async (req: AuthRequest, res: Response) => {
    try {
        const role = 'Buyer';
        const buyers = await prisma.profile.findMany({
            where: { role: role },
            include: {
            user: {
                select: {
                    id: true, email: true, phone: true, createdAt: true
                }
            }
        }
        })

        res.status(200).json(buyers);
    } catch (err: any) {
        console.log('Failed to select buyers', err);
        return res.status(500).json({ message: 'Something went wrong, Failed to select buyers' });
    }
};

//Fetch all sellers
export const Getsellers = async (req: AuthRequest, res: Response) => {
    try {
        const role = 'Seller';
        const sellers = await prisma.profile.findFirst({
            where: { role: role },
            include: {
            user: {
                select: {
                    id: true,
                    email: true,
                    phone: true,
                    createdAt: true,
                },
            },
        }
        });
        res.status(200).json(sellers);
    } catch (err: any) {
        console.log('Failed to select buyers', err);
        return res.status(500).json({ message: 'Something went wrong, Failed to select buyers' });
    }
};


//Delete Buyer
export const DeleteUser = async (req: AuthRequest, res: Response) => {
    const adminId = (req.user as JwtPayload)?.id;
    const customerId = req.params.customerId;

    try {
        const admin = await prisma.user.findFirst({
            where: { id: adminId },
            include: {
                profile: {
                    select: { role: true }
                }
            }
        });

        if (!admin || admin.profile?.role !== 'Admin') {
            console.log('Not authorized, only availabele for admin');
            return res.status(404).json({ message: "Unauthorized, Only available for admin" });
        }

        await prisma.user.delete({ where: { id: customerId } });

        res.status(200).json({ message: 'Customer Deleted successfully' });
    } catch (err: any) {
        console.error('Failed to delete customer', err);
        return res.status(500).json({ message: 'Something went wrong, failed to delete user' });
    }
};


//Update user infomation
export const UpdateUser = async (req: AuthRequest, res: Response) => {
    const { email, name, phoneNumber, role } = req.body;
    const customerId = req.params.customerId;
    try {
        await prisma.user.update({
            where: { id: customerId },
            data: {
                email: email, phone: phoneNumber,
                profile: {
                    update: {
                        name: name, role: role
                    }
                }
            }
        })

        res.status(200).json({ message: 'User Infomation updated successfully' });
    } catch (err: any) {
        console.error('Soemthing went wrong, failed to update user infomation');
    }
};