/**
 * @swagger
 * tags:
 *   name: Seller's Listing
 *   description: Endpoints related to seller product listings
 */


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
 * /api/seller/create/product/{shopId}:
 *   post:
 *     tags:
 *       - Seller's Listing
 *     security:
 *       - bearerAuth: []
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
 *     security:
 *       - bearerAuth: []
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
 * /api/seller/listing/category:
 *   get:
 *     summary: Fetch all product categories
 *     description: Retrieve all product categories with their IDs and names.
 *     tags: 
 *       - Seller's Listing
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Successfully retrieved categories
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   id:
 *                     type: string
 *                     example: "cat_12345"
 *                   name:
 *                     type: string
 *                     example: "Electronics"
 *       401:
 *         description: Unauthorized, authentication required
 *       500:
 *         description: Server error, failed to select product category
 */

/**
 * @swagger
 * /api/seller/listing/subcategory/{categoryId}:
 *   get:
 *     summary: Fetch subcategories of a category
 *     description: Retrieve subcategories belonging to a given category ID.
 *     tags: 
 *       - Seller's Listing
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: categoryId
 *         required: true
 *         schema:
 *           type: string
 *         description: The ID of the category
 *     responses:
 *       200:
 *         description: Successfully retrieved subcategories
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   id:
 *                     type: string
 *                     example: "subcat_67890"
 *                   name:
 *                     type: string
 *                     example: "Smartphones"
 *       400:
 *         description: Bad request, invalid category ID
 *       401:
 *         description: Unauthorized, authentication required
 *       500:
 *         description: Server error, failed to select sub product category
 */

/**
 * @swagger
 * /api/seller/update/product/category/{categoryId}/{subCategoryId}:
 *   put:
 *     summary: Update product category and subcategory
 *     description: Update an existing product's category and subcategory by IDs.
 *     tags: 
 *       - Seller's Listing
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: categoryId
 *         required: true
 *         description: ID of the category
 *         schema:
 *           type: string
 *       - in: path
 *         name: subCategoryId
 *         required: true
 *         description: ID of the subcategory
 *         schema:
 *           type: string
 *       - in: query
 *         name: productId
 *         required: true
 *         description: ID of the product to update
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Product category updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Product category updated successfully
 *       400:
 *         description: Invalid input or missing parameters
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Invalid request parameters
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Category, Subcategory, or Product not found
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Product not found
 *       500:
 *         description: Server error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Something went wrong, Failed to update product category
 */

/**
 * @swagger
 * /api/seller/update/product/promotion:
 *   put:
 *     tags:
 *       - Seller's Listing
 *     security:
 *       - bearerAuth: []
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
 *     security:
 *       - bearerAuth: []
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
 * /api/seller/update/listing/{productId}/{categoryId}/subCategoryId:
 *   put:
 *     summary: Edit an existing product/listing
 *     description: Update details of a seller's product listing. Only the owner of the product can edit it.
 *     tags: 
 *       - Seller's Listing
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: productId
 *         required: true
 *         description: The ID of the product to update
 *         schema:
 *           type: string
 *       - in: query
 *         name: categoryId
 *         required: false
 *         description: ID of the main category
 *         schema:
 *           type: string
 *       - in: query
 *         name: subCategoryId
 *         required: false
 *         description: ID of the sub-category
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
 *                 example: "iPhone 13 Pro Max"
 *               condition:
 *                 type: string
 *                 example: "New"
 *               price:
 *                 type: number
 *                 example: 1500
 *               priceStatus:
 *                 type: string
 *                 enum: [Fixed, Negotiable]
 *                 example: "Negotiable"
 *               description:
 *                 type: string
 *                 example: "A brand new iPhone 13 Pro Max with warranty."
 *               categoryName:
 *                 type: string
 *                 example: "Electronics"
 *               subCategoryName:
 *                 type: string
 *                 example: "Smartphones"
 *     responses:
 *       200:
 *         description: Product listing updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Product listing updated successfully"
 *                 updatedProduct:
 *                   $ref: '#/components/schemas/Product'
 *       403:
 *         description: Not authorized to edit this product
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
 *     security:
 *       - bearerAuth: []
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
 *     security:
 *       - bearerAuth: []
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
 * /api/seller/boost/plans:
 *   get:
 *     tags:
 *       - Seller's Listing
 *     security:
 *       - bearerAuth: []
 *     summary: Select all paid boost plans
 *     responses:
 *       200:
 *         description: List of boost plans
 *       500:
 *         description: Failed to select plan
 */


/**
 * @swagger
 * /api/seller/boost/details:
 *   post:
 *     summary: Get boost plan details
 *     tags:
 *       - Seller's Listing
 *     security:
 *       - bearerAuth: []
 *     description: Retrieve details of a specific boost plan by providing the plan name in the request body.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               plan:
 *                 type: string
 *                 example: Gold
 *     responses:
 *       200:
 *         description: Boost plan details retrieved successfully
 *       500:
 *         description: Failed to select plan details
 */

/**
 * @swagger
 * /api/seller/boost/ads/{productId}:
 *   post:
 *     tags:
 *       - Seller's Listing
 *     summary: Boost a product ad
 *     security:
 *       - bearerAuth: []
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

/**
 * @swagger
 * /api/seller/boost/ads:
 *   get:
 *     summary: Fetch all boost ads for the authenticated user
 *     tags:
 *       - Seller's Listing
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Successfully retrieved boost ads
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   id:
 *                     type: string
 *                     example: "boost_123"
 *                   productId:
 *                     type: string
 *                     example: "prod_456"
 *                   productName:
 *                     type: string
 *                     example: "Wireless Headphones"
 *                   plan:
 *                     type: string
 *                     example: "Premium"
 *                   period:
 *                     type: string
 *                     example: "30 days"
 *                   price:
 *                     type: number
 *                     example: 49.99
 *       401:
 *         description: Unauthorized - Missing or invalid token
 *       500:
 *         description: Failed to fetch boost ads
 */

/**
 * @swagger
 * /api/seller/notifications:
 *   get:
 *     summary: Get notifications for the authenticated user
 *     tags:
 *       - Notifications
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           example: 1
 *         description: Page number for pagination (default is 1)
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           example: 10
 *         description: Number of notifications per page (default is 10)
 *     responses:
 *       200:
 *         description: Successfully retrieved notifications
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
 *                 notifications:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       id:
 *                         type: string
 *                         example: "notif_123"
 *                       message:
 *                         type: string
 *                         example: "You have a new message"
 *                       type:
 *                         type: string
 *                         example: "message"
 *                       isRead:
 *                         type: boolean
 *                         example: false
 *                       createdAt:
 *                         type: string
 *                         format: date-time
 *                         example: "2025-08-15T12:34:56.000Z"
 *                       user:
 *                         type: object
 *                         properties:
 *                           id:
 *                             type: string
 *                             example: "user_456"
 *                           profile:
 *                             type: object
 *                             properties:
 *                               name:
 *                                 type: string
 *                                 example: "John Doe"
 *       401:
 *         description: Unauthorized - Missing or invalid token
 *       500:
 *         description: Failed to fetch notifications
 */
