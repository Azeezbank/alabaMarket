// Authentication routes
import express from 'express';
import { register } from '../controllers/Auth.contoller';
import { verifyOTP } from '../controllers/Auth.contoller';
import { resendOtp } from '../controllers/Auth.contoller';
import { loginUser } from '../controllers/Auth.contoller';
import { verifyLoginOTP } from '../controllers/Auth.contoller';
const router = express.Router();

// register new user
router.post('/register', register);

// Verify OTP for registration
router.post('/otp/verify', verifyOTP);

// Resend OTP for registration
router.post('/otp/resend', resendOtp);

// Login user
router.post('/login', loginUser);

// Verify OTP for login
router.post('/login/otp/verify', verifyLoginOTP);

export default router;