import express from 'express';
import { Logout } from '../controllers/Logout.js';
const router = express.Router();
router.post('/', Logout);
export default router;
