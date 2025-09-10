/**
 * @swagger
 * tags:
 *   name: Admin
 *   description: Admin management and operations
 */

/**
 * @swagger
 * /api/admin/create/subscription/plan:
 *   post:
 *     summary: Create a new subscription plan
 *     description: Allows an admin to create a new subscription plan with visibility and placement rules.
 *     tags:
 *       - Admin
 *     security:
 *       - bearerAuth: []   # requires JWT auth
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *               - price
 *               - duration
 *               - maxVisibleProducts
 *               - placement
 *               - maxVisibleCat
 *             properties:
 *               name:
 *                 type: string
 *                 example: Premium Plan
 *               price:
 *                 type: number
 *                 example: 5000
 *               duration:
 *                 type: string
 *                 enum: [weekly, monthly, quarterly, annually]
 *                 example: monthly
 *               maxVisibleProducts:
 *                 type: integer
 *                 example: 50
 *               placement:
 *                 type: string
 *                 example: top
 *               maxVisibleCat:
 *                 type: integer
 *                 description: Maximum visible items per category
 *                 example: 10
 *     responses:
 *       200:
 *         description: Subscription plan created successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Plan created successfully
 *       500:
 *         description: Failed to create subscription plan due to a server error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Something went wrong. Failed to create subscription plan
 */


/**
 * @swagger
 * /api/admin/subscription/plan:
 *   get:
 *     summary: Get all subscription plans
 *     tags: [Admin]
 *     security:
 *       - bearerAuth: []   # requires JWT auth
 *     responses:
 *       200:
 *         description: List of subscription plans
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
 *         description: Failed to fetch subscription plans
 */

/**
 * @swagger
 * /api/admin/edit/subcription/plan/{planId}:
 *   put:
 *     summary: Edit a subscription plan
 *     tags: [Admin]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: planId
 *         schema:
 *           type: string
 *           format: uuid
 *         required: true
 *         description: The subscription plan ID
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
 *               duration:
 *                 type: string
 *                 enum: [Weekly, Monthly, Quarterly, Annually]
 *               maxVisibleProducts:
 *                 type: integer
 *               placement:
 *                 type: string
 *               maxVisible:
 *                 type: integer
 *     responses:
 *       200:
 *         description: Plan updated successfully
 *       404:
 *         description: Plan not found
 *       500:
 *         description: Failed to edit subscription plan
 */

/**
 * @swagger
 * /api/admin/delete/subscription/plan/{planId}:
 *   delete:
 *     summary: Delete a subscription plan
 *     tags: [Admin]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: planId
 *         schema:
 *           type: string
 *           format: uuid
 *         required: true
 *         description: The subscription plan ID
 *     responses:
 *       200:
 *         description: Plan deleted successfully
 *       404:
 *         description: Plan not found
 *       500:
 *         description: Failed to delete subscription plan
 */

/**
 * @swagger
 * /api/admin/approve/listing/{productId}:
 *   put:
 *     summary: Approve a product listing
 *     description: Approves a product listing by updating its status to "Approved" and sends a notification to the listing owner.
 *     tags: [Admin]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: productId
 *         required: true
 *         schema:
 *           type: string
 *         description: The ID of the product to approve
 *     responses:
 *       200:
 *         description: Listing approved successfully and notification sent
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Listing accepted and notification sent
 *       401:
 *         description: Unauthorized, authentication required
 *       404:
 *         description: Product not found
 *       500:
 *         description: Something went wrong, Failed to accept Listing
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
 * /api/admin/create/category:
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
 * /api/admin/update/category/{categoryId}:
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
 * /api/admin/all/categories:
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
 * /api/admin/all/subcategories:
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
 * /api/admin/create/subcategory:
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
 * /api/admin/all/admin:
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
 * /api/admin/total/user/count:
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
 * /api/admin/total/shops:
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
 * /api/admin/total/active/listing:
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
 * /api/admin/new/admin:
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
 * /api/admin/all/users:
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
 * /api/admin/all/sellers:
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
 * /api/admin/update/user/role:
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
 * /api/admin/role/management:
 *   get:
 *     summary: Get all admin roles, and the role details
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
 * /api/admin/add/new/admin/role:
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
 * /api/admin/edit/admin/role/{roleId}:
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

/**
 * @swagger
 * /api/admin/create/payment/provider:
 *   post:
 *     summary: Create a new payment provider
 *     description: Add a new payment provider (e.g., Paystack or Flutterwave). Only one provider should be active at a time.
 *     tags:
 *       - Admin
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *               - publicKey
 *               - secretKey
 *               - isActive
 *             properties:
 *               name:
 *                 type: string
 *                 example: paystack
 *               publicKey:
 *                 type: string
 *                 example: pk_test_xxxxxxxxxxxxxx
 *               secretKey:
 *                 type: string
 *                 example: sk_test_xxxxxxxxxxxxxx
 *               isActive:
 *                 type: boolean
 *                 example: true
 *     responses:
 *       200:
 *         description: Payment provider created successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Payment provider created successfully
 *       401:
 *         description: Unauthorized – JWT missing or invalid
 *       500:
 *         description: Failed to create payment provider
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: Failed to create payment provider
 */

/**
 * @swagger
 * /api/admin/update/payment/provider:
 *   put:
 *     summary: Update an existing payment provider
 *     description: Update a payment provider’s details by providing its name.
 *     tags:
 *       - Admin
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *             properties:
 *               name:
 *                 type: string
 *                 example: flutterwave
 *               publicKey:
 *                 type: string
 *                 example: FLWPUBK_TEST-xxxxxxxxxxxx
 *               secretKey:
 *                 type: string
 *                 example: FLWSECK_TEST-xxxxxxxxxxxx
 *               isActive:
 *                 type: boolean
 *                 example: false
 *     responses:
 *       200:
 *         description: Payment provider updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Payment provider updated successfully
 *       401:
 *         description: Unauthorized – JWT missing or invalid
 *       404:
 *         description: Payment provider not found
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Payment provider not found
 *       500:
 *         description: Failed to update payment provider
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: Failed to update payment provider
 */


/**
 * @swagger
 * /api/admin/check/payment/status:
 *   get:
 *     summary: Get all payment statuses
 *     description: Fetch all payment transactions and their statuses.
 *     tags:
 *       - admin
 *     security:
 *       - bearerAuth: []   # Requires JWT authentication
 *     responses:
 *       200:
 *         description: List of payment transactions retrieved successfully
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
 *                     example: "Success"
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
 *         description: Unauthorized (invalid or missing token)
 *       500:
 *         description: Failed to fetch payment statuses
 */

/**
 * @swagger
 * /api/admin/edit/payment/status/{paymentId}:
 *   put:
 *     summary: Edit payment status
 *     description: Update the status of a specific payment transaction by its ID.
 *     tags:
 *       - admin
 *     security:
 *       - bearerAuth: []   # Requires JWT authentication
 *     parameters:
 *       - in: path
 *         name: paymentId
 *         required: true
 *         schema:
 *           type: string
 *         description: The ID of the payment transaction to update
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - status
 *             properties:
 *               status:
 *                 type: string
 *                 enum: [Pending, Success, Failed, Cancelled]
 *                 example: "Success"
 *     responses:
 *       200:
 *         description: Payment status updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Payment status updated successfully"
 *       400:
 *         description: Invalid input
 *       401:
 *         description: Unauthorized (invalid or missing token)
 *       404:
 *         description: Payment not found
 *       500:
 *         description: Failed to edit payment status
 */

/**
 * @swagger
 * /api/admin/all/shop/details:
 *   get:
 *     summary: Get all seller shop details
 *     description: Retrieve all seller shops along with their owner's email addresses.
 *     tags:
 *       - admin
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Successfully fetched all shop details
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   id:
 *                     type: string
 *                     example: "a1b2c3d4-e5f6-7890-gh12-ijklmnopqrst"
 *                   name:
 *                     type: string
 *                     example: "Tunde's Electronics"
 *                   description:
 *                     type: string
 *                     example: "We sell quality gadgets and accessories"
 *                   user:
 *                     type: object
 *                     properties:
 *                       email:
 *                         type: string
 *                         example: "owner@example.com"
 *       401:
 *         description: Unauthorized – invalid or missing token
 *       500:
 *         description: Failed to fetch shop details
 */