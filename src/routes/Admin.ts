import express from 'express';
import { authenticate } from '../middlewares/auth.middleware.js';
import { upload } from '../middlewares/upload.multer.js';
import { UpdateInfo, ChangePassword } from '../controllers/Admin/PersonalInfomation.js';
import { DeleteUser, UpdateUser, GetBuyers, Getsellers, SellerRating, 
    StoreActivities, AllAdmin, getUsers, getShops, getActiveListing, activities,
newadmin, UpdateSellers, updateUserRole, paymentReminder,  adminRoleManagement, newRole, editRole,
suspendAdmin, reactivateAdminAccess } from '../controllers/Admin/user.manage.js';
import { productCategories, updateProductCategories, getCategories, getSubCategories, createSubCategories } from '../controllers/Admin/productCategory.js';
import { freeListing, rejectListing, boostCampain, updateCampaign, updateCampaignStatus } from '../controllers/Admin/listing.js';
import { promoBannerMgt, createBanner, updateBanner, deleteBanner, boostPackages, newBoostPackages,
    editBoostPackages, deletePackages } from '../controllers/Admin/PromotionMtg.js'; 
import { sellerVerificationReview, approveSellerVerification, rejectSellerVerification } from '../controllers/Admin/seller.verification.js';
import { createTickets, getTickets, assignTicketAgent, openTicket, escalateTicket, markTicketAsRead } from '../controllers/Admin/Ticket.js';

const router = express.Router();

router.get('/all/free/listing', authenticate, freeListing);
router.put('/reject/listing/:productId', authenticate, rejectListing);
router.get('/boost/campaign/review', authenticate, boostCampain);
router.put('/edit/info', authenticate, upload.single('file'), UpdateInfo);
router.put('/change/password', authenticate, ChangePassword);
router.post('/create/category', authenticate, upload.single('file'), productCategories);
router.get('/all/categories', authenticate, getCategories);
router.get('/all/subcategory', authenticate, getSubCategories);
router.post('/create/subcategory', authenticate, createSubCategories);
router.post('create/promo/banner', authenticate, createBanner);
router.get('/promotional/banner/mgt', authenticate, promoBannerMgt);
router.get('/boost/packages', authenticate, boostPackages);
router.post('/new/boost/packages', authenticate, newBoostPackages);
router.get('/seller/verification', authenticate, sellerVerificationReview);
router.post('/create/ticket', authenticate, createTickets);
router.get('/tickets', authenticate, getTickets);
router.get('/all/admin', authenticate, AllAdmin);
router.get('/total/user', authenticate, getUsers);
router.get('/total/shops', authenticate, getShops);
router.get('/activities', authenticate, activities);
router.get('/role/management', authenticate,  adminRoleManagement);
router.post('/add/new/admin/role', authenticate, newRole);
router.put('/update/user/role', authenticate, updateUserRole);
router.post('/new/admin', authenticate, newadmin);
router.get("/all/users", authenticate, GetBuyers);
router.get("/all/sellers", authenticate, Getsellers);
router.get('/total/active/listing', authenticate, getActiveListing);
router.put('/edit/admin/role/:roleId', authenticate, editRole);
router.put('/suspend/admin/:userId', authenticate, suspendAdmin);
router.put('/reactivate/admin/access/:userId', authenticate, reactivateAdminAccess);
router.put('/assign/ticket/agent/:ticketId', authenticate, assignTicketAgent);
router.delete("/delete/user/:customerId", authenticate, DeleteUser);
router.post('/send/payment/reminder/:receiverId', authenticate, paymentReminder);
router.put("/update/user/:customerId", authenticate, UpdateUser);
router.put('/open/ticket/:ticketId', authenticate, openTicket);
router.put('/update/seller/info/:customerId', authenticate, UpdateSellers);
router.get("/seller/rating/:sellerId", authenticate, SellerRating);
router.put('/escalate/ticket/:ticketId', authenticate, escalateTicket);
router.get("/seller/store/activity/:sellerId", authenticate, StoreActivities);
router.put('/mark/ticket/read/:ticketId', authenticate, markTicketAsRead);
router.put('/approve/seller/verification/:verificationId', authenticate, approveSellerVerification);
router.put('/reject/seller/verification/:verificationId', authenticate, rejectSellerVerification)
router.delete('/boost/package/:packageId', authenticate, deletePackages);
router.put('/edit/boost/package/:packageId', authenticate, editBoostPackages);
router.put('/update/promo/banner/:bannerId', authenticate, updateBanner);
router.delete('promo/banner/:bannerId', authenticate, deleteBanner);
router.put('/update/boosted/listing/:campaignId', authenticate, updateCampaign);
router.put('/pause/suspend/boost/:campaignId', authenticate, updateCampaignStatus)
router.put('/update/category/:categoryId', authenticate, upload.single('file'), updateProductCategories);


export default router;