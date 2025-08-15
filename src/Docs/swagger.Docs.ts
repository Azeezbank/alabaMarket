/**
 * @swagger
 * tags:
 *   name: Auth
 *   description: Authentication endpoints
 */

/**
 * @swagger
 * /api/auth/register:
 *   post:
 *     summary: Register a new user with email or phone
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *                 example: "user@example.com"
 *               phone:
 *                 type: string
 *                 example: "+1234567890"
 *               role:
 *                 type: string
 *                 example: "Buyer"
 *     responses:
 *       201:
 *         description: User registered and OTP sent
 *       400:
 *         description: Missing email/phone or already registered
 *       500:
 *         description: Server error
 */

/**
 * @swagger
 * /api/auth/verify:
 *   post:
 *     summary: Verify user account using OTP
 *     tags: [Auth]
 *     parameters:
 *       - in: query
 *         name: email
 *         schema:
 *           type: string
 *         required: false
 *       - in: query
 *         name: phone
 *         schema:
 *           type: string
 *         required: false
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               code:
 *                 type: string
 *                 example: "123456"
 *     responses:
 *       200:
 *         description: Account verified successfully
 *       400:
 *         description: Invalid or expired OTP
 *       404:
 *         description: User not found
 *       500:
 *         description: Server error
 */

/**
 * @swagger
 * /api/auth/login:
 *   post:
 *     summary: Request login OTP
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *               phone:
 *                 type: string
 *     responses:
 *       200:
 *         description: Login OTP sent
 *       400:
 *         description: Missing email/phone
 *       403:
 *         description: User not verified
 *       404:
 *         description: User not found
 *       500:
 *         description: Server error
 */

/**
 * @swagger
 * /api/auth/login/verify:
 *   post:
 *     summary: Verify login OTP and receive JWT token
 *     tags: [Auth]
 *     parameters:
 *       - in: query
 *         name: email
 *         schema:
 *           type: string
 *         required: false
 *       - in: query
 *         name: phone
 *         schema:
 *           type: string
 *         required: false
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               code:
 *                 type: string
 *                 example: "123456"
 *     responses:
 *       200:
 *         description: Login successful, returns JWT token
 *       400:
 *         description: Invalid or expired OTP
 *       404:
 *         description: User not found
 *       500:
 *         description: Server error
 */

/**
 * @swagger
 * tags:
 *   name: Admin
 *   description: Admin operations
 */

/**
 * @swagger
 * /api/admin/create/category:
 *   post:
 *     summary: Create a new product category
 *     tags: [Admin]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               category:
 *                 type: string
 *                 description: Name of the category
 *               file:
 *                 type: string
 *                 format: binary
 *                 description: Image file for the category
 *             required:
 *               - category
 *               - file
 *     responses:
 *       201:
 *         description: Category created successfully
 *         content:
 *           application/json:
 *             example:
 *               message: "Category created"
 *       400:
 *         description: No file uploaded
 *         content:
 *           application/json:
 *             example:
 *               message: "No file uploaded"
 *       500:
 *         description: Server error
 *         content:
 *           application/json:
 *             example:
 *               message: "Something went wrong, Failed to create category"
 */

/**
 * @swagger
 * components:
 *   securitySchemes:
 *     bearerAuth:
 *       type: http
 *       scheme: bearer
 *       bearerFormat: JWT
 */

/**
 * @swagger
 * tags:
 *   name: Admin
 *   description: Admin operations
 */

/**
 * @swagger
 * /api/admin/all/categories:
 *   get:
 *     summary: Get all product categories
 *     tags: [Admin]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of all categories
 *         content:
 *           application/json:
 *             example:
 *               - id: "1"
 *                 name: "Electronics"
 *                 image: "https://example.com/images/electronics.jpg"
 *               - id: "2"
 *                 name: "Clothing"
 *                 image: "https://example.com/images/clothing.jpg"
 *       500:
 *         description: Server error
 *         content:
 *           application/json:
 *             example:
 *               message: "Something went wrong"
 */


/**
 * @swagger
 * /api/admin/update-role-seller:
 *   put:
 *     summary: Update user role to Seller (Admin only)
 *     tags: [Admin]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *                 example: user@example.com
 *     responses:
 *       200:
 *         description: Role updated successfully
 *       400:
 *         description: Email missing
 *       404:
 *         description: User not found
 *       401:
 *         description: Unauthorized
 *       500:
 *         description: Internal server error
 */

//seller
/**
 * @swagger
 * /api/seller/create/shop:
 *   post:
 *     summary: Create a new shop
 *     tags:
 *       - Seller Shop
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               file:
 *                 type: string
 *                 format: binary
 *                 description: Shop logo image
 *               storeName:
 *                 type: string
 *               description:
 *                 type: string
 *               storeAddress:
 *                 type: string
 *               most_sell:
 *                 type: string
 *               phoneNumber:
 *                 type: string
 *     responses:
 *       201:
 *         description: Shop created successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                 data:
 *                   type: object
 *                   properties:
 *                     id:
 *                       type: string
 *                     storeName:
 *                       type: string
 *                     logo:
 *                       type: string
 *                     description:
 *                       type: string
 *                     storeAddress:
 *                       type: string
 *                     most_sell:
 *                       type: string
 *                     phoneNumber:
 *                       type: string
 *                     isActive:
 *                       type: boolean
 *                     createdAt:
 *                       type: string
 *                       format: date-time
 *                     userId:
 *                       type: string
 *                     user:
 *                       type: object
 *                       properties:
 *                         email:
 *                           type: string
 *       400:
 *         description: Bad request / No file uploaded
 *       500:
 *         description: Internal server error
 */

/**
 * @swagger
 * /api/seller/shop/details:
 *   get:
 *     summary: Get all shop details
 *     tags:
 *       - Seller Shop
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of shops
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   id:
 *                     type: string
 *                   storeName:
 *                     type: string
 *                   logo:
 *                     type: string
 *                   description:
 *                     type: string
 *                   storeAddress:
 *                     type: string
 *                   most_sell:
 *                     type: string
 *                   phoneNumber:
 *                     type: string
 *                   isActive:
 *                     type: boolean
 *                   createdAt:
 *                     type: string
 *                     format: date-time
 *                   userId:
 *                     type: string
 *                   user:
 *                     type: object
 *                     properties:
 *                       email:
 *                         type: string
 *       500:
 *         description: Failed to fetch shop details
 */

/**
 * @swagger
 * /api/seller/update/shop:
 *   put:
 *     summary: Update shop details
 *     tags:
 *       - Seller Shop
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               file:
 *                 type: string
 *                 format: binary
 *               storeName:
 *                 type: string
 *               logo:
 *                 type: string
 *               storeAddress:
 *                 type: string
 *               storeEmail:
 *                 type: string
 *               phoneNumber:
 *                 type: string
 *     responses:
 *       200:
 *         description: Shop details updated successfully
 *       400:
 *         description: No file uploaded
 *       500:
 *         description: Failed to update shop details
 */

/**
 * @swagger
 * /api/seller/shop/status/update:
 *   put:
 *     summary: Update shop active status
 *     tags:
 *       - Seller Shop
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               isActive:
 *                 type: boolean
 *     responses:
 *       200:
 *         description: Shop status updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                 shopStatus:
 *                   type: object
 *                   properties:
 *                     id:
 *                       type: string
 *                     storeName:
 *                       type: string
 *                     isActive:
 *                       type: boolean
 *       500:
 *         description: Failed to update shop status
 */

/**
 * @swagger
 * /api/seller/shop/delete:
 *   delete:
 *     summary: Delete a shop
 *     tags:
 *       - Seller Shop
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Shop deleted successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                 deletedShop:
 *                   type: object
 *                   properties:
 *                     id:
 *                       type: string
 *                     storeName:
 *                       type: string
 *                     userId:
 *                       type: string
 *                     isActive:
 *                       type: boolean
 *                     createdAt:
 *                       type: string
 *                       format: date-time
 *       500:
 *         description: Failed to delete shop
 */

/**
 * @swagger
 * components:
 *   securitySchemes:
 *     bearerAuth:
 *       type: http
 *       scheme: bearer
 *       bearerFormat: JWT
 */

// seller verification
/**
 * @swagger
 * /api/seller/seller/vefication:
 *   post:
 *     summary: Upload seller verification documents (ID card and passport)
 *     tags:
 *       - Seller Verification
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               idCard:
 *                 type: string
 *                 format: binary
 *                 description: Image of the ID card
 *               passport:
 *                 type: string
 *                 format: binary
 *                 description: Passport selfie
 *     responses:
 *       201:
 *         description: Files uploaded and saved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                 data:
 *                   type: object
 *                   properties:
 *                     id:
 *                       type: string
 *                     userId:
 *                       type: string
 *                     ID_card:
 *                       type: string
 *                     selfie:
 *                       type: string
 *                     createdAt:
 *                       type: string
 *                       format: date-time
 *       400:
 *         description: No file uploaded
 *       500:
 *         description: Failed to upload files
 */

/**
 * @swagger
 * /api/seller/update/seller/vefication:
 *   post:
 *     summary: Update seller verification ID card
 *     tags:
 *       - Seller Verification
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               idCard:
 *                 type: string
 *                 format: binary
 *                 description: New image of the ID card
 *     responses:
 *       200:
 *         description: File updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *       400:
 *         description: No file uploaded
 *       500:
 *         description: Failed to update file
 */

/**
 * @swagger
 * tags:
 *   name: Seller's Listing
 *   description: Endpoints related to seller product listings
 */

/**
 * @swagger
 * /api/seller/create/product/{shopId}:
 *   post:
 *     tags:
 *       - Seller's Listing
 *     summary: Create product details
 *     parameters:
 *       - name: shopId
 *         in: path
 *         required: true
 *         schema:
 *           type: string
 *           example: "shop123"
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               productImage:
 *                 type: string
 *                 format: binary
 *               productVideo:
 *                 type: string
 *                 format: binary
 *     responses:
 *       200:
 *         description: Product details inserted
 *       500:
 *         description: Something went wrong, failed to insert details
 */

/**
 * @swagger
 * /api/seller/update/product/pricing:
 *   put:
 *     tags:
 *       - Seller's Listing
 *     summary: Update product pricing
 *     parameters:
 *       - name: productId
 *         in: query
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               price:
 *                 type: number
 *               priceStatus:
 *                 type: string
 *               condition:
 *                 type: string
 *               description:
 *                 type: string
 *     responses:
 *       200:
 *         description: Pricing updated
 *       500:
 *         description: Failed to update pricing
 */

/**
 * @swagger
 * /api/seller/update/product/category:
 *   put:
 *     tags:
 *       - Seller's Listing
 *     summary: Update product category
 *     parameters:
 *       - name: productId
 *         in: query
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               mainCategory:
 *                 type: string
 *               subCategory:
 *                 type: string
 *     responses:
 *       200:
 *         description: Product category updated
 *       500:
 *         description: Failed to update product category
 */

/**
 * @swagger
 * /api/seller/update/product/promotion:
 *   put:
 *     tags:
 *       - Seller's Listing
 *     summary: Update product promotion
 *     parameters:
 *       - name: productId
 *         in: query
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               listingPromotion:
 *                 type: string
 *     responses:
 *       200:
 *         description: Promotion updated
 *       500:
 *         description: Failed to update promotion
 */

/**
 * @swagger
 * /api/seller/seller/listing:
 *   get:
 *     tags:
 *       - Seller's Listing
 *     summary: Fetch all seller listings
 *     parameters:
 *       - name: page
 *         in: query
 *         schema:
 *           type: integer
 *       - name: limit
 *         in: query
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: List of seller products
 *       500:
 *         description: Failed to fetch product listings
 */

/**
 * @swagger
 * /api/seller/update/listing/{productId}:
 *   put:
 *     tags:
 *       - Seller's Listing
 *     summary: Edit product or listing
 *     parameters:
 *       - name: productId
 *         in: path
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               price:
 *                 type: number
 *               priceStatus:
 *                 type: string
 *               condition:
 *                 type: string
 *               description:
 *                 type: string
 *               mainCategory:
 *                 type: string
 *               subCategory:
 *                 type: string
 *     responses:
 *       200:
 *         description: Product listing updated successfully
 *       403:
 *         description: Not authorized
 *       404:
 *         description: Product not found
 *       500:
 *         description: Failed to update product listing
 */

/**
 * @swagger
 * /api/seller/delete/listing/{productId}:
 *   delete:
 *     tags:
 *       - Seller's Listing
 *     summary: Delete product or listing
 *     parameters:
 *       - name: productId
 *         in: path
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Product listing deleted successfully
 *       403:
 *         description: Not authorized
 *       404:
 *         description: Product not found
 *       500:
 *         description: Failed to delete product listing
 */

/**
 * @swagger
 * /api/seller/listing/pause:
 *   put:
 *     tags:
 *       - Seller's Listing
 *     summary: Pause or unpause a product listing
 *     parameters:
 *       - name: productId
 *         in: query
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Product listing pause status updated
 *       403:
 *         description: Not authorized
 *       404:
 *         description: Product not found
 *       500:
 *         description: Failed to update product listing pause status
 */

/**
 * @swagger
 * /api/seller/active/listing:
 *   get:
 *     tags:
 *       - Seller's Listing
 *     summary: Select active listings
 *     responses:
 *       200:
 *         description: Active product listings
 *       500:
 *         description: Something went wrong
 */

/**
 * @swagger
 * /api/seller/boost/plans:
 *   get:
 *     tags:
 *       - Seller's Listing
 *     summary: Select all paid boost plans
 *     responses:
 *       200:
 *         description: List of boost plans
 *       500:
 *         description: Failed to select plan
 */

/**
 * @swagger
 * /api/seller/plan/price:
 *   get:
 *     tags:
 *       - Seller's Listing
 *     summary: Select price with respect to plan and period
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               plan:
 *                 type: string
 *               period:
 *                 type: string
 *                 enum: [weekly, monthly, annually]
 *     responses:
 *       200:
 *         description: Price selected successfully
 *       400:
 *         description: Invalid period
 *       500:
 *         description: Failed to select price
 */

/**
 * @swagger
 * /api/seller/boost/ads/{productId}:
 *   post:
 *     tags:
 *       - Seller's Listing
 *     summary: Boost a product ad
 *     parameters:
 *       - name: productId
 *         in: path
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               productName:
 *                 type: string
 *               plan:
 *                 type: string
 *               period:
 *                 type: string
 *               price:
 *                 type: number
 *     responses:
 *       200:
 *         description: Boost submitted for review
 *       500:
 *         description: Failed to submit boosting
 */