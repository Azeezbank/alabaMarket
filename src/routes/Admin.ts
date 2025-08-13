import express from 'express';
import { authenticate } from '../middlewares/auth.middleware';
import { upload } from '@/middlewares/upload.multer';
import { UpdateInfo, ChangePassword } from '../controllers/Admin/PersonalInfomation.js';
import { DeleteUser, UpdateUser, GetBuyers, Getsellers, SellerRating, StoreActivities, createNotification } from '../controllers/Admin/user.manage.js';

const router = express.Router();

router.put('/edit/info', authenticate, upload.single('file'), UpdateInfo);
router.get("/all/users", authenticate, GetBuyers);
router.get("/all/sellers", authenticate, Getsellers);
router.put('/change/password', authenticate, ChangePassword);
router.get("/seller/store/activity", authenticate, StoreActivities);
router.post('/create/notification/:sellerId', authenticate, createNotification);
router.delete("/delete/user/:customerId", authenticate, DeleteUser);
router.put("/update/user/:customerId", authenticate, UpdateUser);
router.get("/seller/rating/:sellerId", authenticate, SellerRating);


export default router;