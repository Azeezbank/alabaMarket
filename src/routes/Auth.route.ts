import express from "express";
import prisma from '../prisma.client.js';
import { Resend } from "resend";
import twilio from "twilio";
import jwt from "jsonwebtoken";
import dotenv from 'dotenv';
dotenv.config();

const router = express.Router();

// Resend setup
const resend = new Resend(process.env.RESEND_API_KEY!);

// Twilio setup
const twilioClient = twilio(
  process.env.TWILIO_ACCOUNT_SID!,
  process.env.TWILIO_AUTH_TOKEN!
);

const OTP_EXPIRY_MINUTES = 10;

// Generate OTP
function generateOtp(): string {
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
    } else if (phone) {
      await twilioClient.messages.create({
        to: phone,
        messagingServiceSid: process.env.TWILIO_MESSAGING_SERVICE_SID!,
        body: `Your AlabaMarket verification code is <b>${verificationOTP}</b>. Don't share this code with anyone; our employees will never ask for the code.`,
      });
    }

    res.status(201).json({
      message: "User registered. Verification code sent.",
      userId: newUser.id,
    });
  } catch (err) {
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

    if (!user) return res.status(404).json({ message: "User not found." });

    if (user.otp !== code) {
      return res.status(400).json({ message: "Invalid verification code." });
    }

    if (user.expiresAt! < new Date()) {
      return res.status(400).json({ message: "Verification code expired." });
    }

    await prisma.user.update({
      where: { id: user.id },
      data: { sign_up_verify: true, otp: null, expiresAt: null },
    });

    const userDetails = user.email || user.phone;

    const message = `New member ${userDetails} has been registerd on your platform`;
        const type = 'User Activity';

        await prisma.notification.create({
            data: {
                senderId: user.id, message, type
            }
        })

    res.status(200).json({ message: "Account verified successfully." });
  } catch (err) {
    console.error('Verification failed', err)
    return res.status(500).json({ message: "Verification failed" });
  }
});

// -------------------- LOGIN --------------------
router.post("/login", async (req, res) => {
  const { email, phone } = req.body;

  if (!email && !phone) {
    return res.status(400).json({ message: "Email or phone required" });
  }

  try {
    const user = await prisma.user.findFirst({
      where: { OR: [{ email: email || undefined }, { phone: phone || undefined }] },
    });
    if (!user) return res.status(404).json({ message: "User not found" });

    if (!user.sign_up_verify) {
      return res.status(403).json({ message: "User not verified" });
    }

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
    } else if (phone) {
      await twilioClient.messages.create({
        to: phone,
        messagingServiceSid: process.env.TWILIO_MESSAGING_SERVICE_SID!,
        body: `Your AlabaMarket verification code is <b>${loginOtp}</b>. Don't share this code with anyone; our employees will never ask for the code.`,
      });
    }

    res.status(200).json({ message: `Login OTP sent to your ${phone} ${email}`, userId: user.id });
  } catch (err) {
    console.error('Login failed', err)
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
    if (!user) return res.status(404).json({ message: "User not found" });

    if (user.otp !== code) {
      return res.status(400).json({ message: "Invalid code" });
    }

    if (user.expiresAt! < new Date()) {
      return res.status(400).json({ message: "Code expired" });
    }

    const token = jwt.sign(
      { id: user.id, email: user.email, phone: user.phone },
      process.env.JWT_SECRET!,
      { expiresIn: "1h" }
    );

    await prisma.user.update({
      where: { id: user.id },
      data: { otp: null, expiresAt: null },
    });

    await prisma.user.update({
      where: { id: user.id },
      data: { 
        profile: {
          update: {
        lastVisit: new Date() }
          }
      }
    });

    res.status(200).json({ message: 'Login successful', token, userInfo: user });
  } catch (err) {
    console.error('Login verification failed', err)
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
    if (!user) return res.status(404).json({ message: "User not found" });

    // Only allow resend if user is NOT verified
    if (user.sign_up_verify) {
      return res.status(400).json({ message: "User already verified" });
    }

    const newOtp = generateOtp();
    const otpExpiresAt = new Date(Date.now() + OTP_EXPIRY_MINUTES * 60 * 1000);

    await prisma.user.update({
      where: { id: user.id },
      data: { otp: newOtp, expiresAt: otpExpiresAt },
    });

    if (email) {
      await resend.emails.send({
        from: "no-reply@alabamarket.com",
        to: email,
        subject: "Verify your email",
        html: `<p>Your AlabaMarket verification code is <b>${newOtp}</b>. Don't share this code with anyone; our employees will never ask for it.</p>`,
      });
    } else if (phone) {
      await twilioClient.messages.create({
        to: phone,
        messagingServiceSid: process.env.TWILIO_MESSAGING_SERVICE_SID!,
        body: `Your AlabaMarket verification code is ${newOtp}. Don't share this code with anyone; our employees will never ask for it.`,
      });
    }

    res.status(200).json({ message: `New verification OTP sent to your ${phone || email}` });
  } catch (err) {
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
    if (!user) return res.status(404).json({ message: "User not found" });

    if (!user.sign_up_verify) {
      return res.status(403).json({ message: "User not verified" });
    }

    const newOtp = generateOtp();
    const otpExpiresAt = new Date(Date.now() + OTP_EXPIRY_MINUTES * 60 * 1000);

    await prisma.user.update({
      where: { id: user.id },
      data: { otp: newOtp, expiresAt: otpExpiresAt },
    });

    if (email) {
      await resend.emails.send({
        from: "no-reply@alabamarket.com",
        to: email,
        subject: "Your new login code",
        html: `<p>Your new AlabaMarket verification code is <b>${newOtp}</b>. Don't share this code with anyone; our employees will never ask for it.</p>`,
      });
    } else if (phone) {
      await twilioClient.messages.create({
        to: phone,
        messagingServiceSid: process.env.TWILIO_MESSAGING_SERVICE_SID!,
        body: `Your new AlabaMarket verification code is ${newOtp}. Don't share this code with anyone; our employees will never ask for it.`,
      });
    }

    res.status(200).json({ message: `New OTP sent to your ${phone || email}` });
  } catch (err) {
    console.error("Resend OTP failed", err);
    return res.status(500).json({ message: "Resend OTP failed" });
  }
});


export default router;