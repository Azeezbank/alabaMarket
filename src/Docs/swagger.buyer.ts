/**
 * @swagger
 * tags:
 *   name: Buyer
 *   description: Buyer account management and profile updates
 */

/**
 * @swagger
 * /api/buyer/account:
 *   put:
 *     summary: Update buyer account/profile
 *     tags: [Buyer]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 description: Buyer's name
 *               email:
 *                 type: string
 *                 format: email
 *                 description: Buyer's email
 *               phoneNumber:
 *                 type: string
 *                 description: Buyer's phone number
 *               file:
 *                 type: string
 *                 format: binary
 *                 description: Profile picture
 *     responses:
 *       200:
 *         description: Profile updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Profile updated successfully
 *       400:
 *         description: No file uploaded
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: No file uploaded
 *       500:
 *         description: Failed to update buyer profile
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Something went wrong, failed to update buyer profile
 */


/**
 * @swagger
 * /api/buyer/listing/categories:
 *   get:
 *     summary: Fetch all product categories
 *     tags: [Buyer]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of categories retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   id:
 *                     type: string
 *                     description: Category ID
 *                   name:
 *                     type: string
 *                     description: Category name
 *                   image:
 *                     type: string
 *                     description: Category image URL
 *                   createdAt:
 *                     type: string
 *                     format: date-time
 *                     description: Date the category was created
 *                   _count:
 *                     type: object
 *                     properties:
 *                       product:
 *                         type: integer
 *                         description: Number of products in this category
 *       500:
 *         description: Failed to fetch categories
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Something went wrong, Failed to select categories
 */

/**
 * @swagger
 * /api/buyer/like/unlike/{productId}:
 *   post:
 *     summary: Like or unlike a product
 *     tags: [Buyer]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: productId
 *         schema:
 *           type: string
 *         required: true
 *         description: ID of the product to like/unlike
 *     responses:
 *       201:
 *         description: Product liked or unliked successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Likes/unliked successfully
 *                 likeCount:
 *                   type: integer
 *                   example: 10
 *       500:
 *         description: Failed to like/unlike the product
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Something went wrong, failed to Like or unlike product
 */

/**
 * @swagger
 * /api/buyer/love/{productId}:
 *   post:
 *     summary: Love or unlove a product
 *     tags: [Buyer]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: productId
 *         schema:
 *           type: string
 *         required: true
 *         description: ID of the product to love/unlove
 *     responses:
 *       201:
 *         description: Product loved or unloved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Loved successfully
 *                 loveCount:
 *                   type: integer
 *                   example: 5
 *       500:
 *         description: Failed to love/unlove the product
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Something went wrong, failed to Like or unlove product
 */


/**
 * @swagger
 * /api/buyer/rating/{customerId}:
 *   put:
 *     summary: Create or update product rating by buyer, the customerId is the seller Id
 *     tags: [Buyer]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: customerId
 *         schema:
 *           type: string
 *         required: true
 *         description: ID of the product
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - stars
 *             properties:
 *               stars:
 *                 type: integer
 *                 minimum: 1
 *                 maximum: 5
 *                 description: Star rating (1–5)
 *               comment:
 *                 type: string
 *                 description: Review comment
 *     responses:
 *       200:
 *         description: Product rated successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Product rated successfully
 *       401:
 *         description: Unauthorized
 *       500:
 *         description: Failed to rate product
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Something went wrong, Failed to rate product
 */

/**
 * @swagger
 * /api/buyer/average/rating/{customerId}:
 *   get:
 *     summary: Get average rating and reviews for a product
 *     tags: [Buyer]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: customerId
 *         schema:
 *           type: string
 *         required: true
 *         description: ID of the product
 *     responses:
 *       200:
 *         description: Average rating and reviews retrieved successfully
 *       500:
 *         description: Failed to get product rating
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Something went wrong, Failed to rate product
 */

/**
 * @swagger
 * /api/buyer/rating/distribution/{customerId}:
 *   get:
 *     summary: Get rating distribution (number of 1–5 stars) for a product
 *     tags: [Buyer]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: customerId
 *         schema:
 *           type: string
 *         required: true
 *         description: ID of the product
 *     responses:
 *       200:
 *         description: Rating distribution retrieved successfully
 *       500:
 *         description: Failed to get rating distribution
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Something went wrong, Failed to get rating distribution
 */


/**
 * @swagger
 * /api/buyer/popular/listing:
 *   get:
 *     summary: Filter listings by product name
 *     tags: [Buyer]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: name
 *         schema:
 *           type: string
 *         required: true
 *         description: Name of the product to filter
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Filtered products fetched successfully
 *       500:
 *         description: Failed to fetch product listings
 */

/**
 * @swagger
 * /api/buyer/listing/price/range:
 *   get:
 *     summary: Filter listings by price range
 *     tags: [Buyer]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: fromAmount
 *         schema:
 *           type: number
 *         required: true
 *       - in: query
 *         name: toAmount
 *         schema:
 *           type: number
 *         required: true
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Products fetched successfully within price range
 *       500:
 *         description: Failed to fetch product listings
 */

/**
 * @swagger
 * /api/buyer/listing/price/less:
 *   get:
 *     summary: Filter listings by price less than a value
 *     tags: [Buyer]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: fromAmount
 *         schema:
 *           type: number
 *         required: true
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Products fetched successfully below price
 *       500:
 *         description: Failed to fetch product listings
 */

/**
 * @swagger
 * /api/buyer/listing/price/greater:
 *   get:
 *     summary: Filter listings by price greater than a value
 *     tags: [Buyer]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: fromAmount
 *         schema:
 *           type: number
 *         required: true
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Products fetched successfully above price
 *       500:
 *         description: Failed to fetch product listings
 */

/**
 * @swagger
 * /api/buyer/verified/seller/listing:
 *   get:
 *     summary: Fetch products from verified sellers
 *     tags: [Buyer]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Products from verified sellers fetched successfully
 *       500:
 *         description: Failed to fetch product listings
 */

/**
 * @swagger
 * /api/buyer/unverified/seller/listing:
 *   get:
 *     summary: Fetch products from unverified sellers
 *     tags: [Buyer]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Products from unverified sellers fetched successfully
 *       500:
 *         description: Failed to fetch product listings
 */

/**
 * @swagger
 * /api/buyer/listing/condition:
 *   get:
 *     summary: Fetch products by condition (e.g., Brand new, Neatly Used)
 *     tags: [Buyer]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: condition
 *         schema:
 *           type: string
 *         required: true
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Products fetched successfully by condition
 *       500:
 *         description: Failed to fetch product listings
 */

/**
 * @swagger
 * /api/buyer/listing/owner/details/{productId}:
 *   get:
 *     summary: Fetch product owner and store details
 *     tags: [Buyer]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: productId
 *         schema:
 *           type: string
 *         required: true
 *         description: ID of the product
 *     responses:
 *       200:
 *         description: Product owner fetched successfully
 *       500:
 *         description: Failed to fetch product owner
 */

/**
 * @swagger
 * /api/buyer/report/listing/{productId}:
 *   post:
 *     summary: Create a product report
 *     tags: [Buyer]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: productId
 *         schema:
 *           type: string
 *         required: true
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               reason:
 *                 type: string
 *               description:
 *                 type: string
 *     responses:
 *       200:
 *         description: Report submitted successfully
 *       500:
 *         description: Failed to submit report
 */

/**
 * @swagger
 * /api/buyer/saved/listing/{productId}:
 *   post:
 *     summary: Bookmark/save a product
 *     tags: [Buyer]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: productId
 *         schema:
 *           type: string
 *         required: true
 *     responses:
 *       201:
 *         description: Product saved successfully
 *       500:
 *         description: Failed to bookmark product
 */

/**
 * @swagger
 * /api/buyer/saved/product:
 *   get:
 *     summary: Fetch all saved/bookmarked products for the user
 *     tags: [Buyer]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Saved products fetched successfully
 *       500:
 *         description: Failed to fetch saved products
 */

/**
 * @swagger
 * /api/buyer/all/active/listing:
 *   get:
 *     summary: Get active free and paid boosted listings
 *     description: >
 *       Fetch all active boosted listings that are not expired.  
 *       Includes product details, pricing, photos, videos, likes/loves count, and seller profile.  
 *       Results are cached in Redis for 5 minutes (300 seconds).
 *     tags: [Buyer]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           default: 1
 *         description: Page number for pagination
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           default: 10
 *         description: Number of listings per page
 *     responses:
 *       200:
 *         description: Successful response with active boosted listings
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 page:
 *                   type: integer
 *                   example: 1
 *                 limit:
 *                   type: integer
 *                   example: 10
 *                 total:
 *                   type: integer
 *                   example: 25
 *                 activeBoosts:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       id:
 *                         type: string
 *                         example: "boost_12345"
 *                       endDate:
 *                         type: string
 *                         format: date-time
 *                         example: "2025-09-15T23:59:59.000Z"
 *                       status:
 *                         type: string
 *                         example: "Active"
 *                       product:
 *                         type: object
 *                         properties:
 *                           id:
 *                             type: string
 *                             example: "prod_12345"
 *                           status:
 *                             type: string
 *                             example: "Approved"
 *                           productPhoto:
 *                             type: array
 *                             items:
 *                               type: object
 *                               properties:
 *                                 url:
 *                                   type: string
 *                                   example: "https://cdn.example.com/photo1.jpg"
 *                           productVideo:
 *                             type: array
 *                             items:
 *                               type: object
 *                               properties:
 *                                 url:
 *                                   type: string
 *                                   example: "https://cdn.example.com/video1.mp4"
 *                           productPricing:
 *                             type: array
 *                             items:
 *                               type: object
 *                               properties:
 *                                 price:
 *                                   type: number
 *                                   example: 49.99
 *                           _count:
 *                             type: object
 *                             properties:
 *                               likes:
 *                                 type: integer
 *                                 example: 15
 *                               love:
 *                                 type: integer
 *                                 example: 3
 *                           user:
 *                             type: object
 *                             properties:
 *                               id:
 *                                 type: string
 *                                 example: "user_123"
 *                               profile:
 *                                 type: object
 *                                 additionalProperties: true
 *       500:
 *         description: Internal server error
 */

/**
 * @swagger
 * /api/buyer/seller/active/listing/{sellerId}:
 *   get:
 *     summary: Get all active listings of a particular seller
 *     description: Fetches all approved and visible product listings for a specific seller, with pagination support.
 *     tags:
 *       - Buyer
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: sellerId
 *         required: true
 *         schema:
 *           type: string
 *         description: The ID of the seller
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           default: 1
 *         description: Page number for pagination
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           default: 10
 *         description: Number of products per page
 *     responses:
 *       200:
 *         description: Paginated list of seller's active listings
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 page:
 *                   type: integer
 *                 limit:
 *                   type: integer
 *                 total:
 *                   type: integer
 *                 totalPages:
 *                   type: integer
 *                 products:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       id:
 *                         type: string
 *                       name:
 *                         type: string
 *                       status:
 *                         type: string
 *                       isVisible:
 *                         type: boolean
 *                       createdAt:
 *                         type: string
 *                         format: date-time
 *                       productPhoto:
 *                         type: array
 *                         items:
 *                           type: object
 *                       productVideo:
 *                         type: array
 *                         items:
 *                           type: object
 *                       productPricing:
 *                         type: array
 *                         items:
 *                           type: object
 *       401:
 *         description: Unauthorized access
 *       500:
 *         description: Failed to fetch seller product listings
 */

/**
 * @swagger
 * /api/buyer/seller/active/listing/{sellerId}/{subCategoryId}:
 *   get:
 *     summary: Get seller listings by subcategory
 *     description: Fetch all active, approved listings for a particular seller under a specific subcategory with pagination.
 *     tags: [Buyer]
 *     parameters:
 *       - in: path
 *         name: sellerId
 *         required: true
 *         schema:
 *           type: string
 *         description: The ID of the seller
 *       - in: path
 *         name: subCategoryId
 *         required: true
 *         schema:
 *           type: string
 *         description: The ID of the subcategory
 *       - in: query
 *         name: page
 *         required: false
 *         schema:
 *           type: integer
 *           default: 1
 *         description: Page number for pagination
 *       - in: query
 *         name: limit
 *         required: false
 *         schema:
 *           type: integer
 *           default: 10
 *         description: Number of items per page
 *     responses:
 *       200:
 *         description: Paginated list of seller's listings in the specified subcategory
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 page:
 *                   type: integer
 *                   example: 1
 *                 limit:
 *                   type: integer
 *                   example: 10
 *                 total:
 *                   type: integer
 *                   example: 25
 *                 totalPages:
 *                   type: integer
 *                   example: 3
 *                 products:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       id:
 *                         type: string
 *                         format: uuid
 *                       name:
 *                         type: string
 *                         example: iPhone 14 Pro
 *                       status:
 *                         type: string
 *                         example: Approved
 *                       isVisible:
 *                         type: boolean
 *                         example: true
 *                       productPhoto:
 *                         type: array
 *                         items:
 *                           type: object
 *                           properties:
 *                             url:
 *                               type: string
 *                               example: https://example.com/photo.jpg
 *                       productVideo:
 *                         type: array
 *                         items:
 *                           type: object
 *                           properties:
 *                             url:
 *                               type: string
 *                               example: https://example.com/video.mp4
 *                       productPricing:
 *                         type: array
 *                         items:
 *                           type: object
 *                           properties:
 *                             price:
 *                               type: number
 *                               example: 500
 *                       _count:
 *                         type: object
 *                         properties:
 *                           likes:
 *                             type: integer
 *                             example: 15
 *                           love:
 *                             type: integer
 *                             example: 7
 *       500:
 *         description: Something went wrong while fetching listings
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Something went wrong, Failed to select listing with subcategory
 */


/**
 * @swagger
 * /api/buyer/all/notification:
 *   get:
 *     summary: Fetch all notifications for the logged-in buyer
 *     tags: [Buyer]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *         description: Page number for pagination
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *         description: Number of notifications per page
 *     responses:
 *       200:
 *         description: Notifications fetched successfully
 *       500:
 *         description: Failed to fetch notifications
 */

/**
 * @swagger
 * /api/buyer/all/read/notification:
 *   get:
 *     summary: Fetch all read notifications for the logged-in buyer
 *     tags: [Buyer]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Read notifications fetched successfully
 *       500:
 *         description: Failed to fetch notifications
 */

/**
 * @swagger
 * /api/buyer/all/unread/notification:
 *   get:
 *     summary: Fetch all unread notifications for the logged-in buyer
 *     tags: [Buyer]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Unread notifications fetched successfully
 *       500:
 *         description: Failed to fetch notifications
 */

/**
 * @swagger
 * /api/buyer/question:
 *   post:
 *     summary: Submit a question to admin or seller
 *     tags: [Buyer]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: receiverId
 *         schema:
 *           type: string
 *         required: true
 *         description: ID of the admin or seller receiving the question
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               question:
 *                 type: string
 *                 example: "What is the delivery time for this product?"
 *     responses:
 *       200:
 *         description: Question submitted successfully
 *       500:
 *         description: Failed to submit question
 */

/**
 * @swagger
 * /api/buyer/report/seller/{sellerId}:
 *   post:
 *     summary: Report a seller
 *     description: Allows an authenticated user to report a seller with a reason and description.
 *     tags:
 *       - Buyer
 *     security:
 *       - bearerAuth: []   # Requires JWT authentication
 *     parameters:
 *       - in: path
 *         name: sellerId
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *         description: The ID of the seller being reported
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - reason
 *               - description
 *             properties:
 *               reason:
 *                 type: string
 *                 example: "Fraudulent activity"
 *               description:
 *                 type: string
 *                 example: "Seller attempted to scam me during a transaction."
 *     responses:
 *       200:
 *         description: Report submitted successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Report submitted successfully
 *       401:
 *         description: Unauthorized, JWT token missing or invalid
 *       500:
 *         description: Failed to submit seller report
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Something went wrong, Failed to submit report
 */