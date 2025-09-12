import { Response } from 'express';
import { AuthRequest } from '../middlewares/auth.middleware';
import { JwtPayload } from 'jsonwebtoken';

export const protectPage = async (req: AuthRequest, res: Response) => {
    const userId = (req.user as JwtPayload)?.id;
    try {
        if (!userId) {
            return res.status(401).json({message: 'Unauthorized access, proceed to login'})
        }
        res.status(200).json({message: 'Authorized'})
    } catch (err: any) {
        console.error('Failed to protect page', err)
        return res.status(500).json({ message: 'Something went wrong, failed to protect page'})
    }
}