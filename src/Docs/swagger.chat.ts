/**
 * @swagger
 * /api/chat/audio/record/{receiverId}:
 *   post:
 *     summary: Upload and send a voice note
 *     description: Records and uploads a voice note to ImageKit, saves it as a chat message, and returns the audio URL.
 *     tags:
 *       - Chat
 *     security:
 *       - bearerAuth: []
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
 *     summary: Socket.IO Chat Events Documentation
 *     description: |
 *       This socket server handles **private messaging, typing indicators,**
 *       and **message read receipts** between users.
 *
 *       ## EVENTS
 *       1. **register**
 *          - Registers a user with their socket connection.  
 *          - Client emits:
 *            ```js
 *            socket.emit("register", userId);
 *            ```
 *
 *       2. **check_online**
 *          - Checks if a user is online.  
 *          - Client emits:
 *            ```js
 *            socket.emit("check_online", receiverId, (online) => {
 *              console.log("Is user online?", online);
 *            });
 *            ```
 *
 *       3. **private_message**
 *          - Sends a private message from one user to another.  
 *          - Client emits:
 *            ```js
 *            socket.emit("private_message", {
 *              senderId: "user1",
 *              receiverId: "user2",
 *              content: "Hello!"
 *            });
 *            ```
 *          - Server emits back:
 *            ```js
 *            socket.on("private_message", (message) => {
 *              console.log("New message:", message);
 *            });
 *            ```
 *
 *       4. **typing**
 *          - Notifies the receiver that the sender is typing.  
 *          - Client emits:
 *            ```js
 *            socket.emit("typing", {
 *              senderId: "user1",
 *              receiverId: "user2"
 *            });
 *            ```
 *          - Server emits to receiver:
 *            ```js
 *            socket.on("typing", ({ senderId }) => {
 *              console.log(senderId, "is typing...");
 *            });
 *            ```
 *
 *       5. **read_message**
 *          - Marks all messages from a sender as read by the receiver.  
 *          - Client emits:
 *            ```js
 *            socket.emit("read_message", {
 *              senderId: "user1",   // who sent the messages
 *              receiverId: "user2"  // who just read them
 *            });
 *            ```
 *          - Server emits to sender:
 *            ```js
 *            socket.on("messages_read", ({ readerId }) => {
 *              console.log("User", readerId, "read your messages");
 *            });
 *            ```
 *
 *       6. **disconnect**
 *          - Automatically handled when a client disconnects.  
 *          - Server logs and removes user from the online list.
 *
 *       ## NOTES
 *       - Make sure to **register** after connecting to associate the userId with a socket.  
 *       - Always listen for `private_message`, `typing`, and `messages_read` events to update the UI in real-time.
 *     tags:
 *       - Chat
 */

/**
 * @swagger
 * /api/chat/{senderId}/{receiverId}:
 *   get:
 *     summary: Get chat messages between two users
 *     tags: [Chat]
 *     security:
 *       - bearerAuth: []
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
 * /video/socket-docs:
 *   get:
 *     summary: Socket.IO Call & Signaling Events Documentation
 *     description: |
 *       This server manages **real-time calling (WebRTC signaling)** between users.
 *       It maps users to sockets, forwards call offers, answers, ICE candidates, and
 *       handles toggling audio/video, rejecting, and ending calls.
 *
 *       ## USER <-> SOCKET MAPPING
 *       - Maintains:
 *         - `userToSocket`: Map of userId → socketId
 *         - `socketToUser`: Map of socketId → userId
 *       - Clients should emit `register` with their userId after connecting:
 *         ```js
 *         socket.emit("register", { userId });
 *         ```
 *
 *       ## HTTP ENDPOINTS
 *       - `GET /api/video/status/` → Health check, returns `{ ok: true, time }`.
 *       - `GET /api/video/status/online/:userId` → Returns whether a user is online.
 *
 *       ## SOCKET EVENTS
 *       1. **register**
 *          - Registers the mapping between userId and socketId.
 *          - Emits back:
 *            ```js
 *            socket.on("registered", ({ userId, socketId }) => { ... });
 *            ```
 *
 *       2. **call-user**
 *          - Caller sends SDP offer to callee.
 *          - Emits to target:
 *            ```js
 *            socket.on("incoming-call", { fromUserId, sdp, meta });
 *            ```
 *
 *       3. **make-answer**
 *          - Callee answers call with SDP.
 *          - Emits to caller:
 *            ```js
 *            socket.on("answer-made", { fromUserId, sdp });
 *            ```
 *
 *       3a. **accept-call**
 *          - Forward SDP answer to caller.
 *
 *       3b. **decline-call**
 *          - Notify caller that callee rejected.
 *          - Emits:
 *            ```js
 *            socket.on("call-rejected", { by, reason });
 *            ```
 *
 *       4. **ice-candidate**
 *          - Relays ICE candidate between peers.
 *          - Emits to target:
 *            ```js
 *            socket.on("ice-candidate", { fromUserId, candidate });
 *            ```
 *
 *       5. **reject-call**
 *          - Receiver rejects an incoming call.
 *
 *       6. **end-call**
 *          - Ends an ongoing call (hang up).
 *          - Emits:
 *            ```js
 *            socket.on("call-ended", { fromUserId, reason });
 *            ```
 *
 *       7. **toggle-audio**
 *          - Notify peer of mic mute/unmute.
 *          - Emits:
 *            ```js
 *            socket.on("audio-toggled", { isMuted });
 *            ```
 *
 *       8. **toggle-video**
 *          - Notify peer of camera on/off.
 *          - Emits:
 *            ```js
 *            socket.on("video-toggled", { isMuted });
 *            ```
 *
 *       9. **disconnect**
 *          - Cleans up mappings and notifies peers that user is offline.
 *
 *       ## ERROR HANDLING
 *       - On invalid registration: emits `registration-error`.
 *       - Logs unexpected socket errors with `socket.on("error")`.
 *
 *       ## NOTES
 *       - Always `register` after connection.  
 *       - Use `online/:userId` REST endpoint to check presence.  
 *       - Signaling data is only forwarded — actual WebRTC peer connection happens in client apps.
 *     tags:
 *       - Call
 */
