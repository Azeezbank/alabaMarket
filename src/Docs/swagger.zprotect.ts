/**
 * @swagger
 * /api/protect/page:
 *   get:
 *     summary: Page protection
 *     description: Validates if the current user has a valid JWT token to access protected pages.
 *     tags:
 *       - Page Protection
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Authorized user
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Authorized
 *       401:
 *         description: Unauthorized - user not logged in or invalid token
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Unauthorized access, proceed to login
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Something went wrong, failed to protect page
 */