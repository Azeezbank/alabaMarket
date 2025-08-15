import { Response, Request } from "express";
import { JwtPayload } from "jsonwebtoken";
import prisma from "../../prisma.client.js";
import { AuthRequest } from "../../middlewares/auth.middleware.js";
import bcrypt from 'bcryptjs';

export const UpdateInfo = async (req: AuthRequest, res: Response) => {
    const userId = (req.user as JwtPayload)?.id;
    const { name, email, phoneNumber, role } = req.body;
    try {
        await prisma.user.update({ where: {id: userId}, data: {
            email: email, phone: phoneNumber,
            profile: {
                update: {
                    name: name,
                    role: role
                }
            }
        },
    })
    res.status(200).json({message: 'Profile updated successfully'});
    } catch (err: any) {
        console.error({message: 'Failed to update admin profile'})
    }
}

//Change password
export const ChangePassword = async (req: AuthRequest, res: Response) => {
    const userId = (req.user as JwtPayload)?.id;
    const { currentPassword, newPassword, confirmedPassword } = req.body;
    try {
        if (newPassword !== confirmedPassword) {
            console.log('Password mismatched, caanot update password');
            return res.status(400).json({message: 'new password must tally with confirmed password'});
        }

        const user = await prisma.user.findFirst({ where: {id: userId}, select: { password: true}});
        if (!user) {
            return res.status(404).json({message: 'No user found'});
        }
        const isMatch = await bcrypt.compare(currentPassword, user.password!);
        if (!isMatch) {
            console.log('Password Mismatch');
            return res.status(400).json({message: 'Incorrect password'});
        }

        await prisma.user.update({ where:  {id: userId}, data: {password: confirmedPassword}})
    } catch (err: any) {
        console.error('Failed to change password')
    }
}