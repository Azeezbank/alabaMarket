import express from 'express';
import { protectPage } from '../controllers/protectPage.js';
import { authenticate } from '../middlewares/auth.middleware.js';

const router = express.Router();

// Protect the page route with authentication middleware
router.get('/page', authenticate, protectPage);

export default router;