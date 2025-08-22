/**
 * @swagger
 * tags:
 *   name: Admin
 *   description: Admin management and operations
 */


/**
 * @swagger
 * /api/admin/all/free/listing:
 *   get:
 *     summary: Fetch free listings
 *     description: Get all free listings with pagination. Each listing includes product and user profile details.
 *     tags: [Admin]
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
 *         description: Number of records per page
 *     responses:
 *       200:
 *         description: List of free listings
 *       500:
 *         description: Failed to fetch free listings
 */

/**
 * @swagger
 * /api/admin/reject/listing/{productId}:
 *   put:
 *     summary: Reject a product listing
 *     description: Reject a free product listing and notify the product owner.
 *     tags: [Admin]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: productId
 *         required: true
 *         schema:
 *           type: string
 *         description: ID of the product to reject
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               reason:
 *                 type: string
 *                 example: "Product violates listing policy"
 *     responses:
 *       200:
 *         description: Listing rejected and notification sent
 *       500:
 *         description: Failed to reject listing
 */

/**
 * @swagger
 * /api/admin/boost/campaign/review:
 *   get:
 *     summary: Fetch boost campaign reviews
 *     description: Retrieve all boost campaigns with pagination and associated user details.
 *     tags: [Admin]
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
 *         description: Number of records per page
 *     responses:
 *       200:
 *         description: List of boost campaigns
 *       500:
 *         description: Failed to fetch boost campaigns
 */

/**
 * @swagger
 * /api/admin/update/boosted/listing/{campaignId}:
 *   put:
 *     summary: Approve or update a boost campaign
 *     description: Approve a campaign boost, set start/end dates, update status, and notify the seller.
 *     tags: [Admin]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: campaignId
 *         required: true
 *         schema:
 *           type: string
 *         description: ID of the boost campaign
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               status:
 *                 type: string
 *                 example: "Approved"
 *               duration:
 *                 type: string
 *                 example: "7 days"
 *     responses:
 *       200:
 *         description: Boost campaign approved and seller notified
 *       500:
 *         description: Failed to approve/update boost campaign
 */

/**
 * @swagger
 * /api/admin/pause/suspend/boost/{campaignId}:
 *   put:
 *     summary: Pause or suspend a boost campaign
 *     description: Update the status of a boost campaign (e.g., paused/suspended), log the action, and notify the seller.
 *     tags: [Admin]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: campaignId
 *         required: true
 *         schema:
 *           type: string
 *         description: ID of the boost campaign
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               status:
 *                 type: string
 *                 example: "Paused"
 *               reason:
 *                 type: string
 *                 example: "Violation of campaign rules"
 *     responses:
 *       200:
 *         description: Boost campaign status updated and seller notified
 *       500:
 *         description: Failed to update boost campaign status
 */


/**
 * @swagger
 * /api/admin/edit/info:
 *   put:
 *     summary: Update admin profile information
 *     description: Update the logged-in admin's profile details including name, email, phone, role, and profile picture.
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
 *               name:
 *                 type: string
 *                 example: "John Doe"
 *               email:
 *                 type: string
 *                 example: "john@example.com"
 *               phoneNumber:
 *                 type: string
 *                 example: "+1234567890"
 *               role:
 *                 type: string
 *                 example: "SuperAdmin"
 *               file:
 *                 type: string
 *                 format: binary
 *                 description: Profile picture to upload
 *     responses:
 *       200:
 *         description: Profile updated successfully
 *       400:
 *         description: No file uploaded or invalid request
 *       500:
 *         description: Failed to update admin profile
 */

/**
 * @swagger
 * /api/admin/change/password:
 *   put:
 *     summary: Change admin password
 *     description: Allows an admin to change their password after verifying the current one.
 *     tags: [Admin]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - currentPassword
 *               - newPassword
 *               - confirmedPassword
 *             properties:
 *               currentPassword:
 *                 type: string
 *                 example: "OldPass123!"
 *               newPassword:
 *                 type: string
 *                 example: "NewPass456!"
 *               confirmedPassword:
 *                 type: string
 *                 example: "NewPass456!"
 *     responses:
 *       200:
 *         description: Password updated successfully
 *       400:
 *         description: Password mismatch or incorrect current password
 *       404:
 *         description: User not found
 *       500:
 *         description: Failed to change password
 */

/**
 * @swagger
 * /api/admin/category:
 *   post:
 *     summary: Create a new product category
 *     description: Allows an admin to create a product category with image and status.
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
 *               categoryName:
 *                 type: string
 *                 example: "Electronics"
 *               status:
 *                 type: boolean
 *                 example: true
 *               file:
 *                 type: string
 *                 format: binary
 *                 description: Category image
 *     responses:
 *       201:
 *         description: Category created successfully
 *       400:
 *         description: No file uploaded
 *       500:
 *         description: Failed to create category
 */

/**
 * @swagger
 * /api/admin/category/{categoryId}:
 *   put:
 *     summary: Update an existing product category
 *     description: Allows an admin to update a product category’s name, image, and status.
 *     tags: [Admin]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: categoryId
 *         required: true
 *         schema:
 *           type: string
 *         description: Category ID
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               categoryName:
 *                 type: string
 *                 example: "Updated Electronics"
 *               status:
 *                 type: boolean
 *                 example: false
 *               file:
 *                 type: string
 *                 format: binary
 *                 description: Updated category image
 *     responses:
 *       200:
 *         description: Category updated successfully
 *       400:
 *         description: No file uploaded
 *       500:
 *         description: Failed to update category
 */

/**
 * @swagger
 * /api/admin/categories:
 *   get:
 *     summary: Fetch all product categories
 *     description: Retrieve all categories with counts of related subcategories and products.
 *     tags: [Admin]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of categories
 *       500:
 *         description: Failed to fetch categories
 */

/**
 * @swagger
 * /api/admin/subcategories:
 *   get:
 *     summary: Fetch all subcategories
 *     description: Retrieve all subcategories with their parent category name and product counts.
 *     tags: [Admin]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of subcategories
 *       500:
 *         description: Failed to fetch subcategories
 */

/**
 * @swagger
 * /api/admin/subcategory:
 *   post:
 *     summary: Create a new subcategory
 *     description: Allows an admin to create a subcategory under a parent category.
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
 *               parentCategory:
 *                 type: string
 *                 example: "Electronics"
 *               name:
 *                 type: string
 *                 example: "Smartphones"
 *     responses:
 *       200:
 *         description: Subcategory created successfully
 *       400:
 *         description: No category id found
 *       500:
 *         description: Failed to create subcategory
 */


/**
 * @swagger
 * /api/admin/banners:
 *   get:
 *     summary: Fetch all promotional banners
 *     description: Retrieve all promotional banners with details such as title, placement, uploader, start and end date.
 *     tags: [Admin]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of promotional banners
 *       500:
 *         description: Failed to fetch banners
 */

/**
 * @swagger
 * /api/admin/banner:
 *   post:
 *     summary: Upload a new promotional banner
 *     description: Allows an admin to create a promotional banner with image, title, page, placement, and date range.
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
 *               title:
 *                 type: string
 *                 example: "Summer Sale"
 *               page:
 *                 type: string
 *                 example: "Homepage"
 *               placement:
 *                 type: string
 *                 example: "Top Banner"
 *               startDate:
 *                 type: string
 *                 format: date
 *                 example: "2025-08-01"
 *               endDate:
 *                 type: string
 *                 format: date
 *                 example: "2025-08-31"
 *               status:
 *                 type: boolean
 *                 example: true
 *               file:
 *                 type: string
 *                 format: binary
 *                 description: Banner image
 *     responses:
 *       201:
 *         description: Banner created successfully
 *       400:
 *         description: No file uploaded
 *       404:
 *         description: No uploader found
 *       500:
 *         description: Failed to create banner
 */

/**
 * @swagger
 * /api/admin/banner/{bannerId}:
 *   put:
 *     summary: Update an existing promotional banner
 *     description: Allows an admin to update a banner's details and image.
 *     tags: [Admin]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: bannerId
 *         required: true
 *         schema:
 *           type: string
 *         description: Banner ID
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               title:
 *                 type: string
 *                 example: "Updated Sale"
 *               page:
 *                 type: string
 *                 example: "Homepage"
 *               placement:
 *                 type: string
 *                 example: "Sidebar"
 *               startDate:
 *                 type: string
 *                 format: date
 *                 example: "2025-09-01"
 *               endDate:
 *                 type: string
 *                 format: date
 *                 example: "2025-09-30"
 *               status:
 *                 type: boolean
 *                 example: false
 *               file:
 *                 type: string
 *                 format: binary
 *                 description: Updated banner image
 *     responses:
 *       200:
 *         description: Banner updated successfully
 *       400:
 *         description: No file uploaded
 *       404:
 *         description: No uploader found
 *       500:
 *         description: Failed to update banner
 */

/**
 * @swagger
 * /api/admin/banner/{bannerId}:
 *   delete:
 *     summary: Delete a promotional banner
 *     description: Permanently remove a promotional banner by ID.
 *     tags: [Admin]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: bannerId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Banner deleted successfully
 *       500:
 *         description: Failed to delete banner
 */

/**
 * @swagger
 * /api/admin/packages:
 *   get:
 *     summary: Fetch all boost packages
 *     description: Retrieve all boost packages with their details.
 *     tags: [Admin]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           example: 1
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           example: 10
 *     responses:
 *       200:
 *         description: List of boost packages
 *       500:
 *         description: Failed to fetch boost packages
 */

/**
 * @swagger
 * /api/admin/package:
 *   post:
 *     summary: Add a new boost package
 *     description: Allows an admin to add a boost package with multiple duration-price options.
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
 *               plan:
 *                 type: string
 *                 example: "Premium Boost"
 *               type:
 *                 type: string
 *                 example: "Listing"
 *               placement:
 *                 type: string
 *                 example: "Homepage"
 *               duration1:
 *                 type: integer
 *                 example: 7
 *               price1:
 *                 type: number
 *                 example: 9.99
 *               duration2:
 *                 type: integer
 *                 example: 14
 *               price2:
 *                 type: number
 *                 example: 17.99
 *               status:
 *                 type: boolean
 *                 example: true
 *     responses:
 *       200:
 *         description: Boost package added successfully
 *       400:
 *         description: At least one duration & price is required
 *       500:
 *         description: Failed to add package
 */

/**
 * @swagger
 * /api/admin/package/{packageId}:
 *   put:
 *     summary: Edit an existing boost package
 *     description: Allows an admin to update a boost package details and pricing options.
 *     tags: [Admin]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: packageId
 *         required: true
 *         schema:
 *           type: string
 *         description: Package ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               plan:
 *                 type: string
 *                 example: "Updated Premium Boost"
 *               type:
 *                 type: string
 *                 example: "Banner"
 *               placement:
 *                 type: string
 *                 example: "Sidebar"
 *               duration1:
 *                 type: integer
 *                 example: 30
 *               price1:
 *                 type: number
 *                 example: 29.99
 *     responses:
 *       200:
 *         description: Boost package updated successfully
 *       400:
 *         description: At least one duration & price is required
 *       500:
 *         description: Failed to update package
 */

/**
 * @swagger
 * /api/admin/package/{packageId}:
 *   delete:
 *     summary: Delete a boost package
 *     description: Permanently remove a boost package by ID.
 *     tags: [Admin]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: packageId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Boost package deleted successfully
 *       500:
 *         description: Failed to delete package
 */

/**
 * @swagger
 * /api/admin/seller/verification:
 *   get:
 *     summary: Fetch all seller verification requests
 *     tags: [admin]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Successfully fetched seller verification requests
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   ID_card:
 *                     type: string
 *                   createdAt:
 *                     type: string
 *                     format: date-time
 *                   status:
 *                     type: string
 *                   user:
 *                     type: object
 *                     properties:
 *                       profile:
 *                         type: object
 *                         properties:
 *                           name:
 *                             type: string
 *                       sellerShop:
 *                         type: object
 *                         properties:
 *                           storeName:
 *                             type: string
 *                           logo:
 *                             type: string
 *       500:
 *         description: Something went wrong while fetching seller verification
 */

/**
 * @swagger
 * /api/admin/approve/seller/verification/{verificationId}:
 *   put:
 *     summary: Approve a seller verification
 *     tags: [admin]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: verificationId
 *         required: true
 *         schema:
 *           type: string
 *         description: The ID of the seller verification record
 *     responses:
 *       200:
 *         description: Seller verified successfully
 *       500:
 *         description: Something went wrong, failed to verify seller
 */

/**
 * @swagger
 * /api/admin/reject/seller/verification/{verificationId}:
 *   put:
 *     summary: Reject a seller verification
 *     tags: [admin]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: verificationId
 *         required: true
 *         schema:
 *           type: string
 *         description: The ID of the seller verification record
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - reason
 *             properties:
 *               reason:
 *                 type: string
 *                 description: Reason for rejecting seller verification
 *     responses:
 *       200:
 *         description: Seller verification rejected successfully
 *       500:
 *         description: Something went wrong, failed to reject seller verification
 */


/**
 * @swagger
 * /api/admin/create/ticket:
 *   post:
 *     summary: Create a new support ticket
 *     tags: [admin]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - issueSumary
 *             properties:
 *               issueSumary:
 *                 type: string
 *                 description: Short summary of the issue
 *     responses:
 *       200:
 *         description: Ticket submitted successfully
 *       404:
 *         description: User not found
 *       500:
 *         description: Something went wrong, failed to submit ticket
 */

/**
 * @swagger
 * /api/admin/tickets:
 *   get:
 *     summary: Fetch all submitted tickets
 *     tags: [admin]
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
 *         description: Number of tickets per page
 *     responses:
 *       200:
 *         description: Successfully fetched tickets
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
 *                 ticket:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       ticketId:
 *                         type: string
 *                       issueSumary:
 *                         type: string
 *                       category:
 *                         type: string
 *                       status:
 *                         type: string
 *                       createdAt:
 *                         type: string
 *                         format: date-time
 *                       assignedTo:
 *                         type: string
 *       500:
 *         description: Something went wrong, failed to fetch tickets
 */

/**
 * @swagger
 * /api/admin/assign/ticket/agent/{ticketId}:
 *   put:
 *     summary: Assign an agent to a ticket
 *     tags: [admin]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: ticketId
 *         required: true
 *         schema:
 *           type: string
 *         description: The ID of the ticket to assign
 *       - in: query
 *         name: assignedUserId
 *         required: true
 *         schema:
 *           type: string
 *         description: User ID of the agent being assigned
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               assignedTo:
 *                 type: string
 *                 description: Name or identifier of the assigned agent
 *     responses:
 *       200:
 *         description: Ticket assigned successfully
 *       500:
 *         description: Something went wrong, failed to assign ticket
 */

/**
 * @swagger
 * /api/admin/open/ticket/{ticketId}:
 *   put:
 *     summary: Open or reopen a ticket
 *     tags: [admin]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: ticketId
 *         required: true
 *         schema:
 *           type: string
 *         description: The ID of the ticket
 *     responses:
 *       200:
 *         description: Ticket opened successfully
 *       500:
 *         description: Something went wrong, failed to open ticket
 */

/**
 * @swagger
 * /api/admin/escalate/ticket/{ticketId}:
 *   put:
 *     summary: Escalate a ticket to Super Admin
 *     tags: [admin]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: ticketId
 *         required: true
 *         schema:
 *           type: string
 *         description: The ID of the ticket
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - reason
 *             properties:
 *               reason:
 *                 type: string
 *                 description: Reason for escalating the ticket
 *     responses:
 *       200:
 *         description: Ticket escalated successfully
 *       500:
 *         description: Something went wrong, failed to escalate ticket
 */

/**
 * @swagger
 * /api/admin/mark/ticket/read/{ticketId}:
 *   put:
 *     summary: Mark a ticket as resolved (read)
 *     tags: [admin]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: ticketId
 *         required: true
 *         schema:
 *           type: string
 *         description: The ID of the ticket
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - reason
 *             properties:
 *               reason:
 *                 type: string
 *                 description: Reason for marking the ticket as resolved
 *     responses:
 *       200:
 *         description: Ticket marked as resolved successfully
 *       500:
 *         description: Something went wrong, failed to mark ticket as resolved
 */

/**
 * @swagger
 * /api/admin/all:
 *   get:
 *     summary: Get all admins (paginated)
 *     tags: [admin]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           default: 1
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           default: 10
 *     responses:
 *       200:
 *         description: List of admins
 *       500:
 *         description: Failed to fetch admins
 */

/**
 * @swagger
 * /api/admin/users/count:
 *   get:
 *     summary: Get total number of users
 *     tags: [admin]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Total user count
 *       500:
 *         description: Failed to count users
 */

/**
 * @swagger
 * /api/admin/shops/count:
 *   get:
 *     summary: Get total number of shops
 *     tags: [admin]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Total shop count
 *       500:
 *         description: Failed to count shops
 */

/**
 * @swagger
 * /api/admin/listings/active:
 *   get:
 *     summary: Get total number of active listings
 *     tags: [admin]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Active listings count
 *       500:
 *         description: Failed to fetch active listings
 */

/**
 * @swagger
 * /api/admin/activities:
 *   get:
 *     summary: Get admin activities
 *     tags: [admin]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Activities fetched successfully
 *       500:
 *         description: Failed to fetch activities
 */

/**
 * @swagger
 * /api/admin/new:
 *   post:
 *     summary: Invite or promote a new admin
 *     tags: [admin]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [email, password, name, status, rank]
 *             properties:
 *               email: { type: string }
 *               password: { type: string }
 *               name: { type: string }
 *               status: { type: string }
 *               rank: { type: string }
 *     responses:
 *       200:
 *         description: Admin added successfully
 *       500:
 *         description: Failed to add admin
 */

/**
 * @swagger
 * /api/admin/buyers:
 *   get:
 *     summary: Get all buyers
 *     tags: [admin]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of buyers
 *       500:
 *         description: Failed to fetch buyers
 */

/**
 * @swagger
 * /api/admin/sellers:
 *   get:
 *     summary: Get all sellers
 *     tags: [admin]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of sellers
 *       500:
 *         description: Failed to fetch sellers
 */

/**
 * @swagger
 * /api/admin/user/{customerId}:
 *   delete:
 *     summary: Delete a user (admin only)
 *     tags: [admin]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: customerId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: User deleted successfully
 *       404:
 *         description: Unauthorized
 *       500:
 *         description: Failed to delete user
 */

/**
 * @swagger
 * /api/admin/user/{customerId}:
 *   put:
 *     summary: Update user information
 *     tags: [admin]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: customerId
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
 *               email: { type: string }
 *               name: { type: string }
 *               phoneNumber: { type: string }
 *               role: { type: string }
 *     responses:
 *       200:
 *         description: User updated successfully
 *       500:
 *         description: Failed to update user
 */

/**
 * @swagger
 * /api/admin/seller/{customerId}:
 *   put:
 *     summary: Update seller information
 *     tags: [admin]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: customerId
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
 *               status: { type: string }
 *               isVerified: { type: boolean }
 *               storeName: { type: string }
 *               email: { type: string }
 *               name: { type: string }
 *               phoneNumber: { type: string }
 *     responses:
 *       200:
 *         description: Seller updated successfully
 *       500:
 *         description: Failed to update seller
 */

/**
 * @swagger
 * /api/admin/seller/{sellerId}/ratings:
 *   get:
 *     summary: Get seller ratings
 *     tags: [admin]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: sellerId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Seller ratings fetched successfully
 *       500:
 *         description: Failed to fetch seller ratings
 */

/**
 * @swagger
 * /api/admin/seller/{sellerId}/activities:
 *   get:
 *     summary: Get seller's store activities
 *     tags: [admin]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: sellerId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Store activities fetched successfully
 *       500:
 *         description: Failed to fetch store activities
 */

/**
 * @swagger
 * /api/admin/update-role:
 *   put:
 *     summary: Update user role
 *     tags: [admin]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [email, role]
 *             properties:
 *               email: { type: string }
 *               role: { type: string }
 *     responses:
 *       200:
 *         description: Role updated successfully
 *       500:
 *         description: Failed to update role
 */

/**
 * @swagger
 * /api/admin/payment-reminder/{receiverId}:
 *   post:
 *     summary: Send payment reminder notification
 *     tags: [admin]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: receiverId
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
 *               message: { type: string }
 *     responses:
 *       200:
 *         description: Reminder sent successfully
 *       500:
 *         description: Failed to send reminder
 */

/**
 * @swagger
 * /api/admin/roles:
 *   get:
 *     summary: Get all admin roles
 *     tags: [admin]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of admin roles
 *       500:
 *         description: Failed to fetch roles
 */

/**
 * @swagger
 * /api/admin/roles:
 *   post:
 *     summary: Create a new role
 *     tags: [admin]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [roleName, description]
 *             properties:
 *               roleName: { type: string }
 *               description: { type: string }
 *     responses:
 *       201:
 *         description: Role created successfully
 *       500:
 *         description: Failed to create role
 */

/**
 * @swagger
 * /api/admin/roles/{roleId}:
 *   put:
 *     summary: Edit admin role
 *     tags: [admin]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: roleId
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
 *               roleName: { type: string }
 *     responses:
 *       200:
 *         description: Role updated successfully
 *       500:
 *         description: Failed to update role
 */

/**
 * @swagger
 * /api/admin/suspend/{userId}:
 *   put:
 *     summary: Suspend an admin account
 *     tags: [admin]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: userId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Admin suspended successfully
 *       500:
 *         description: Failed to suspend admin
 */

/**
 * @swagger
 * /api/admin/reactivate/{userId}:
 *   put:
 *     summary: Reactivate an admin account
 *     tags: [admin]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: userId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Admin reactivated successfully
 *       500:
 *         description: Failed to reactivate admin
 */