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
 *     summary: Create a new product with images and videos
 *     description: |
 *       Allows an authenticated seller to create a product in a shop. 
 *       Supports uploading one or multiple product images and/or videos.
 *     tags:
 *       - Seller
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: shopId
 *         schema:
 *           type: string
 *         required: true
 *         description: The ID of the shop where the product will be created.
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 description: The product name.
 *               productImage:
 *                 type: array
 *                 items:
 *                   type: string
 *                   format: binary
 *                 description: One or more product images.
 *               productVideo:
 *                 type: array
 *                 items:
 *                   type: string
 *                   format: binary
 *                 description: One or more product videos.
 *     responses:
 *       200:
 *         description: Product created successfully.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: product details inserted
 *                 newProduct:
 *                   type: object
 *                   description: The newly created product with associated images and videos.
 *       400:
 *         description: Invalid input or missing files.
 *       401:
 *         description: Unauthorized. Missing or invalid JWT token.
 *       500:
 *         description: Server error.
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
 * /api/seller/all/seller/listing:
 *   get:
 *     summary: Fetch all seller's product listings
 *     description: Retrieves all product listings created by the authenticated seller, with pagination.
 *     tags:
 *       - Seller
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
 *         description: Number of items per page
 *     responses:
 *       200:
 *         description: Successfully fetched seller's listings
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
 *                   example: 42
 *                 totalPages:
 *                   type: integer
 *                   example: 5
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
 *                       productPhoto:
 *                         type: array
 *                         items:
 *                           type: object
 *                           properties:
 *                             url:
 *                               type: string
 *                               example: "https://example.com/photo.jpg"
 *                       productVideo:
 *                         type: array
 *                         items:
 *                           type: object
 *                           properties:
 *                             url:
 *                               type: string
 *                               example: "https://example.com/video.mp4"
 *                       productPricing:
 *                         type: object
 *                         properties:
 *                           price:
 *                             type: number
 *                             example: 199.99
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
 *                                 example: "Alaba Market Store"
 *                           sellerVerification:
 *                             type: object
 *                             properties:
 *                               isVerified:
 *                                 type: boolean
 *                                 example: true
 *       500:
 *         description: Failed to fetch seller's product listings
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Failed to fetch seller's product listings
 */


/**
 * @swagger
 * /api/seller/delete/listing/{productId}:
 *   delete:
 *     summary: Delete a product listing
 *     description: Allows the authenticated seller to delete their own product listing.
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
 *           format: uuid
 *         description: The ID of the product to be deleted
 *     responses:
 *       200:
 *         description: Product listing deleted successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Product listing deleted successfully
 *       403:
 *         description: Not authorized to delete this product
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Not authorized to delete this product
 *       404:
 *         description: Product not found
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Product not found
 *       500:
 *         description: Failed to delete product listing
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Failed to delete product listing
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
 * /api/seller/listing/pause/{productId}:
 *   patch:
 *     summary: Pause or unpause a product listing
 *     description: Allows the authenticated seller to toggle the pause status of their product listing.
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
 *           format: uuid
 *         description: The ID of the product to pause or unpause
 *     responses:
 *       200:
 *         description: Product listing pause status updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Product listing pause status updated
 *                 updatedProduct:
 *                   type: object
 *                   description: The updated product with new pause status
 *       403:
 *         description: Not authorized to pause this product
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Not authorized to pause this product
 *       404:
 *         description: Product not found
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Product not found
 *       500:
 *         description: Failed to update product listing pause status
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Failed to update product listing pause status
 */

/**
 * @swagger
 * /api/seller/toggle/listing/visibility/{productId}:
 *   put:
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
 * /api/seller/plan/subscribe/{planId}:
 *   post:
 *     summary: Initiate a payment for a subscription plan
 *     description: |
 *       This endpoint initializes a payment for a user based on the selected subscription plan.  
 *       It supports both **Paystack** and **Flutterwave** as providers.  
 *       - If Paystack is active → a transaction is initialized with Paystack.  
 *       - If Flutterwave is active → a transaction is initialized with Flutterwave.  
 *       The system stores a **Pending transaction** in the database with a unique reference.
 *     tags:
 *       - Seller
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: planId
 *         schema:
 *           type: string
 *         required: true
 *         description: ID of the subscription plan to pay for
 *     responses:
 *       200:
 *         description: Payment initialized successfully. Returns response from the active provider.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               example:
 *                 status: true
 *                 message: Authorization URL created
 *                 data:
 *                   authorization_url: "https://checkout.paystack.com/..."
 *                   access_code: "ACCESS_CODE"
 *                   reference: "REF_1693847393_xxxx"
 *       400:
 *         description: Missing required fields or invalid provider
 *         content:
 *           application/json:
 *             example:
 *               error: "No active payment provider"
 *       404:
 *         description: User or plan not found
 *         content:
 *           application/json:
 *             example:
 *               message: "No user found to carry out the transaction"
 *       500:
 *         description: Server error
 *         content:
 *           application/json:
 *             example:
 *               error: "Failed to initiate payment"
 */


/**
 * @swagger
 * /api/seller/check/user/role/status:
 *   get:
 *     summary: Check if a user is a seller
 *     description: Verifies whether the authenticated user has the role of "Seller".
 *     tags:
 *       - Seller
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: User is a seller
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 profile:
 *                   type: object
 *                   properties:
 *                     role:
 *                       type: string
 *                       example: Seller
 *       400:
 *         description: User is not a seller
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: User is not a seller, proceed to become a seller
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Something went wrong, failed to check user role status
 */


/**
 * @swagger
 * /api/seller/payment/status:
 *   get:
 *     summary: Get all transactions for the logged-in user
 *     description: Returns a list of transactions belonging to the authenticated user, ordered by most recent first.
 *     tags:
 *       - Seller
 *     security:
 *       - bearerAuth: []   # Requires JWT token
 *     responses:
 *       200:
 *         description: List of user transactions retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   id:
 *                     type: string
 *                     example: "txn_12345"
 *                   reference:
 *                     type: string
 *                     example: "REF_1693928374923_ab12cd34"
 *                   amount:
 *                     type: number
 *                     example: 5000
 *                   status:
 *                     type: string
 *                     example: "Pending"
 *                   userId:
 *                     type: string
 *                     example: "user_123"
 *                   subscriptionPlanId:
 *                     type: string
 *                     example: "plan_456"
 *                   createdAt:
 *                     type: string
 *                     format: date-time
 *                     example: "2025-09-05T12:30:00.000Z"
 *                   updatedAt:
 *                     type: string
 *                     format: date-time
 *                     example: "2025-09-05T12:35:00.000Z"
 *       401:
 *         description: Unauthorized (no or invalid token)
 *       500:
 *         description: Failed to fetch transactions
 */


/**
 * @swagger
 * /api/seller/subscription/plans:
 *   get:
 *     summary: Fetch all subscription plans
 *     description: Retrieves all available subscription plans for sellers, including category visibility limits.
 *     tags:
 *       - Seller
 *     security:
 *       - bearerAuth: []   # JWT authentication required
 *     responses:
 *       200:
 *         description: List of subscription plans fetched successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   id:
 *                     type: string
 *                     format: uuid
 *                   name:
 *                     type: string
 *                   price:
 *                     type: number
 *                   duration:
 *                     type: string
 *                     example: monthly
 *                   maxVisibleProducts:
 *                     type: integer
 *                   placement:
 *                     type: string
 *                   maxVisiblePerCat:
 *                     type: array
 *                     items:
 *                       type: object
 *                       properties:
 *                         id:
 *                           type: string
 *                           format: uuid
 *                         maxVisible:
 *                           type: integer
 *       500:
 *         description: Failed to fetch subscription plans due to a server error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: something went wrong, failed to select subscription plan
 */

/**
 * @swagger
 * /api/seller/update/listing/photo/{imageId}:
 *   put:
 *     summary: Edit a product image
 *     description: Updates the URL of an existing product image. The new image file must be uploaded as multipart/form-data.
 *     tags:
 *       - Seller
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: imageId
 *         required: true
 *         schema:
 *           type: string
 *         description: ID of the product image to update
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
 *                 description: New image file for the product
 *     responses:
 *       200:
 *         description: Product image updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Product image updated successfully
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
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Something went wrong, failed to update product image
 */

/**
 * @swagger
 * /api/seller/update/listing/video/{videoId}:
 *   put:
 *     summary: Edit a product video
 *     description: Updates the URL of an existing product video. The new video file must be uploaded as multipart/form-data.
 *     tags:
 *       - Seller
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: videoId
 *         required: true
 *         schema:
 *           type: string
 *         description: ID of the product video to update
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
 *                 description: New video file for the product
 *     responses:
 *       200:
 *         description: Product video updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Product video updated successfully
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
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Something went wrong, failed to update product video
 */

/**
 * @swagger
 * /api/seller/delete/product/image/{imageId}:
 *   delete:
 *     summary: Delete a product image
 *     description: Deletes a specific product image by its ID.
 *     tags:
 *       - Seller
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: imageId
 *         required: true
 *         schema:
 *           type: string
 *         description: The ID of the product image to delete.
 *     responses:
 *       200:
 *         description: Product image deleted successfully
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Product image not found
 *       500:
 *         description: Server error
 */

/**
 * @swagger
 * /api/seller/delete/product/video/{videoId}:
 *   delete:
 *     summary: Delete a product video
 *     description: Deletes a specific product video by its ID.
 *     tags:
 *       - Seller
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: videoId
 *         required: true
 *         schema:
 *           type: string
 *         description: The ID of the product video to delete.
 *     responses:
 *       200:
 *         description: Product video deleted successfully
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Product video not found
 *       500:
 *         description: Server error
 */


/**
 * @swagger
 * /api/seller/product/images/{productId}:
 *   get:
 *     summary: Fetch product images
 *     description: Retrieve all images belonging to a specific product by its ID.
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
 *         description: The ID of the product to fetch images for.
 *     responses:
 *       200:
 *         description: Successfully fetched product images
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   id:
 *                     type: string
 *                   url:
 *                     type: string
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Product not found
 *       500:
 *         description: Server error
 */

/**
 * @swagger
 * /api/seller/product/videos/{productId}:
 *   get:
 *     summary: Fetch product videos
 *     description: Retrieve all videos belonging to a specific product by its ID.
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
 *         description: The ID of the product to fetch videos for.
 *     responses:
 *       200:
 *         description: Successfully fetched product videos
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   id:
 *                     type: string
 *                   url:
 *                     type: string
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Product not found
 *       500:
 *         description: Server error
 */

/**
 * @swagger
 * /api/seller/add/product/photo/{productId}:
 *   post:
 *     summary: Add more images to a product
 *     description: Upload one or multiple product images and save them to the database.
 *     tags:
 *       - Seller
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: productId
 *         schema:
 *           type: string
 *         required: true
 *         description: ID of the product
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               productImage:
 *                 type: array
 *                 items:
 *                   type: string
 *                   format: binary
 *                 description: Upload one or more images
 *     responses:
 *       200:
 *         description: Listing image added successfully
 *       500:
 *         description: Something went wrong, failed to insert listing photo
 */

/**
 * @swagger
 * /api/seller/add/product/video/{productId}:
 *   post:
 *     summary: Add more videos to a product
 *     description: Upload one or multiple product videos (reels) and save them to the database.
 *     tags:
 *       - Seller
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: productId
 *         schema:
 *           type: string
 *         required: true
 *         description: ID of the product
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               productVideo:
 *                 type: array
 *                 items:
 *                   type: string
 *                   format: binary
 *                 description: Upload one or more videos
 *     responses:
 *       200:
 *         description: Listing video reel added successfully
 *       500:
 *         description: Something went wrong, failed to insert listing video
 */


/**
 * @swagger
 * /api/seller/banner/packages:
 *   get:
 *     summary: Get all active banner packages
 *     description: Fetch all banner packages with status 'Active', ordered by creation date (newest first).
 *     tags:
 *       - Seller
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of active banner packages
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   id:
 *                     type: string
 *                     example: "pkg_12345"
 *                   name:
 *                     type: string
 *                     example: "Homepage Top Banner"
 *                   price:
 *                     type: number
 *                     example: 49.99
 *                   duration:
 *                     type: integer
 *                     example: 30
 *                   status:
 *                     type: string
 *                     example: "Active"
 *                   createdAt:
 *                     type: string
 *                     format: date-time
 *                     example: "2025-09-23T19:15:00.000Z"
 *       500:
 *         description: Something went wrong while fetching banner packages
 */


/**
 * @swagger
 * /api/seller/banner/payment/{planId}:
 *   post:
 *     summary: Initiate payment for a banner plan
 *     description: Creates a pending transaction and initializes payment with the active provider (Paystack or Flutterwave) for the specified banner plan.
 *     tags:
 *       - Seller
 *     parameters:
 *       - in: path
 *         name: planId
 *         required: true
 *         schema:
 *           type: string
 *         description: The ID of the banner plan to pay for
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Payment initialized successfully, provider response returned
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *       400:
 *         description: Bad request (missing parameters, no active provider, or invalid provider)
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *       404:
 *         description: User or plan not found
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 */