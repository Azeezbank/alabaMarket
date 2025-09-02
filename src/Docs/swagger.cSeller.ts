/**
 * @swagger
 * tags:
 *   name: Seller
 *   description: Endpoints related to seller product listings
 */


/**
 * @swagger
 * /api/seller/create/shop:
 *   post:
 *     summary: Create a new shop
 *     tags:
 *       - Seller
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
 *       - Seller
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
 *       - Seller
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
 *       - Seller
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
 *       - Seller
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
 *       - Seller
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
 *       - Seller
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
 *       - Seller
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
 *       - Seller
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
 *       - Seller
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
 *       - Seller
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
 *       - Seller
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
 * /api/seller/seller/listing:
 *   get:
 *     summary: Fetch seller's product listings detailes to populate product for publish
 *     description: Retrieve a paginated list of products for the authenticated seller, including photos, videos, pricing, and shop details.
 *     tags:
 *       - Seller
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: productId
 *         schema:
 *           type: string
 *         required: false
 *         description: Optional product ID to filter by a specific product
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           default: 1
 *         required: false
 *         description: Page number for pagination
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           default: 10
 *         required: false
 *         description: Number of items per page
 *     responses:
 *       200:
 *         description: Successfully fetched seller's product listings
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
 *                   description: Total number of products
 *                 totalPages:
 *                   type: integer
 *                   description: Total number of pages
 *                 products:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       id:
 *                         type: string
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
 *                       user:
 *                         type: object
 *                         properties:
 *                           createdAt:
 *                             type: string
 *                             format: date-time
 *                           sellerShop:
 *                             type: object
 *                             properties:
 *                               storeName:
 *                                 type: string
 *                           sellerVerification:
 *                             type: object
 *                             properties:
 *                               isVerified:
 *                                 type: boolean
 *       500:
 *         description: Failed to fetch seller's product listings
 */


/**
 * @swagger
 * /api/seller/update/listing/{productId}/{categoryId}/{subCategoryId}:
 *   put:
 *     summary: Edit an existing product or listing
 *     description: Update product details, category, sub-category, and pricing information. Only the product owner can edit their product.
 *     tags:
 *       - Seller
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: productId
 *         required: true
 *         schema:
 *           type: string
 *         description: The ID of the product to update
 *       - in: path
 *         name: categoryId
 *         required: true
 *         schema:
 *           type: string
 *         description: The ID of the category
 *       - in: path
 *         name: subCategoryId
 *         required: true
 *         schema:
 *           type: string
 *         description: The ID of the sub-category
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 example: "iPhone 14 Pro Max"
 *               condition:
 *                 type: string
 *                 example: "New"
 *               price:
 *                 type: number
 *                 example: 1200
 *               priceStatus:
 *                 type: string
 *                 enum: [Fixed, Negotiable]
 *                 example: "Negotiable"
 *               description:
 *                 type: string
 *                 example: "Latest iPhone model with 128GB storage"
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
 *                   type: object
 *                   description: Updated product details including relations
 *       403:
 *         description: Not authorized to edit this product
 *       404:
 *         description: Product not found
 *       500:
 *         description: Failed to update product listing
 */

/**
 * @swagger
 * /api/seller/listings/seller:
 *   get:
 *     summary: Fetch all seller's product listings
 *     description: Retrieve all product listings for the authenticated seller with pagination support.
 *     tags:
 *       - Seller
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: productId
 *         schema:
 *           type: string
 *         description: Optional product ID to filter by (not currently applied in query).
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           default: 1
 *         description: Page number for pagination.
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           default: 10
 *         description: Number of items per page.
 *     responses:
 *       200:
 *         description: A list of seller's product listings.
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
 *                         example: "prod_12345"
 *                       createdAt:
 *                         type: string
 *                         format: date-time
 *                         example: "2025-08-30T12:34:56.000Z"
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
 *                       user:
 *                         type: object
 *                         properties:
 *                           createdAt:
 *                             type: string
 *                             format: date-time
 *                           sellerShop:
 *                             type: object
 *                             properties:
 *                               storeName:
 *                                 type: string
 *                           sellerVerification:
 *                             type: object
 *                             properties:
 *                               isVerified:
 *                                 type: boolean
 *                                 example: true
 *       401:
 *         description: Unauthorized - missing or invalid token.
 *       500:
 *         description: Server error while fetching seller's product listings.
 */

/**
 * @swagger
 * /api/seller/delete/listing/{productId}:
 *   delete:
 *     tags:
 *       - Seller
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
 *       - Seller
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
 * /api/seller/toggle/listing/visibility/{productId}:
 *   patch:
 *     summary: Toggle product visibility
 *     description: >
 *       Seller can mark a product as visible or invisible depending on their subscription plan limits.  
 *       If the seller has no active subscription or it has expired, the system defaults to the "Free" plan.  
 *       Visibility is limited globally (maxVisibleProducts) and per category (maxVisiblePerCat).
 *     tags:
 *       - Seller
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: productId
 *         required: true
 *         schema:
 *           type: string
 *         description: ID of the product to toggle.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - makeVisible
 *             properties:
 *               makeVisible:
 *                 type: boolean
 *                 description: Set to true to make the product visible, false to hide it.
 *                 example: true
 *     responses:
 *       200:
 *         description: Successfully updated product visibility.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: string
 *                   example: "prod_12345"
 *                 isVisible:
 *                   type: boolean
 *                   example: true
 *                 visibleMarkedAt:
 *                   type: string
 *                   format: date-time
 *                   example: "2025-08-30T12:34:56.000Z"
 *       400:
 *         description: Bad request (e.g., limit reached, invalid body).
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "visible limit reached for your current subscription"
 *       403:
 *         description: Forbidden - seller is not the product owner.
 *       404:
 *         description: Product or seller not found.
 *       500:
 *         description: Server error.
 */


/**
 * @swagger
 * /api/seller/notifications:
 *   get:
 *     summary: Get notifications for the authenticated user
 *     tags:
 *       - Seller
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


/**
 * @swagger
 * /api/seller/plan/subscription/{planId}:
 *   post:
 *     summary: Subscribe a seller to a subscription plan
 *     description: >
 *       Initiates a subscription process for the authenticated seller by creating a payment session with a provider
 *       (e.g., Paystack, Flutterwave, Stripe). Saves the transaction in the database with status `Pending`.  
 *       The frontend should redirect the user to the payment page if status is 200.
 *     tags:
 *       - Seller
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: planId
 *         in: path
 *         required: true
 *         schema:
 *           type: string
 *         description: The subscription plan ID to subscribe to
 *     responses:
 *       200:
 *         description: Payment session successfully created
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 paymentSession:
 *                   type: object
 *                   properties:
 *                     reference:
 *                       type: string
 *                       example: txn_1693339339339
 *                     amount:
 *                       type: number
 *                       example: 5000.00
 *                     currency:
 *                       type: string
 *                       example: NGN
 *                     callbackUrl:
 *                       type: string
 *                       example: https://yourdomain.com/api/payment/webhook
 *       400:
 *         description: Missing sellerId or planId in request
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: sellerId and planId required
 *       404:
 *         description: Subscription plan not found
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: plan not found
 *       500:
 *         description: Internal server error when creating transaction or initiating payment
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Something went wrong, failed to initiate transaction
 */