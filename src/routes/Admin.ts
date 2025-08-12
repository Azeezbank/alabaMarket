import express from 'express';
import { authenticate } from '../middlewares/auth.middleware';
import { upload } from '@/middlewares/upload.multer';
import { UpdateInfo, ChangePassword } from '../controllers/Admin/PersonalInfomation';
import { DeleteUser, UpdateUser, GetBuyers } from '../controllers/Admin/user.manage';

const router = express.Router();

router.put('/edit/info', authenticate, upload.single('file'), UpdateInfo);
router.get("/all/users", authenticate, GetBuyers);
router.put('/change/password', authenticate, ChangePassword);
router.delete("/delete/user/:customerId", authenticate, DeleteUser);
router.put("/update/user/:customerId", authenticate, UpdateUser);


export default router;