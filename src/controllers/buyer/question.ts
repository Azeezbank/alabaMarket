import { Response, Request } from "express";
import { JwtPayload } from "jsonwebtoken";
import prisma from "../../prisma.client.js";
import { AuthRequest } from "../../middlewares/auth.middleware.js";

//Leave question for admin or seller
export const handleQuestion = async (req: AuthRequest, res: Response) => {
    const userId = (req.user as JwtPayload)?.id;
    const question = req.body.question;
    const receiverId = req.query.receiverId as string;
    try {
        await prisma.question.create({
            data: {
                userId, receiverId, question
            }
        })

        res.status(200).json({ message: 'Question submitted sucessfully' })
    } catch (err: any) {
        console.error('Something went wrong, Failed to submit question', err)
        return res.status(500).json({ message: 'Something went wrong, Failed to submit question' })
    }
}