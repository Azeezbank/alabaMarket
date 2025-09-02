// import axios from 'axios';
// import { Response, Request } from "express";
// import { JwtPayload } from "jsonwebtoken";
// import prisma from "../../prisma.client.js";
// import { enforceVisibilityLimitForSeller } from '../../helper/enforce.listing.visibility.js';
// import dotenv from 'dotenv';
// import crypto from "crypto";

// dotenv.config();

// //Subscribe to a plan
// export const subscription = async (req: AuthRequest, res: Response) => {
//      const planId = req.params.planId;
//      const userId = (req.user as JwtPayload)?.id;

//      try {
//     if (!userId || !planId) return res.status(400).json({ error: "sellerId and planId required" });

//     const user = await prisma.user.findUnique({ where: { id: userId },
//     select: {
//       email: true
//     }
//     });

//     if (!user) {
//       console.log('No user found');
//       return res.status(404).json({ message: 'No user found to carryout the transaction'})
//     }

//     const plan = await prisma.subscriptionPlan.findUnique({ where: { id: planId } });
//     if (!plan) return res.status(404).json({ error: "plan not found" });

//     const customReference = `REF_${Date.now()}_${crypto.randomBytes(4).toString("hex")}`;

// const response = await axios.post(
//       "https://api.paystack.co/transaction/initialize",
//       {
//         email: user.email,
//         amount: plan.price * 100, // in kobo
//         reference: customReference
//       },
//       {
//         headers: {
//           Authorization: `Bearer ${process.env.PAYSTACK_SECRET_KEY}`,
//           "Content-Type": "application/json",
//         },
//       }
//     );


//   // Flutterwave
// //   const response = await axios.post("https://api.flutterwave.com/v3/payments", {
// //   tx_ref: paymentSession.reference,
// //   amount: plan.price,
// //   currency: "NGN",
// //   redirect_url: paymentSession.callbackUrl,
// //   customer: { email: user.email, name: user.name }
// // }, {
// //   headers: { Authorization: `Bearer ${process.env.FLUTTERWAVE_SECRET}` }
// // });

//   // Save pending transaction in DB
//   await prisma.transaction.create({
//     data: {
//       reference: customReference,
//       amount: plan.price,
//       status: "Pending",
//       userId: userId,
//       subscriptionPlanId: plan.id
//     }
//   });

//    res.status(200).json({ authorizationUrl: response.data.data.authorization_url });
// } catch (err: any) {
//   console.error('Failed to create transaction', err);
//   return res.status(500).json({ message: 'Something went wrong, failed to initiate transaction'})
// };
// };


// export const webhookPayment = async (req: AuthRequest, res: Response) => {
//   const event = req.body;
//    const paymentData = event.data;
//   console.log('Body', req.body);
//   const secret = process.env.PAYSTACK_SECRET_KEY!;

//   try {
//   const txn = await prisma.transaction.findUnique({ where: { reference: paymentData.reference } });
//   if (!txn) return res.status(404).json({ error: "Transaction not found" });

//   const hash = crypto
//     .createHmac("sha512", secret)
//     .update(JSON.stringify(req.body))
//     .digest("hex");

//   if (hash === req.headers["x-paystack-signature"]) {
  
//     console.log('webhook body', event);

//     if (event.event === "charge.success") {

//       // ✅ Mark as paid in your DB
//       console.log("Payment confirmed:", paymentData.reference);

//       // Example: Update order status
//         await prisma.transaction.update({
//       where: { reference: paymentData.reference },
//       data: { status: "Success" }
//     });
//     }

//     const plan = await prisma.subscriptionPlan.findUnique({ where: { id: txn.subscriptionPlanId }, include: {MaxVisiblePerCat: true} });

//     let period = 30; // default
//       if (plan.duration === 'Weekly') period = 7;
//       else if (plan.duration === 'Monthly') period = 30;
//       else if (plan.duration === 'Quarterly') period = 90;
//       else if (plan.duration === 'Annually') period = 365;

//     const expiresAt = new Date(Date.now() + period * 24 * 60 * 60 * 1000);

//     await prisma.user.update({
//       where: { id: txn.userId },
//       data: {
//         subscriptionPlanId: plan.id,
//         subscriptionExpiresAt: expiresAt
//       }
//     });


//     await enforceVisibilityLimitForSeller(txn.userId, plan.maxVisibleProducts, plan.maxVisiblePerCat.maxVisible);

//      res.status(200).json({ received: true });
    
//   } else {
//     await prisma.transaction.update({
//       where: { reference: paymentData.reference },
//       data: { status: "Failed" }
//     });

//     console.log('Paystack transaction failed');
//     return res.status(400).json({ message: 'Transaction failed'})
//   }

// } catch (err: any) {
//   console.error('Failed to complete webhook transaction', err)
//   return res.status(500).json({ message: "Something went wrong, failed to complete webhook transaction"})
// }
// };