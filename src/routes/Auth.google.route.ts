import { Router } from 'express';
import { googleAuth, googleCallback } from '../controllers/GoogleAuth.controller';

const router = Router();

router.get('/google', googleAuth);
router.get('/google/callback', googleCallback);

export default router;