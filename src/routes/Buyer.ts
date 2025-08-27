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
getSavedProduct, getActiveListing, getActiveListingByPlan, getActiveFreeListing } from '../controllers/buyer/listing.js';
import { getBuyerallNotifications, getBuyerReadNotifications, getBuyerUnReadNotifications } from '../controllers/buyer/notification.js';
import { handleQuestion } from '../controllers/buyer/question.js';

const router = express.Router();


router.put('/account', authenticate, upload.single('file'), buyerSetting);
router.get('/listing/categories', authenticate, fetchcategories);
// router.get('/active/seller/listing', authenticate, storeFetchActiveSellerListings);
router.get('/popular/listing', authenticate, filterpopularListings);
router.get('/listing/price/range', authenticate, filterListingsByPriceRange);
router.get('/listing/price/less', authenticate, filterListingsByLessPrice);
router.get('/listing/price/greater', authenticate, filterListingsByGreaterPrice);
// router.get('/all/listing', authenticate, FetchAllSellerListings);
router.get('/verified/seller/listing', authenticate, fetchVerifiedSellerListing);
router.get('/unverified/seller/listing', authenticate, fetchUnverifiedSellerListing);
router.get('/listing/condition', authenticate, fetchSellerListingByCondition);
router.get('/listing/owner/details/:productId', authenticate, productOwner);
router.get('/saved/product', authenticate, getSavedProduct);
router.get('/all/active/listing', authenticate, getActiveListing);
router.get('/boosted/plan/listing', authenticate, getActiveListingByPlan);
router.get('/free/boosted/listing', authenticate, getActiveFreeListing);
router.get('/all/notification', authenticate, getBuyerallNotifications);
router.get('/all/read/notification', authenticate, getBuyerReadNotifications);
router.get('/all/unread/notification', authenticate, getBuyerUnReadNotifications);
router.post('/question', authenticate, handleQuestion);
router.post('/like/unlike/:productId', authenticate, likes);
router.post('/saved/listing/:productId', authenticate, savedProduct);
router.post('/love/:productId', authenticate, love);
router.post('/report/listing/:productId', authenticate, productReport);
router.get('/average/rating/:productId', authenticate, productReviewRatingAvg);
router.get('/rating/distribution/:productId', authenticate, productratingDistribution);
router.put('/rating/:productId', authenticate, productrating);



export default router;