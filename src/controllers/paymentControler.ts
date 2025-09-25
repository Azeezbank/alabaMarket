import axios from "axios";
import { Request, Response } from "express";
import { JwtPayload } from "jsonwebtoken";
import { enforceVisibilityLimitForSeller } from '../helper/enforce.listing.visibility.js';
import { AuthRequest } from "../middlewares/auth.middleware.js";
import crypto from "crypto";
import dotenv from 'dotenv';
import prisma from "../prisma.client.js";

dotenv.config();


// INITIATE PAYMENT
export const initiatePayment = async (req: AuthRequest, res: Response) => {
  const planId = req.params.planId;
  const userId = (req.user as JwtPayload)?.id;

  try {
    // Get active provider from DB
    const provider = await prisma.paymentProvider.findFirst({
      where: { isActive: true },
      select: {
        name: true, secretKey: true, flutterWebhookSecret: true
      }
    });

    if (!provider) return res.status(400).json({ error: "No active payment provider" });

    if (!userId || !planId) return res.status(400).json({ error: "sellerId and planId required" });

    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: {
        email: true,
        profile: {
          select: { name: true }
        }
      }
    });

    if (!user) {
      console.log('No user found');
      return res.status(404).json({ message: 'No user found to carryout the transaction' })
    }

    const plan = await prisma.subscriptionPlan.findUnique({ where: { id: planId } });
    if (!plan) return res.status(404).json({ error: "plan not found" });
    const planPrice = Number(plan.price);
    const planName = plan.name;

    const customReference = `REF_${Date.now()}_${crypto.randomBytes(4).toString("hex")}`;

    let response;

    if (provider.name === "paystack") {
      response = await axios.post(
        "https://api.paystack.co/transaction/initialize",
        { amount: planPrice * 100, currency: "NGN", 
          email: user.email, 
          reference: customReference, 
          callback_url: "https://frontenddev.alabamarket.com/payment-confirmation" },
        { headers: { Authorization: `Bearer ${provider.secretKey}` } }
      );

      // Save pending transaction in DB
      await prisma.transaction.create({
        data: {
          name: user.profile?.name,
          reference: customReference,
          amount: planPrice,
          status: "Pending",
          userId: userId,
          subscriptionPlanName: planName,
          subscriptionPlanId: plan.id
        }
      });

      return res.json(response.data);

    } else if (provider.name === "flutterwave") {
      response = await axios.post(
        "https://api.flutterwave.com/v3/payments",
        {
          tx_ref: customReference,
          amount: planPrice,
          currency: "NGN",
          redirect_url: "https://frontenddev.alabamarket.com/payment-confirmation",
          customer: { email: user.email },
        },
        { headers: { Authorization: `Bearer ${provider.secretKey}` } }
      );

      // Save pending transaction in DB
      await prisma.transaction.create({
        data: {
          name: user.profile?.name,
          reference: customReference,
          amount: planPrice,
          status: "Pending",
          userId: userId,
          subscriptionPlanName: planName,
          subscriptionPlanId: plan.id
        }
      });

      return res.json(response.data);

    } else {
      return res.status(400).json({ error: "Invalid provider" });
    }
  } catch (err: any) {
    return res.status(500).json({ error: err.message });
  }
};


// INITIATE PAYMENT
export const initiateBannerPayment = async (req: AuthRequest, res: Response) => {
  const planId = req.params.planId;
  const userId = (req.user as JwtPayload)?.id;

  try {
    // Get active provider from DB
    const provider = await prisma.paymentProvider.findFirst({
      where: { isActive: true },
      select: {
        name: true, secretKey: true, flutterWebhookSecret: true
      }
    });

    if (!provider) return res.status(400).json({ error: "No active payment provider" });

    if (!userId || !planId) return res.status(400).json({ error: "sellerId and planId required" });

    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: {
        email: true,
        profile: {
          select: { name: true }
        }
      }
    });

    if (!user) {
      console.log('No user found');
      return res.status(404).json({ message: 'No user found to carryout the transaction' })
    }

    const plan = await prisma.bannerPlans.findUnique({ where: { id: planId } });
    if (!plan) return res.status(404).json({ error: "plan not found" });
    const planPrice = Number(plan.price);
    const planName = plan.name;

    const customReference = `BNREF_${Date.now()}_${crypto.randomBytes(4).toString("hex")}`;

    let response;

    if (provider.name === "paystack") {
      response = await axios.post(
        "https://api.paystack.co/transaction/initialize",
        { amount: planPrice * 100, currency: "NGN", 
          email: user.email, 
          reference: customReference, 
          callback_url: "https://frontenddev.alabamarket.com/payment-confirmation" },
        { headers: { Authorization: `Bearer ${provider.secretKey}` } }
      );

      // Save pending transaction in DB
      await prisma.transaction.create({
        data: {
          name: user.profile?.name,
          reference: customReference,
          amount: planPrice,
          status: "Pending",
          userId: userId,
          bannerName: planName,
          subscriptionPlanId: plan.id
        }
      });

      return res.json(response.data);

    } else if (provider.name === "flutterwave") {
      response = await axios.post(
        "https://api.flutterwave.com/v3/payments",
        {
          tx_ref: customReference,
          amount: planPrice,
          currency: "NGN",
          redirect_url: "https://frontenddev.alabamarket.com/payment-confirmation",
          customer: { email: user.email },
        },
        { headers: { Authorization: `Bearer ${provider.secretKey}` } }
      );

      // Save pending transaction in DB
      await prisma.transaction.create({
        data: {
          name: user.profile?.name,
          reference: customReference,
          amount: planPrice,
          status: "Pending",
          userId: userId,
          bannerName: planName,
          subscriptionPlanId: plan.id
        }
      });

      return res.json(response.data);

    } else {
      return res.status(400).json({ error: "Invalid provider" });
    }
  } catch (err: any) {
    return res.status(500).json({ error: err.message });
  }
};

// WEBHOOK HANDLER
export const paymentWebhook = async (req: AuthRequest, res: Response) => {
  // Get active provider from DB
  const provider = await prisma.paymentProvider.findFirst({
    where: { isActive: true },
    select: {
      name: true, secretKey: true, flutterWebhookSecret: true
    }
  });
  if (!provider) return res.status(400).json({ error: "No active payment provider" });

  try {

    if (provider.name === "paystack") {
      console.log('paystack body', req.body);
      // Verify Paystack signature

      const hash = crypto
        .createHmac("sha512", provider.secretKey)
        .update(JSON.stringify(req.body))
        .digest("hex");

      if (hash !== req.headers["x-paystack-signature"]) {
        console.log('Invalid Paystack signature');
        return res.status(401).send("Invalid Paystack signature");
      }

      const txnP = await prisma.transaction.findUnique({ where: { reference: req.body.data.reference } });
      if (!txnP) {
        console.log('Transaction not found');
        return res.status(404).json({ message: "Transaction not found" });
      }

      const event = req.body.event;
      if (event === "charge.success") {
        const payment = req.body.data;
        console.log("Paystack payment success:", payment);
        // Update DB with payment details
        await prisma.transaction.update({
          where: { reference: payment.reference },
          data: { status: "Success" }
        });
      } else {
        console.log('Unhandled Paystack event:', event);
        return res.status(400).json({ message: "Unhandled Paystack event" });
      }

      const isBanner = await prisma.subscriptionPlan.findUnique({ where: { id: txnP.subscriptionPlanId}});
      if (!isBanner) {
        return res.status(200).json({ received: true })
      }

      const plan = await prisma.subscriptionPlan.findUnique({
        where: { id: txnP.subscriptionPlanId },
        include: { maxVisiblePerCat: true }
      });
      if (!plan) {
        console.log('No  plan found')
        return res.status(404).json({ message: 'subscription plan not found' })
      }
      let period = 30; // default
      if (plan.duration === 'Weekly') period = 7;
      else if (plan.duration === 'Monthly') period = 30;
      else if (plan.duration === 'Quarterly') period = 90;
      else if (plan.duration === 'Annually') period = 365;

      const expiresAt = new Date(Date.now() + period * 24 * 60 * 60 * 1000);

      await prisma.user.update({
        where: { id: txnP.userId },
        data: {
          subscriptionPlanId: plan.id,
          subscriptionExpiresAt: expiresAt
        }
      });
      await enforceVisibilityLimitForSeller(txnP.userId, plan.maxVisibleProducts, plan.maxVisiblePerCat?.maxVisible ?? 0);

      return res.status(200).json({ received: true });
    }

    if (provider.name === "flutterwave") {
      console.log('Flutter body', req.body);
      // Verify Flutterwave signature

      const hash = crypto
        .createHmac("sha256", provider.flutterWebhookSecret)
        .update(JSON.stringify(req.body))
        .digest("hex");

      if (hash !== req.headers["verif-hash"]) {
        console.log('Invalid Flutterwave signature');
        return res.status(401).send("Invalid Flutterwave signature");
      }

      const txnF = await prisma.transaction.findUnique({ where: { reference: req.body.data.tx_ref } });
      if (!txnF) return res.status(404).json({ error: "Transaction not found" });

      if ((req.body.event === "charge.completed" || req.body.event === "transaction.completed") && req.body.data.status === "successful") {
        const payment = req.body.data;
        console.log("Flutterwave payment success:", payment);
        // Update DB with payment details
        await prisma.transaction.update({
          where: { reference: payment.tx_ref },
          data: { status: "Success" }
        });
      } else {
        console.log('Unhandled Flutterwave event:', req.body.event);
        return res.status(400).json({ message: "Unhandled Flutterwave event" });
      }

      const isBanner = await prisma.subscriptionPlan.findUnique({ where: { id: txnF.subscriptionPlanId}});
      if (!isBanner) {
        return res.status(200).json({ received: true })
      }

      const plan = await prisma.subscriptionPlan.findUnique({ where: { id: txnF.subscriptionPlanId }, include: { maxVisiblePerCat: true } });
      if (!plan) {
        console.log('No  plan found')
        return res.status(404).json({ message: 'subscription plan not found' })
      }

      let period = 30; // default
      if (plan.duration === 'Weekly') period = 7;
      else if (plan.duration === 'Monthly') period = 30;
      else if (plan.duration === 'Quarterly') period = 90;
      else if (plan.duration === 'Annually') period = 365;

      const expiresAt = new Date(Date.now() + period * 24 * 60 * 60 * 1000);

      await prisma.user.update({
        where: { id: txnF.userId },
        data: {
          subscriptionPlanId: plan.id,
          subscriptionExpiresAt: expiresAt
        }
      });

      await enforceVisibilityLimitForSeller(txnF.userId, plan.maxVisibleProducts, plan.maxVisiblePerCat?.maxVisible ?? 0);

      return res.status(200).json({ received: true });

    }
  } catch (err: any) {
    console.error('Failed to complete webhook transaction', err)
    return res.status(500).json({ message: "Something went wrong, failed to complete webhook transaction" });
  }
};

//Create or update payment provider
export const createPaymentProvider = async (req: AuthRequest, res: Response) => {
  const { name, publicKey, secretKey, isActive } = req.body;  //isActive must be boolean true/false
  try {
    // Create new provider
    await prisma.paymentProvider.create({
      data: { name, publicKey, secretKey, isActive }
    });
    res.status(200).json({ message: "Payment provider created successfully" });
  } catch (err: any) {
    console.error('Error creating payment provider', err);
    res.status(500).json({ error: "Failed to create payment provider" });
  }
}


//Update payment provider
export const updatePaymentProvider = async (req: AuthRequest, res: Response) => {
  const { name, publicKey, secretKey, isActive } = req.body;  //isActive must be boolean true/false
  try {
    const existingProvider = await prisma.paymentProvider.findFirst({ where: { name } });
    if (!existingProvider) return res.status(404).json({ message: "Payment provider not found" });
    // Update existing provider
    await prisma.paymentProvider.update({
      where: { id: existingProvider.id },
      data: { publicKey, secretKey, isActive }
    });
    res.status(200).json({ message: "Payment provider updated successfully" });
  } catch (err: any) {
    console.error('Error updating payment provider', err);
    res.status(500).json({ error: "Failed to update payment provider" });
  }
}

//Get all payment providers
export const getAllPaymentProvider = async (req: AuthRequest, res: Response) => {
  const userId = (req.user as JwtPayload)?.id;
  try {

    const isAdmin = await prisma.user.findUnique({where: {id: userId},
      select: { 
        id: true,
        profile: {
          select: {
            role: true
          }
        }
      }
    });
    if (!isAdmin || isAdmin.profile?.role !== 'Admin') {
      return res.status(403).json({ message: 'Access denied. Admins only.' });
    }

    const providers = await prisma.paymentProvider.findMany({
      select: {
        id: true, name: true, publicKey: true, secretKey: true, isActive: true, createdAt: true, updatedAt: true
      }
    })

    res.status(200).json(providers)
  } catch (err: any) {
    console.error('Failed to select provider', err)
    return res.status(500).json({message: 'Something went wrong, failed to select provider'})
  }
};

//Check transaction status
export const checkTransactionStatus = async (req: AuthRequest, res: Response) => {
  const userId = (req.user as JwtPayload)?.id;
  try {
    const transactions = await prisma.transaction.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' }
    });
    res.status(200).json(transactions);
  } catch (err: any) {
    console.error('Error fetching transactions', err);
    res.status(500).json({ error: "Failed to fetch transactions" });
  }
}