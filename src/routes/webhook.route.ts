import express from 'express';
import { paymentWebhook } from '../controllers/paymentControler.js';

const router = express.Router();


router.post("/", paymentWebhook);

export default router;