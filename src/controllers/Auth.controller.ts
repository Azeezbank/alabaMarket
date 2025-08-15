// import { betterAuth, date } from "better-auth";
// import { emailOTP } from "better-auth/plugins";
// import prisma from "../prisma.client.js";
// import { Resend } from "resend";
// import { Request, Response } from "express";
// import jwt from "jsonwebtoken";
// import { AuthRequest } from "../middlewares/auth.middleware.js";
// import dotenv from 'dotenv';
// dotenv.config();

// const resend = new Resend(process.env.RESEND_API_KEY);
// const webtoken = process.env.JWT_SECRET!;

// // Configure Better Auth
// export const auth = betterAuth({
//   secret: "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",
//   // database: {
//   //   dialect: "postgres",
//   //   type: "postgres",
//   //   url: process.env.DATABASE_URL, // same as Prisma
//   // },
//   baseURL: "http://localhost:3000/",
//   plugins: [
//     emailOTP({
//         overrideDefaultEmailVerification: true,
//       sendVerificationOTP: async ({ email, otp, type }) => {
        
//                 // if (type === "sign-in") {
//                 //     // Send the OTP for sign-in
//                 // } else if (type === "email-verification") {
//                 //     // Send the OTP for email verification
//                 // } else {
//                 //     // Send the OTP for password reset
//                 // }

//         // Send OTP using Resend
//         await resend.emails.send({
//           from: "no-reply@example.com",
//           to: email,
//           subject: `Your ${type} OTP`,
//           text: `Your OTP is ${otp}`,
//         });
//       },
//       sendVerificationOnSignUp: true,
//       allowedAttempts: 5,
//       expiresIn: 300,
//     }),
//   ],
// });

// // Sign up with email
// export const signUp = async (req: AuthRequest, res: Response) => {
//   const { email } = req.body;
//   try {
//     let user = await prisma.user.findUnique({ where: { email } });

//     if (!user) {
//       user = await prisma.user.create({
//         data:  email,
//       });
//     }

//     // Send OTP via Better Auth
//     await auth.api.sendVerificationOTP({
//       body: { email, type: "sign-in" },
//     });


//     res.json({ message: "OTP sent to your email" });
//   } catch (err: any) {
//     console.error('Failed to sent otp', err)
//     return res.status(500).json({message: 'Failed to sent otp'});
//   }
// };

// //Verify email
// export const verifyMail = async (req: AuthRequest, res: Response) => {
//   const { otp, email } = req.body;
//   try {
//     const data = await auth.api.verifyEmailOTP({
//     body: {
//         email, // required
//         otp, // required
//     }
// })
// if (!data) {
//   console.log('Failed to verify user mail');
// }

// // Set verify to true in database
//     await prisma.user.update({
//       where: { email },
//       data: { sign_up_verify: true },
//     });

// console.log(data); 
//     }  catch (err: any) {
//       console.error('Failed to verify user mail', err)
//       return res.status(500).json({message: 'Failed to verify user mail'})
//     }
// };


// // Verify OTP and sign in
// export const verifyOTPLogin = async (req: AuthRequest, res: Response) => {
//   const { email, otp } = req.body;
//   try {
//     await auth.api.signInEmailOTP({
//       body: { email, otp },
//     });

//     const user = await prisma.user.findFirst({ where: { email: email}});
//     if (!user) {
//         console.log('User Not Found');
//         return res.status(404).json({message: 'User Not Found'});
//     }

//     // Set verify to true in database
//     await prisma.user.update({
//       where: { email },
//       data: { sign_up_verify: true },
//     });

//     // Generate JWT
//     const token = jwt.sign(
//       { userId: user.id, email: user.email },
//       webtoken,
//       { expiresIn: "1h" }
//     );

//     res.json({ message: "Email verified successfully", token });
//   } catch (err: any) {
//     console.error('Failed to verify mail', err)
//     res.status(400).json({ error: err });
//   }
// };

// // Login with email + OTP
// // export const loginWithOTP = async (req: AuthRequest, res: Response) => {
// //   const { email } = req.body;
// //   try {
// //     const user = await prisma.user.findUnique({ where: { email } });

// //     if (!user) return res.status(404).json({ error: "User not found" });

// //     // Send OTP via Better Auth
// //     await auth.api.sendVerificationOTP({
// //       body: { email, type: "sign-in" },
// //     });

// //     // Generate JWT
// //     // const token = jwt.sign(
// //     //   { userId: user.id, email: user.email },
// //     //   webtoken,
// //     //   { expiresIn: "1h" }
// //     // );

// //     res.json({ message: "OTP sent to your email"});
// //   } catch (err: any) {
// //     console.error('Failed to to send login otp', err)
// //     res.status(500).json({ message: 'Failed to to send login otp'});
// //   }
// // };

// // Forget password
// export const forgotPassword = async (req: AuthRequest, res: Response) => {
//   const { email } = req.body;
//   try {
//     await auth.api.forgetPasswordEmailOTP({
//       body: { email },
//     });

//     res.json({ message: "Password reset OTP sent to your email" });
//   } catch (err: any) {
//     console.error('Failed to to send forget password otp', err)
//     res.status(400).json({ message: 'Failed to to send forget password otp'});
//   }
// };

// //Reset password
// export const resetPassword = async (req: AuthRequest, res: Response) => {
//     const { email, otp, password } = req.body;
//     try {
//         await auth.api.resetPasswordEmailOTP({
//             body: {email, otp, password}
//         })
//         res.status(200).json({message: 'Password reset successfully'});
//     } catch (err: any) {
//         console.error('Failed to set password', err)
//         return res.status(500).json({message: 'Failed to reset password'});
//     }
// }

// // Set password (optional)
// import bcrypt from "bcryptjs";
// export const setPassword = async (req: AuthRequest, res: Response) => {
//   const { email, password } = req.body;
//   try {
//     const hashedPassword = await bcrypt.hash(password, 10);
//     await prisma.user.update({
//       where: { email },
//       data: { password: hashedPassword },
//     });
//     res.json({ message: "Password set successfully" });
//   } catch (err: any) {
//     console.error('Failed to set password', err);
//     res.status(500).json({ message: 'Failed to set password' });
//   }
// };