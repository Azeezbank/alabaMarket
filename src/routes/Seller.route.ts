import express from "express";
import { upload } from "../middlewares/upload.multer.js";
import { createShop, getShopdetails, updateShopDetails, updateShopStatus, deleteShop, getSubscriptionPlans } from "../controllers/seller/Shop.js";
import { authenticate } from "../middlewares/auth.middleware.js";
import { SellerVerification, updateVerificationIdCard, isSeller } from "../controllers/seller/SellerVerification.js";
import { productDetails, productPricing, updateProductcategory, FetchSellerListings, FetchAllSellerListings,
    EditSellerListing, DeleteSellerListing, PauseSellerListing, allproductCategory, productSubCategory, toggleProductVisibility, DeleteProductImage, DeleteProductVideo,
fetchProductImages, fetchProductVideos, addMoreProductImage, addMoreProductVideo } from '../controllers/seller/Listing.js';
import { createComment, getCommentsByProduct } from '../controllers/seller/listing.comment.js';
import { getNotifications } from '../controllers/seller/Notification.js';
import { initiatePayment, checkTransactionStatus } from '../controllers/paymentControler.js';


const router = express.Router();

router.post("/create/shop", authenticate, upload.single("file"), createShop);
router.get("/shop/details", authenticate, getShopdetails);
router.post("/seller/vefication", authenticate, upload.fields([{ name: "idCard", maxCount: 1}, {name: "passport", maxCount: 1}]), SellerVerification);
router.post("/update/seller/vefication", authenticate, upload.fields([{ name: "idCard", maxCount: 1}]), updateVerificationIdCard);
router.put('/listing/pause/:productId', authenticate, PauseSellerListing);
router.get("/notifications", authenticate, getNotifications);
router.post("/comments", authenticate, createComment);
router.get('/check/user/role/status', authenticate, isSeller);
router.get('/listing/category', authenticate, allproductCategory);
router.put('/update/product/pricing', authenticate, productPricing);
router.put("/update/shop", authenticate, upload.single('file'), updateShopDetails);
router.get("/seller/listing", authenticate, FetchSellerListings);
router.get("/all/seller/listing", authenticate, FetchAllSellerListings);
router.delete('/shop/delete', authenticate, deleteShop);
router.put("/shop/status/update", authenticate, updateShopStatus);
router.get("/payment/status", authenticate, checkTransactionStatus);
router.get("subscription/plans", authenticate, getSubscriptionPlans);
router.delete("/delete/product/image/:imageId", authenticate, DeleteProductImage);
router.delete("/delete/product/video/:videoId", authenticate, DeleteProductVideo);
router.get("/product/images/:productId", authenticate, fetchProductImages);
router.get("/product/videos/:productId", authenticate, fetchProductVideos);
router.post("/plan/subscribe/:planId", authenticate, initiatePayment);
router.put("/toggle/listing/visibility/:productId", authenticate, toggleProductVisibility);
router.get('/listing/subcategory/:categoryId', authenticate, productSubCategory);
router.post('/create/product/:shopId', authenticate, upload.fields([{ name: 'productImage', maxCount: 10}, { name: "productReel", maxCount: 10}]), productDetails);
router.post('/add/product/photo/:productId', authenticate, upload.fields([{ name: 'productImage', maxCount: 10}, { name: "productReel", maxCount: 10}]), productDetails);
router.post('/add/product/video/:productId', authenticate, upload.fields([{ name: 'productImage', maxCount: 10}, { name: "productReel", maxCount: 10}]), productDetails);
router.delete("/delete/listing/:productId", authenticate, DeleteSellerListing);
router.get("/comments/product/:productId", getCommentsByProduct);
router.put('/update/product/category/:categoryId/:subCategoryId', authenticate, updateProductcategory);
router.put("/update/listing/:productId/:categoryId/:subCategoryId", authenticate, EditSellerListing);
export default router;