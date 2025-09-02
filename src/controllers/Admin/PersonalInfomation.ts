import { Response, Request } from "express";
import { JwtPayload } from "jsonwebtoken";
import prisma from "../../prisma.client.js";
import { AuthRequest } from "../../middlewares/auth.middleware.js";
import bcrypt from 'bcryptjs';
import { imagekit } from '../../service/Imagekit.js';

//Updare personal infomation
export const UpdateInfo = async (req: AuthRequest, res: Response) => {
    const userId = (req.user as JwtPayload)?.id;
    const { name, email, phoneNumber, role } = req.body;
    try {
        if (!req.file) {
                    return res.status(400).json({ message: "No file uploaded" });
                }
        
                // Upload file buffer to ImageKit
                const result = await imagekit.upload({
                    file: req.file.buffer,
                    fileName: req.file.originalname,
                    folder: "/uploads/admin",
                });
        
        await prisma.user.update({ where: {id: userId}, data: {
            email: email, phone: phoneNumber,
            profile: {
                update: {
                    name: name,
                    profile_pic: result.url,
                    role: role
                }
            }
        },
    })
    res.status(200).json({message: 'Profile updated successfully'});
    } catch (err: any) {
        console.error({message: 'Failed to update admin profile', err})
        return res.status(500).json({ message: 'Something went wrong, Failed to update admin profile'})
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

        const user = await prisma.user.findUnique({ where: {id: userId}, select: { password: true}});
        if (!user) {
            return res.status(404).json({message: 'No user found'});
        }
        const isMatch = await bcrypt.compare(currentPassword, user.password!);
        if (!isMatch) {
            console.log('Password Mismatch');
            return res.status(400).json({message: 'Incorrect password'});
        }

        await prisma.user.update({ where:  {id: userId}, data: {password: confirmedPassword}});
        res.status(200).json({message: 'Password changed successfully'});
    } catch (err: any) {
        console.error('Failed to change password', err)
        return res.status(500).json({ message: 'Something went wrong, Failed to change password'})
    }
}