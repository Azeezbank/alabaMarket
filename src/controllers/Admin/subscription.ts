import { Response, Request } from "express";
import prisma from "../../prisma.client.js";
import { AuthRequest } from "../../middlewares/auth.middleware.js";

//CREATE SUBSCRIPTION PLANS
export const createSubscriptionPlan = async (req: AuthRequest, res: Response) => {
    const { name, price, duration, maxVisibleProducts, placement, maxVisibleCat, status } = req.body;  // Duration: weekly, Monthly, quarterky, or Annually
    try {
        await prisma.subscriptionPlan.create({
            data: {
                name, price, duration, maxVisibleProducts, placement, status,
                maxVisiblePerCat: {
                    create: {
                        maxVisible: maxVisibleCat
                    }
                }
            }
        })
        res.status(200).json({ message: 'Plan created successfully' })
    } catch (err: any) {
        console.error('failed to create subscription plan', err)
        return res.status(500).json({ message: 'Something went wrong, failed to create subscription plan' })
    }
};

//fetch all subscription plans
export const getSubscriptionPlans = async (req: AuthRequest, res: Response) => {
    // Parse pagination query params with defaults
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 10;
    const skip = (page - 1) * limit;
    try {

        const total = await prisma.subscriptionPlan.count();

        const plans = await prisma.subscriptionPlan.findMany({
            include: {
                maxVisiblePerCat: true
            },
            orderBy: { createdAt: 'desc' },
            skip,
            take: limit
        })
        res.status(200).json({ plans, limit, page, total, totalPages: Math.ceil(total / limit) })
    } catch (err: any) {
        console.error('Failed to fetch subscription plan', err)
        return res.status(500).json({ message: 'something went wrong, failed to select subscription plan' })
    }
}


//Edit subscription plan
export const editsubscriptionplan = async (req: AuthRequest, res: Response) => {
    const { name, price, duration, maxVisibleProducts, placement, maxVisible, status } = req.body;
    const planId = req.params.planId;
    try {
        await prisma.subscriptionPlan.update({
            where: { id: planId },
            data: {
                name, price, duration, maxVisibleProducts, placement, status,
                maxVisiblePerCat: {
                    update: {
                        where: { id: planId },
                        data: {
                            maxVisible
                        }
                    }
                }
            }
        })
        res.status(200).json({ message: 'plan updated successfully' })
    } catch (err: any) {
        console.error('Failed to update subscription plan', err)
        return res.status(500).json({ message: 'Something went wrong, failed to edit subscription plan' })
    }
}


//Delete subscription plan
export const deletesubscriptionPlan = async (req: AuthRequest, res: Response) => {
    const planId = req.params.planId;
    try {
        await prisma.subscriptionPlan.delete({ where: { id: planId } });
        res.status(200).json({ message: 'Plan deleted successfully' })
    } catch (err: any) {
        console.error('failed to delete plan', err)
        return res.status(500).json({ message: 'Something went wrong, failed to delete plan' })
    }
};

//Check all payment status
export const checkPaymentstatus = async (req: AuthRequest, res: Response) => {
    try {
        const paymentStatus = await prisma.transaction.findMany();

        res.status(200).json(paymentStatus);
    } catch (err: any) {
        console.error('Failed to fetch payment status', err);
        return res.status(500).json({ message: 'Something went wrong, failed to fetch payment status' });
    }
};

//Edit payment status
export const editPaymentStatus = async (req: AuthRequest, res: Response) => {
    const status = req.body.status;
    const paymentId = (req.params.paymentId as string);
    try {
        await prisma.transaction.update({
            where: { id: paymentId },
            data: {
                status
            }
        })
        res.status(200).json({ message: 'Payment status updayed successfully' })
    } catch (err: any) {
        console.error('Failed to edit payment status', err);
        return res.status(500).json({ message: 'Something went wrong, failed to edit payment status' })
    }
};