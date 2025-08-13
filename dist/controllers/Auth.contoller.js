// //Authentication controller
import prisma from '../prisma.client.js';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import dotenv from 'dotenv';
import { sendEmail } from '../utils/mailer.js';
import twilio from 'twilio';
dotenv.config();
const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;
const messagingServiceSid = process.env.TWILIO_MESSAGING_SERVICE_SID; // or set from number
const client = twilio(accountSid, authToken);
const jwt_secret_key = process.env.JWT_SECRET;
export const register = async (req, res) => {
    const { email, phone, password } = req.body;
    if (!password || (!email && !phone)) {
        return res.status(400).json({ message: 'Email or phone and password required' });
    }
    try {
        // Check if user already exists
        const existingUser = await prisma.user.findFirst({
            where: {
                OR: [{ email }, { phone }]
            }
        });
        if (existingUser) {
            return res.status(409).json({ message: 'User already exists' });
        }
        // Generate a random OTP
        const otp = Math.floor(100000 + Math.random() * 900000).toString();
        const otpHash = await bcrypt.hash(otp, 10);
        const expiresAt = new Date(Date.now() + 5 * 60 * 1000); // 5 minutes expiry
        const hashed = await bcrypt.hash(password, 10);
        // Create user in the database
        const user = await prisma.user.create({
            data: {
                email,
                phone,
                password: hashed,
                otp: otpHash,
                expiresAt: expiresAt
            }
        });
        // Send OTP via email or SMS 
        if (email) {
            await sendEmail(email, 'Email veriification', `
      <h1>Welcome to Alabamarket</h1> <br/> 
      <p>Your OTP is: <strong>${otp}</strong></p>
      <p>Please use this OTP to verify your account.</p>
        <p>Thank you for registering!</p>
      `);
        }
        else if (phone) {
            //Sent otp to user's phone number through sms
            await client.messages.create({
                body: `Your verification code is ${otp}`,
                to: phone,
                messagingServiceSid
            });
        }
        res.status(201).json({ message: 'User registered successfully. OTP sent.', phone, email });
    }
    catch (err) {
        console.error('Failed to register user', err);
        return res.status(500).json({ message: 'Failed to register user' });
    }
};
//Verify otp controller
export const verifyOTP = async (req, res) => {
    const { otp } = req.body;
    const { email, phone } = req.query;
    try {
        if (!otp)
            return res.status(400).json({ message: 'OTP is required' });
        const user = await prisma.user.findFirst({
            where: {
                OR: [{ email: email }, { phone: phone }],
            }, orderBy: { createdAt: 'desc' },
        });
        if (!user || !user.expiresAt || !user.otp) {
            return res.status(404).json({ message: 'User not found' });
        }
        if (user.expiresAt < new Date()) {
            return res.status(410).json({ message: 'OTP expired' });
        }
        const isMatch = await bcrypt.compare(otp, user.otp);
        if (!isMatch)
            return res.status(400).json({ message: 'Invalid OTP' });
        // Set a flag to indicate the user is verified
        await prisma.user.update({
            where: { id: user.id },
            data: { otp: null, sign_up_verify: true, expiresAt: null }
        });
        res.status(200).json({ message: 'OTP verified, user authenticated' });
    }
    catch (err) {
        console.error('Failed to verify OTP', err);
        return res.status(500).json({ message: 'Failed to verify OTP' });
    }
};
//Resend OTP controller
export const resendOtp = async (req, res) => {
    const phone = req.query.phone;
    const email = req.query.email;
    const Otp = Math.floor(100000 + Math.random() * 900000).toString();
    const otpHash = await bcrypt.hash(Otp, 10);
    const expiresAt = new Date(Date.now() + 5 * 60 * 1000); // 5 mins
    try {
        // Check if there's an existing OTP
        const existing = await prisma.user.findFirst({
            where: {
                OR: [{ phone }, { email }],
            },
            orderBy: { createdAt: 'desc' }
        });
        if (!existing || !existing.expiresAt) {
            return res.status(404).json({ message: 'User not found.' });
        }
        // If OTP exists and is not expired, block resend (optional)
        if (existing && existing.expiresAt > new Date()) {
            return res.status(400).json({ message: 'Current OTP is still valid. Please wait for it to expire.' });
        }
        // update new OTP
        await prisma.user.update({
            where: { id: existing.id },
            data: {
                otp: otpHash,
                expiresAt: expiresAt
            }
        });
        // Send OTP via email or SMS 
        if (email) {
            await sendEmail(email, 'Email veriification', `
      <h1>Welcome to Alabamarket</h1> <br/> 
      <p>Your OTP is: <strong>${Otp}</strong></p>
      <p>Please use this OTP to verify your account.</p>
        <p>Thank you for registering!</p>
      `);
        }
        else if (phone) {
            //Sent otp to user's phone number through sms
            await client.messages.create({ body: `Your login code is ${Otp}`, to: phone, messagingServiceSid });
        }
        res.status(200).json({ message: 'New OTP sent successfully.', phone, email });
    }
    catch (err) {
        return res.status(500).json({ message: 'Failed to resend OTP', error: err });
    }
};
// Login: Generate and send OTP
export const loginUser = async (req, res) => {
    const { phone, email, password } = req.body;
    try {
        if (!phone && !email) {
            return res.status(400).json({ message: "Phone or email is required" });
        }
        const user = await prisma.user.findFirst({ where: {
                OR: [{ phone }, { email }]
            } });
        if (!user || user.sign_up_verify !== true) {
            return res.status(404).json({ message: "User not found, or user not verified" });
        }
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch)
            return res.status(400).json({ message: 'Invalid password' });
        // Generate JWT token
        const token = jwt.sign({
            userId: user.id,
            email: user.email,
            phone: user.phone,
        }, jwt_secret_key, { expiresIn: "1h" } // token valid for 1 hour
        );
        // Set cookie with JWT (HTTPOnly and Secure for production)
        res.cookie("token", token, {
            httpOnly: true,
            secure: true,
            maxAge: 60 * 60 * 1000, // 1 hour in milliseconds
            sameSite: "none",
            path: "/",
        });
        res.status(200).json({ message: "OTP sent to phone", phone, email });
    }
    catch (err) {
        console.error('Failed to login user', err);
        return res.status(500).json({ message: 'Failed to login user' });
    }
};
// // Verify OTP during login
// export const verifyLoginOTP = async (req: Request, res: Response) => {
//   const { otp } = req.body;
//   const { email, phone } = req.query;
//   const user = await prisma.user.findFirst({ where: { 
//     OR: [{ email: email as string }, { phone: phone as string }], }});
//   if (!user) {
//     return res.status(400).json({ message: "No user record found" });
//   }
//   const now = new Date();
//   if (user.expiresAt < now) {
//     return res.status(400).json({ message: "OTP has expired" });
//   }
//   const isMatch = await bcrypt.compare(otp, user.otp);
//   if (!isMatch) return res.status(400).json({ message: 'Invalid OTP' });
//   // Generate JWT token
//     const token = jwt.sign(
//       {
//         userId: user.id,
//         email: user.email,
//         phone: user.phone,
//       },
//       jwt_secret_key!,
//       { expiresIn: "1h" } // token valid for 1 hour
//     );
//   // Clear OTP after successful verification
//     await prisma.user.update({
//       where: { id: user.id },
//       data: { otp: null, expiresAt: null },
//     });
//   // Set cookie with JWT (HTTPOnly and Secure for production)
//   res.cookie("token", token, {
//     httpOnly: true,
//     secure: true,
//     maxAge: 60 * 60 * 1000, // 1 hour in milliseconds
//     sameSite: "none",
//     path: "/",
//   });
//   res.status(200).json({ message: "Login successful" });
// };
