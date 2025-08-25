/**
 * @swagger
 * /api/chat/audio/record/{receiverId}:
 *   post:
 *     summary: Upload and send a voice note
 *     description: Records and uploads a voice note to ImageKit, saves it as a chat message, and returns the audio URL.
 *     tags:
 *       - Chat
 *     security:
 *       - bearerAuth: []   # JWT authentication
 *     parameters:
 *       - in: path
 *         name: receiverId
 *         required: true
 *         schema:
 *           type: string
 *         description: The ID of the user receiving the voice note
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
 *                 description: The audio file to upload (e.g., webm, mp3, m4a)
 *     responses:
 *       201:
 *         description: Voice note uploaded successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Recording sent successfully
 *                 audioUrl:
 *                   type: string
 *                   example: "https://ik.imagekit.io/your_id/voice_notes/voice_172450885.mp3"
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
 *       401:
 *         description: Unauthorized (invalid or missing token)
 *       500:
 *         description: Failed to send voice record
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Failed to send voice record
 */



/**
 * @swagger
 * tags:
 *   name: Chat
 *   description: Real-time chat messaging (via Socket.IO) and chat history
 */

/**
 * @swagger
 * /chat/socket-docs:
 *   get:
 *     summary: Socket.IO integration guide for Chat
 *     description: |
 *       Use **Socket.IO** to send and receive real-time chat events.
 *
 *       ---
 *       ## 🔹 Client → Server (use `socket.emit`)
 *
 *       - **register**
 *         - Purpose: Register the logged-in user with the socket server.
 *         - Payload: `{ userId: string }`
 *         - Example:
 *           ```js
 *           socket.emit("register", "USER_ID");
 *           ```
 *
 *       - **private_message**
 *         - Purpose: Send a message to another user.
 *         - Payload: `{ senderId: string, receiverId: string, content: string }`
 *         - Example:
 *           ```js
 *           socket.emit("private_message", {
 *             senderId: "123",
 *             receiverId: "456",
 *             content: "Hello there!"
 *           });
 *           ```
 *
 *       - **typing**
 *         - Purpose: Indicate that the user is typing.
 *         - Payload: `{ senderId: string, receiverId: string }`
 *         - Example:
 *           ```js
 *           socket.emit("typing", { senderId: "123", receiverId: "456" });
 *           ```
 *
 *       - **read_message**
 *         - Purpose: Mark all unread messages as "read".
 *         - Payload: `{ senderId: string, receiverId: string }`
 *         - Example:
 *           ```js
 *           socket.emit("read_message", { senderId: "456", receiverId: "123" });
 *           ```
 *
 *       ---
 *       ## 🔹 Server → Client (use `socket.on`)
 *
 *       - **private_message**
 *         - Fired when a new message is sent **or** received.
 *         - Payload: `{ id, senderId, receiverId, content, createdAt, isRead }`
 *         - Example:
 *           ```js
 *           socket.on("private_message", (msg) => {
 *             console.log("New message:", msg);
 *           });
 *           ```
 *
 *       - **typing**
 *         - Fired when the other user is typing.
 *         - Payload: `{ senderId }`
 *         - Example:
 *           ```js
 *           socket.on("typing", ({ senderId }) => {
 *             console.log(`${senderId} is typing...`);
 *           });
 *           ```
 *
 *       - **messages_read**
 *         - Fired when the other user has read your messages.
 *         - Payload: `{ readerId }`
 *         - Example:
 *           ```js
 *           socket.on("messages_read", ({ readerId }) => {
 *             console.log(`Messages were read by: ${readerId}`);
 *           });
 *           ```
 *
 *       ---
 *       ## 🔹 Integration Flow
 *
 *       1. Connect to the socket server:
 *          ```js
 *          import { io } from "socket.io-client";
 *          const socket = io("http://localhost:5000"); // backend URL
 *          ```
 *
 *       2. Register the logged-in user:
 *          ```js
 *          socket.emit("register", currentUserId);
 *          ```
 *
 *       3. Send and receive messages using `private_message`.
 *       4. Show "typing..." status with `typing`.
 *       5. Update read receipts with `read_message` and listen for `messages_read`.
 *
 *       ---
 *       ✅ With this setup, the frontend always knows:
 *       - When a user connects (`register`)
 *       - When a message is sent or received (`private_message`)
 *       - When the other person is typing (`typing`)
 *       - When messages were read (`messages_read`)
 *     tags: [Chat]
 *     responses:
 *       200:
 *         description: Real-time chat integration guide
 */

/**
 * @swagger
 * /api/chat/{senderId}/{receiverId}:
 *   get:
 *     summary: Get chat messages between two users
 *     tags: [Chat]
 *     parameters:
 *       - in: path
 *         name: senderId
 *         required: true
 *         schema:
 *           type: string
 *         description: The ID of the sender.
 *       - in: path
 *         name: receiverId
 *         required: true
 *         schema:
 *           type: string
 *         description: The ID of the receiver.
 *     responses:
 *       200:
 *         description: List of messages between the two users
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   id:
 *                     type: string
 *                   content:
 *                     type: string
 *                   senderId:
 *                     type: string
 *                   receiverId:
 *                     type: string
 *                   isRead:
 *                     type: boolean
 *       500:
 *         description: Server error
 */


/**
 * @swagger
 * tags:
 *   name: Video
 *   description: Real-time 1-to-1 video calling (via Socket.IO)
 */

/**
 * @swagger
 * /video/socket-docs:
 *   get:
 *     summary: Socket.IO integration guide for Video Calls
 *     description: |
 *       Use **Socket.IO** to initiate and manage 1-to-1 WebRTC video calls.
 *
 *       --- 
 *       ## 🔹 Client → Server (use `socket.emit`)
 *
 *       - **register**
 *         - Purpose: Register the logged-in user with the socket server.
 *         - Payload: `{ userId: string }`
 *         - Example:
 *           ```js
 *           socket.emit("register", { userId: "USER_ID" });
 *           ```
 *
 *       - **call-user**
 *         - Purpose: Caller initiates a call (send SDP offer)
 *         - Payload: `{ fromUserId: string, toUserId: string, sdp: object, meta?: object }`
 *         - Example:
 *           ```js
 *           socket.emit("call-user", {
 *             fromUserId: "123",
 *             toUserId: "456",
 *             sdp: offerSDP,
 *             meta: { callType: "video" }
 *           });
 *           ```
 *
 *       - **accept-call**
 *         - Purpose: Receiver accepts the call and sends SDP answer
 *         - Payload: `{ fromUserId: string, toUserId: string, sdp: object }`
 *         - Example:
 *           ```js
 *           socket.emit("accept-call", {
 *             fromUserId: "456",
 *             toUserId: "123",
 *             sdp: answerSDP
 *           });
 *           ```
 *
 *       - **decline-call**
 *         - Purpose: Receiver declines the call
 *         - Payload: `{ fromUserId: string, toUserId: string, reason?: string }`
 *         - Example:
 *           ```js
 *           socket.emit("decline-call", {
 *             fromUserId: "456",
 *             toUserId: "123",
 *             reason: "Busy"
 *           });
 *           ```
 *
 *       - **ice-candidate**
 *         - Purpose: Exchange ICE candidates between peers
 *         - Payload: `{ fromUserId: string, toUserId: string, candidate: object }`
 *         - Example:
 *           ```js
 *           socket.emit("ice-candidate", {
 *             fromUserId: "123",
 *             toUserId: "456",
 *             candidate: iceCandidate
 *           });
 *           ```
 *
 *       - **end-call**
 *         - Purpose: Notify the other user the call has ended
 *         - Payload: `{ fromUserId: string, toUserId: string, reason?: string }`
 *         - Example:
 *           ```js
 *           socket.emit("end-call", {
 *             fromUserId: "123",
 *             toUserId: "456",
 *             reason: "User hung up"
 *           });
 *           ```
 *
 *       --- 
 *       ## 🔹 Server → Client (use `socket.on`)
 *
 *       - **incoming-call**
 *         - Fired when a user receives a call
 *         - Payload: `{ fromUserId: string, sdp: object, meta?: object }`
 *         - Example:
 *           ```js
 *           socket.on("incoming-call", ({ fromUserId, sdp, meta }) => {
 *             console.log("Incoming call from:", fromUserId);
 *           });
 *           ```
 *
 *       - **answer-made**
 *         - Fired when the callee answers the call
 *         - Payload: `{ fromUserId: string, sdp: object }`
 *         - Example:
 *           ```js
 *           socket.on("answer-made", ({ fromUserId, sdp }) => {
 *             console.log("Call answered by:", fromUserId);
 *           });
 *           ```
 *
 *       - **call-rejected**
 *         - Fired when a user declines a call
 *         - Payload: `{ by: string, reason?: string }`
 *         - Example:
 *           ```js
 *           socket.on("call-rejected", ({ by, reason }) => {
 *             console.log(`Call rejected by ${by}. Reason: ${reason}`);
 *           });
 *           ```
 *
 *       - **ice-candidate**
 *         - Fired when receiving ICE candidates
 *         - Payload: `{ fromUserId: string, candidate: object }`
 *         - Example:
 *           ```js
 *           socket.on("ice-candidate", ({ fromUserId, candidate }) => {
 *             console.log("Received ICE candidate from", fromUserId);
 *           });
 *           ```
 *
 *       - **call-ended**
 *         - Fired when the other user ends the call
 *         - Payload: `{ fromUserId: string, reason?: string }`
 *         - Example:
 *           ```js
 *           socket.on("call-ended", ({ fromUserId, reason }) => {
 *             console.log(`Call ended by ${fromUserId}. Reason: ${reason}`);
 *           });
 *           ```
 *
 *       --- 
 *       ## 🔹 Integration Flow
 *
 *       1. Connect to the socket server:
 *          ```js
 *          import { io } from "socket.io-client";
 *          const socket = io("http://localhost:5000"); // backend URL
 *          ```
 *
 *       2. Register the logged-in user:
 *          ```js
 *          socket.emit("register", currentUserId);
 *          ```
 *
 *       3. Initiate a call using `call-user`.
 *       4. Receiver handles `incoming-call` and accepts (`accept-call`) or declines (`decline-call`).
 *       5. Exchange ICE candidates using `ice-candidate`.
 *       6. End call with `end-call`.
 *
 *       --- 
 *       ✅ This setup enables real-time 1-to-1 video calls with proper signaling and call management.
 *     tags: [Video]
 *     responses:
 *       200:
 *         description: Real-time video call integration guide
 */
