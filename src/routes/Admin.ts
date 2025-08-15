import express from 'express';
import { authenticate } from '../middlewares/auth.middleware.js';
import { upload } from '../middlewares/upload.multer.js';
import { UpdateInfo, ChangePassword } from '../controllers/Admin/PersonalInfomation.js';
import { DeleteUser, updateUserRoleToSeller, UpdateUser, GetBuyers, Getsellers, SellerRating, StoreActivities, createNotification } from '../controllers/Admin/user.manage.js';
import { productCategories, getCategories } from '../controllers/Admin/productCategory.js';


const router = express.Router();

router.put('/edit/info', authenticate, upload.single('file'), UpdateInfo);
router.post('/create/category', authenticate, upload.single('file'), productCategories);
router.get('/all/categories', authenticate, getCategories);
router.get("/all/users", authenticate, GetBuyers);
router.get("/all/sellers", authenticate, Getsellers);
router.put('/change/password', authenticate, ChangePassword);
router.put('/update-role-seller', authenticate, updateUserRoleToSeller);
router.get("/seller/store/activity", authenticate, StoreActivities);
router.post('/create/notification/:sellerId', authenticate, createNotification);
router.delete("/delete/user/:customerId", authenticate, DeleteUser);
router.put("/update/user/:customerId", authenticate, UpdateUser);
router.get("/seller/rating/:sellerId", authenticate, SellerRating);


export default router;