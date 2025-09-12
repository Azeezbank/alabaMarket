import express from 'express';
import { protectPage } from '../controllers/protectPage';
import { authenticate } from '../middlewares/auth.middleware';

const router = express.Router();

// Protect the page route with authentication middleware
router.get('/page', authenticate, protectPage);

export default router;