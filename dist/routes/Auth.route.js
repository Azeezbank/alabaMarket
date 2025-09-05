import express from "express";
import prisma from '../prisma.client.js';
import { Resend } from "resend";
import twilio from "twilio";
import jwt from "jsonwebtoken";
import dotenv from 'dotenv';
import bcrypt from 'bcryptjs';
dotenv.config();
const router = express.Router();
// Resend setup
const resend = new Resend(process.env.RESEND_API_KEY);
// Twilio setup
// const twilioClient = twilio(
//   process.env.TWILIO_ACCOUNT_SID!,
//   process.env.TWILIO_AUTH_TOKEN!
// );
const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authtoken = process.env.TWILIO_AUTH_TOKEN;
const client = twilio(accountSid, authtoken);
const OTP_EXPIRY_MINUTES = 10;
// Generate OTP
function generateOtp() {
    return Math.floor(100000 + Math.random() * 900000).toString();
}
// -------------------- REGISTER --------------------
router.post("/register", async (req, res) => {
    const { phone, email, role } = req.body;
    if (!email && !phone) {
        return res.status(400).json({ message: "Email or phone is required" });
    }
    try {
        // Check if user exists
        const existing = await prisma.user.findFirst({
            where: {
                OR: [{ email: email || undefined }, { phone: phone || undefined }],
            },
        });
        if (existing) {
            return res.status(400).json({ message: "Email or phone already registered." });
        }
        const verificationOTP = generateOtp();
        const otpExpiresAt = new Date(Date.now() + OTP_EXPIRY_MINUTES * 60 * 1000);
        // Create new user
        const newUser = await prisma.user.create({
            data: {
                phone,
                email,
                otp: verificationOTP,
                expiresAt: otpExpiresAt,
                profile: {
                    create: {
                        role: role
                    }
                }
            },
        });
        // Send OTP
        if (email) {
            await resend.emails.send({
                from: "no-reply@alabamarket.com",
                to: email,
                subject: "Verify your email",
                html: `<p>Your AlabaMarket verification code is <b>${verificationOTP}</b>. Don't share this code with anyone; our employees will never ask for the code.</p>`,
            });
            '';
            res.status(201).json({
                message: "User registered. Verification code sent.",
                userId: newUser.id,
            });
        }
        else if (phone) {
            const verification = await client.verify.v2
                .services("VAa7788291105c30d778521c37ae2e1cd7")
                .verifications.create({
                to: phone,
                channel: "sms",
            });
            res.status(201).json({ message: "User registered. Verification code sent.", userId: newUser.id, success: true, status: verification.status });
        }
    }
    catch (err) {
        console.error("Register error:", err);
        return res.status(500).json({ message: "Failed to register" });
    }
});
// -------------------- VERIFY --------------------
router.post("/verify", async (req, res) => {
    const { code } = req.body;
    const phone = typeof req.query.phone === "string" ? req.query.phone : undefined;
    const email = typeof req.query.email === "string" ? req.query.email : undefined;
    try {
        const user = await prisma.user.findFirst({
            where: {
                OR: [
                    email ? { email } : {},
                    phone ? { phone } : {},
                ],
            },
        });
        if (!user)
            return res.status(404).json({ message: "User not found." });
        if (email) {
            if (user.otp !== code) {
                return res.status(400).json({ message: "Invalid verification code." });
            }
            if (user.expiresAt < new Date()) {
                return res.status(400).json({ message: "Verification code expired." });
            }
            await prisma.user.update({
                where: { id: user.id },
                data: { sign_up_verify: true, otp: null, expiresAt: null },
            });
            res.status(200).json({ success: true, message: "OTP verified proceed to login" });
        }
        if (phone) {
            const verificationCheck = await client.verify.v2
                .services("VAa7788291105c30d778521c37ae2e1cd7")
                .verificationChecks
                .create({
                to: phone,
                code,
            });
            if (verificationCheck.status === "approved") {
                const message = `New member ${phone} has been registerd on your platform`;
                const type = 'User Activity';
                await prisma.notification.create({
                    data: {
                        senderId: user.id, message, type
                    }
                });
                res.status(200).json({ success: true, message: "OTP verified proceed to login" });
            }
        }
    }
    catch (err) {
        console.error('Verification failed', err);
        return res.status(500).json({ message: "Verification failed" });
    }
});
// -------------------- LOGIN --------------------
router.post("/login", async (req, res) => {
    const { email, phone, password } = req.body;
    if (!email && !phone && !password) {
        return res.status(400).json({ message: "Email, phone, or password required" });
    }
    try {
        const user = await prisma.user.findFirst({
            where: { OR: [{ email: email || undefined }, { phone: phone || undefined }] },
        });
        if (!user)
            return res.status(404).json({ message: "User not found" });
        if (!user.sign_up_verify)
            return res.status(403).json({ message: "User not verified" });
        // If password is provided, perform password login
        if (password) {
            if (!user.password) {
                return res.status(400).json({ message: "Password not set for this user" });
            }
            const isMatch = await bcrypt.compare(password, user.password);
            if (!isMatch) {
                return res.status(400).json({ message: "Invalid password" });
            }
            const token = jwt.sign({ id: user.id, email: user.email, phone: user.phone }, process.env.JWT_SECRET, { expiresIn: "1h" });
            await prisma.user.update({
                where: { id: user.id },
                data: { otp: null, expiresAt: null, profile: { update: { lastVisit: new Date() } } },
            });
            return res.status(200).json({ message: "Login successful", token, userInfo: user });
        }
        // Otherwise, generate OTP for login
        const loginOtp = generateOtp();
        const otpExpiresAt = new Date(Date.now() + OTP_EXPIRY_MINUTES * 60 * 1000);
        await prisma.user.update({
            where: { id: user.id },
            data: { otp: loginOtp, expiresAt: otpExpiresAt },
        });
        if (email) {
            await resend.emails.send({
                from: "no-reply@alabamarket.com",
                to: email,
                subject: "Your login code",
                html: `<p>Your AlabaMarket verification code is <b>${loginOtp}</b>. Don't share this code with anyone; our employees will never ask for the code.</p>`,
            });
            res.status(200).json({ message: `Login OTP sent to your ${email}`, userId: user.id });
        }
        else if (phone) {
            const verification = await client.verify.v2
                .services("VAa7788291105c30d778521c37ae2e1cd7")
                .verifications.create({
                to: phone,
                channel: "sms",
            });
            res.status(200).json({ message: `Login OTP sent to your ${phone}`, userId: user.id, success: true, status: verification.status });
        }
    }
    catch (err) {
        console.error("Login failed", err);
        return res.status(500).json({ message: "Login failed" });
    }
});
// -------------------- LOGIN VERIFY --------------------
router.post("/login/verify", async (req, res) => {
    const { code } = req.body;
    const phone = typeof req.query.phone === "string" ? req.query.phone : undefined;
    const email = typeof req.query.email === "string" ? req.query.email : undefined;
    try {
        const user = await prisma.user.findFirst({
            where: {
                OR: [
                    email ? { email } : {},
                    phone ? { phone } : {},
                ],
            },
        });
        if (!user)
            return res.status(404).json({ message: "User not found" });
        if (email) {
            if (user.otp !== code) {
                return res.status(400).json({ message: "Invalid code" });
            }
            if (user.expiresAt < new Date()) {
                return res.status(400).json({ message: "Code expired" });
            }
            const token = jwt.sign({ id: user.id, email: user.email, phone: user.phone }, process.env.JWT_SECRET, { expiresIn: "1h" });
            await prisma.user.update({
                where: { id: user.id },
                data: { otp: null, expiresAt: null },
            });
            await prisma.user.update({
                where: { id: user.id },
                data: {
                    profile: {
                        update: {
                            lastVisit: new Date()
                        }
                    }
                }
            });
            res.status(200).json({ message: 'Login successful', token, userInfo: user });
        }
        if (phone) {
            const verificationCheck = await client.verify.v2
                .services("VAa7788291105c30d778521c37ae2e1cd7")
                .verificationChecks.create({
                code,
                to: phone,
            });
            if (verificationCheck.status === "approved") {
                const token = jwt.sign({ id: user.id, email: user.email, phone: user.phone }, process.env.JWT_SECRET, { expiresIn: "1h" });
                await prisma.user.update({
                    where: { id: user.id },
                    data: {
                        profile: {
                            update: {
                                lastVisit: new Date()
                            }
                        }
                    }
                });
                res.status(200).json({ message: 'Login successful', token, userInfo: user });
            }
        }
    }
    catch (err) {
        console.error('Login verification failed', err);
        return res.status(500).json({ message: "Login verification failed" });
    }
});
//Resend otp for registration
router.post("/resend-otp-register", async (req, res) => {
    const { email, phone } = req.body;
    if (!email && !phone) {
        return res.status(400).json({ message: "Email or phone required" });
    }
    try {
        const user = await prisma.user.findFirst({
            where: { OR: [{ email: email || undefined }, { phone: phone || undefined }] },
        });
        if (!user)
            return res.status(404).json({ message: "User not found" });
        // Only allow resend if user is NOT verified
        if (user.sign_up_verify) {
            return res.status(400).json({ message: "User already verified" });
        }
        if (email) {
            const newOtp = generateOtp();
            const otpExpiresAt = new Date(Date.now() + OTP_EXPIRY_MINUTES * 60 * 1000);
            await prisma.user.update({
                where: { id: user.id },
                data: { otp: newOtp, expiresAt: otpExpiresAt },
            });
            await resend.emails.send({
                from: "no-reply@alabamarket.com",
                to: email,
                subject: "Verify your email",
                html: `<p>Your AlabaMarket verification code is <b>${newOtp}</b>. Don't share this code with anyone; our employees will never ask for it.</p>`,
            });
            res.status(200).json({ message: `New verification OTP sent to your ${email}` });
        }
        else if (phone) {
            const verification = await client.verify.v2
                .services("VAa7788291105c30d778521c37ae2e1cd7")
                .verifications
                .create({
                to: phone,
                channel: "sms",
            });
            res.status(200).json({ message: `New verification OTP sent to your ${phone}`, status: verification.status });
        }
    }
    catch (err) {
        console.error("Resend OTP Register failed", err);
        return res.status(500).json({ message: "Resend OTP failed" });
    }
});
//Resend otp for login
router.post("/resend/login/otp", async (req, res) => {
    const { email, phone } = req.body;
    if (!email && !phone) {
        return res.status(400).json({ message: "Email or phone required" });
    }
    try {
        const user = await prisma.user.findFirst({
            where: { OR: [{ email: email || undefined }, { phone: phone || undefined }] },
        });
        if (!user)
            return res.status(404).json({ message: "User not found" });
        if (!user.sign_up_verify) {
            return res.status(403).json({ message: "User not verified" });
        }
        if (email) {
            const newOtp = generateOtp();
            const otpExpiresAt = new Date(Date.now() + OTP_EXPIRY_MINUTES * 60 * 1000);
            await prisma.user.update({
                where: { id: user.id },
                data: { otp: newOtp, expiresAt: otpExpiresAt },
            });
            await resend.emails.send({
                from: "no-reply@alabamarket.com",
                to: email,
                subject: "Your new login code",
                html: `<p>Your new AlabaMarket verification code is <b>${newOtp}</b>. Don't share this code with anyone; our employees will never ask for it.</p>`,
            });
        }
        else if (phone) {
            const verification = await client.verify.v2
                .services("VAa7788291105c30d778521c37ae2e1cd7")
                .verifications.create({
                to: phone,
                channel: "sms",
            });
            res.status(200).json({ message: `New verification OTP sent to your ${phone}`, status: verification.status });
        }
        res.status(200).json({ message: `New OTP sent to your ${phone || email}` });
    }
    catch (err) {
        console.error("Resend OTP failed", err);
        return res.status(500).json({ message: "Resend OTP failed" });
    }
});
//Sign up with google
router.post("/auth/google", async (req, res) => {
    try {
        const { email, name, googleId } = req.body; // received from frontend BetterAuth
        if (!email)
            return res.status(400).json({ message: "Email required" });
        // Check if user exists
        let user = await prisma.user.findFirst({
            where: {
                email,
                profile: {
                    is: {
                        googleId: googleId
                    }
                }
            },
            select: {
                id: true, email: true,
                profile: {
                    select: {
                        name: true, googleId: true
                    }
                }
            }
        });
        if (!user) {
            // Create new user
            user = await prisma.user.create({
                data: {
                    email,
                    profile: {
                        create: {
                            name,
                            googleId
                        }
                    }
                },
                include: { profile: true }
            });
        }
        else {
            // Update last login
            await prisma.user.update({
                where: { id: user.id },
                data: {
                    profile: {
                        update: {
                            lastVisit: new Date()
                        },
                    }
                }
            });
        }
        // Generate your own JWT
        const token = jwt.sign({ id: user.id, email: user.email }, process.env.JWT_SECRET, { expiresIn: "1h" });
        res.status(200).json({ message: 'Login successful', token, userInfo: user });
    }
    catch (err) {
        console.error("Google auth failed:", err);
        res.status(500).json({ message: "Authentication failed" });
    }
});
export default router;
