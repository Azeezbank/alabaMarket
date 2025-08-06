// //Authentication controller
import prisma from '../prisma';
import jwt from 'jsonwebtoken';
import { Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import dotenv from 'dotenv';
import { sendEmail } from '../utils/mailer';
import { sendOtpSms } from '../utils/sendsms'
dotenv.config();

const jwt_secret_key = process.env.JWT_SECRET;


export const register = async (req: Request, res: Response) => {
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
    const expiresAt = new Date(Date.now() + 5 * 60 * 1000) // 5 minutes expiry
    const hashed = await bcrypt.hash(password, 10);

    // Create user in the database
    const user = await prisma.user.create({
      data: {
        email,
        phone,
        password: hashed,
        otp: otp,
        expiresAt: expiresAt
      }
    });

    // Send OTP via email or SMS 
    if (email) {
      await sendEmail(email, 'Email veriification',
        `
      <h1>Welcome to Alabamarket</h1> <br/> 
      <p>Your OTP is: <strong>${otp}</strong></p>
      <p>Please use this OTP to verify your account.</p>
        <p>Thank you for registering!</p>
      `)
    } else if (phone) {
      //Sent otp to user's phone number through sms
      await sendOtpSms(phone, otp);
    }

    res.status(201).json({ message: 'User registered successfully. OTP sent.' });
  } catch (err: any) {
    console.error('Failed to register user', err);
    return res.status(500).json({ message: 'Failed to register user' });
  }
};


//Verify otp controller
export const verifyOTP = async (req: Request, res: Response) => {
  const { otp } = req.body;

  try {
    const user = await prisma.user.findFirst({
      where: { otp }, orderBy: { createdAt: 'desc' },
    })

    if (!user || otp !== user.otp) {
      return res.status(400).json({ message: 'Invalid OTP' });
    }

    if (user.expiresAt < new Date()) {
      return res.status(410).json({ message: 'OTP expired' })
    }

    //Delete verification otp
    await prisma.user.update({
      where: { id: user.id },
      data: { otp: null}
    })

    // Set a flag to indicate the user is verified
    await prisma.user.update({
      where: { id: user.id},
      data: {
        sign_up_verify: true,
      }
    })

    res.status(200).json({ message: 'OTP verified, user authenticated' })
  } catch (err: any) {
    console.error('Failed to verify OTP', err);
    return res.status(500).json({ message: 'Failed to verify OTP' });
  }
};


//Resend OTP controller
export const resendOtp = async (req: Request, res: Response) => {
  const phone = req.query.phone as string;
  const email = req.query.email as string;

  const Otp =  Math.floor(100000 + Math.random() * 900000).toString();
  const expiresAt = new Date(Date.now() + 5 * 60 * 1000) // 5 mins

  try {
    // Check if there's an existing OTP
    const existing = await prisma.user.findFirst({
      where: {
        OR: [{ phone }, { email }],
        orderBy: { createdAt: 'desc' }
      }
    })

    if (!existing) {
      return res.status(404).json({ message: 'User not found.' });
    }

    // If OTP exists and is not expired, block resend (optional)
    if (existing && existing.expiresAt > new Date()) {
      return res.status(400).json({ message: 'Current OTP is still valid. Please wait for it to expire.' });
    }

    // update new OTP
    await prisma.user.update({
      where: { id: existing.id},
        data: {
          otp: Otp,
          expiresAt: expiresAt
        }
      })

    // Send OTP via email or SMS 
    if (email) {
      await sendEmail(email, 'Email veriification',
        `
      <h1>Welcome to Alabamarket</h1> <br/> 
      <p>Your OTP is: <strong>${Otp}</strong></p>
      <p>Please use this OTP to verify your account.</p>
        <p>Thank you for registering!</p>
      `)
    } else if (phone) {
      //Sent otp to user's phone number through sms
      await sendOtpSms(phone, Otp);
    }

    res.status(200).json({ message: 'New OTP sent successfully.' })
  } catch (err) {
    return res.status(500).json({ message: 'Failed to resend OTP', error: err })
  }
}

// Login: Generate and send OTP
export const loginUser = async (req: Request, res: Response) => {
  const { phone, email } = req.body;

  if (!phone && !email) {
    return res.status(400).json({ message: "Phone or email is required" });
  }

  const user = await prisma.user.findUnique({ where: {
    OR: [{ phone }, {email}] } });

  if (!user) {
    return res.status(404).json({ message: "User not found" });
  }

  const otp = Math.floor(100000 + Math.random() * 900000).toString() // e.g. 6-digit code
  const otpExpiresAt = new Date(Date.now() + 5 * 60 * 1000); // 5 minutes

  await prisma.user.update({
    where: { id: user.id },
    data: {
      otp,
      expiresAt: otpExpiresAt,
    },
  });

  // Send OTP via email or SMS 
    if (email) {
      await sendEmail(email, 'Email veriification',
        `
      <h1>Welcome to Alabamarket</h1> <br/> 
      <p>Your OTP is: <strong>${otp}</strong></p>
      <p>Please use this OTP to verify your account.</p>
        <p>Thank you for registering!</p>
      `)
    } else if (phone) {
      //Sent otp to user's phone number through sms
      await sendOtpSms(phone, otp);
    }

  res.status(200).json({ message: "OTP sent to phone" });
};

// Verify OTP during login
export const verifyLoginOTP = async (req: Request, res: Response) => {
  const { otp } = req.body;

  const user = await prisma.user.findUnique({ where: { otp } });

  if (!user) {
    return res.status(400).json({ message: "No OTP record found" });
  }

  const now = new Date();

  if (user.otp !== otp) {
    return res.status(400).json({ message: "Invalid OTP" });
  }

  if (user.expiresAt < now) {
    return res.status(400).json({ message: "OTP has expired" });
  }

  // Clear OTP after successful verification
    await prisma.user.update({
      where: { id: user.id },
      data: { otp: null, expiresAt: null },
    });

    // Generate JWT token
    const token = jwt.sign(
      {
        userId: user.id,
        email: user.email,
        phone: user.phone,
      },
      jwt_secret_key!,
      { expiresIn: "1h" } // token valid for 1 hour
    );

  // Set cookie with JWT (HTTPOnly and Secure for production)
  res.cookie("token", token, {
    httpOnly: true,
    secure: true,
    maxAge: 60 * 60 * 1000, // 1 hour in milliseconds
    sameSite: "none",
    path: "/",
  });


  res.status(200).json({ message: "Login successful" });
};