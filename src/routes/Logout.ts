import express from 'express';
import { Logout } from '../controllers/Logout';

const router = express.Router();

router.post('/', Logout);


export default router;