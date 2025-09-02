import express from "express";
import { initiatePayment } from '../controllers/paymentControler.js';
import { authenticate } from "../middlewares/auth.middleware.js";

const router = express.Router();

router.post("/:planId", authenticate, initiatePayment);

export default router;