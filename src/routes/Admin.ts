import express from 'express';
import { authenticate } from '../middlewares/auth.middleware';
import { upload } from '@/middlewares/upload.multer';
import { UpdateInfo, ChangePassword } from '../controllers/Admin/PersonalInfomation';

const router = express.Router();

router.put('/edit/info', authenticate, upload.single('file'), UpdateInfo);
router.put('/change/password', authenticate, ChangePassword);


export default router;