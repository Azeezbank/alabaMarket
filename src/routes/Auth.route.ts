// Authentication routes
import express from 'express';
import { register } from '../controllers/Auth.contoller';
import { verifyOTP } from '../controllers/Auth.contoller';
import { resendOtp } from '../controllers/Auth.contoller';
import { loginUser } from '../controllers/Auth.contoller';
const router = express.Router();

// register new user
router.post('/register', register);

// Verify OTP for registration
router.post('/verify/register', verifyOTP);

// Resend OTP for registration
router.post('/otp/resend', resendOtp);

// Login user
router.post('/login', loginUser);


export default router;