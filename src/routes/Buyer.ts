import express from 'express';
import { authenticate } from '../middlewares/auth.middleware.js';
import { upload } from '../middlewares/upload.multer.js';
import { buyerSetting } from '../controllers/buyer/account.js';
import { fetchcategories } from '../controllers/buyer/categories.js';
import { likes, love } from '../controllers/buyer/likes_love.js';
import { productrating, productReviewRatingAvg, productratingDistribution } from '../controllers/buyer/listing.rating.js';
import { filterpopularListings, filterListingsByPriceRange, 
    filterListingsByLessPrice, filterListingsByGreaterPrice, fetchVerifiedSellerListing, 
    fetchUnverifiedSellerListing, fetchSellerListingByCondition, productOwner, productReport, savedProduct,
getSavedProduct, getActiveListing, getSellerActiveListing, getSellerListingBySubCategory } from '../controllers/buyer/listing.js';
import { getBuyerallNotifications, getBuyerReadNotifications, getBuyerUnReadNotifications } from '../controllers/buyer/notification.js';
import { handleQuestion } from '../controllers/buyer/question.js';

const router = express.Router();


router.put('/account', authenticate, upload.single('file'), buyerSetting);
router.get('/listing/categories', fetchcategories);
// router.get('/active/seller/listing', authenticate, storeFetchActiveSellerListings);
router.get('/popular/listing', filterpopularListings);
router.get('/listing/price/range', filterListingsByPriceRange);
router.get('/listing/price/less', filterListingsByLessPrice);
router.get('/listing/price/greater', filterListingsByGreaterPrice);
// router.get('/all/listing', authenticate, FetchAllSellerListings);
router.get('/verified/seller/listing', authenticate, fetchVerifiedSellerListing);
router.get('/unverified/seller/listing', authenticate, fetchUnverifiedSellerListing);
router.get('/listing/condition', fetchSellerListingByCondition);
router.get('/listing/owner/details/:productId', productOwner);
router.get('/saved/product', authenticate, getSavedProduct);
router.get('/all/active/listing', getActiveListing);
router.get('/all/notification', authenticate, getBuyerallNotifications);
router.get('/all/read/notification', authenticate, getBuyerReadNotifications);
router.get('/all/unread/notification', authenticate, getBuyerUnReadNotifications);
router.post('/question', authenticate, handleQuestion);
router.get('/seller/active/listing/:sellerId', getSellerActiveListing);
router.post('/like/unlike/:productId', likes);
router.post('/saved/listing/:productId', authenticate, savedProduct);
router.post('/love/:productId', love);
router.post('/report/listing/:productId', authenticate, productReport);
router.get('/average/rating/:productId', productReviewRatingAvg);
router.get('/rating/distribution/:productId', productratingDistribution);
router.put('/rating/:productId', authenticate, productrating);
router.get('/seller/active/listing/:sellerId/:subCategoryId', getSellerListingBySubCategory);



export default router;