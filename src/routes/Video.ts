import express from 'express';
import { Response, Request } from "express";
import {  AuthRequest } from "../middlewares/auth.middleware";
import { CallOffer, CallAnswer, IceCandidatePayload } from "../types/video.types";
import { Server, Socket } from "socket.io";
const router = express.Router();

/**
 * Map application userId -> socketId
 * We expect each client (buyer/seller) to call socket.emit('register', { userId })
 * immediately after connecting (or the server can alternatively authenticate & attach userId).
 */
const userToSocket = new Map<string, string>();
const socketToUser = new Map<string, string>();

router.get("/", (req, res) => res.json({ ok: true, time: new Date().toISOString() }));

// Optional: check if a user is online
router.get("/online/:userId", (req: AuthRequest, res: Response) => {
  const { userId } = req.params;
  res.json({ userId, online: userToSocket.has(userId) });
});

/**
 * Socket handlers
 */
export function registerSocketHandlers(io: Server) {
io.on("connection", (socket: Socket) => {
  console.log("socket connected:", socket.id);

  // 1) Register mapping
  socket.on("register", (payload: { userId: string }) => {
    const { userId } = payload || {};
    if (!userId) {
      socket.emit("registration-error", { message: "userId required" });
      return;
    }
    userToSocket.set(userId, socket.id);
    socketToUser.set(socket.id, userId);
    socket.emit("registered", { userId, socketId: socket.id });
    console.log(`registered userId=${userId} -> socket=${socket.id}`);
  });

  // 2) Caller starts call -> forward to callee (by userId)
  socket.on("call-user", (offer: CallOffer) => {
    const { toUserId, fromUserId, sdp, meta } = offer;
    const targetSocketId = userToSocket.get(toUserId);
    if (!targetSocketId) {
      socket.emit("user-offline", { toUserId });
      return;
    }
    io.to(targetSocketId).emit("incoming-call", { fromUserId, sdp, meta });
  });

  // 3) Callee answers -> forward to caller
  socket.on("make-answer", (answer: CallAnswer) => {
    const { toUserId, fromUserId, sdp } = answer;
    const targetSocketId = userToSocket.get(toUserId);
    if (!targetSocketId) {
      socket.emit("user-offline", { toUserId });
      return;
    }
    io.to(targetSocketId).emit("answer-made", { fromUserId, sdp });
  });

  // 3a) Receiver accepts call -> forward SDP answer to caller
socket.on("accept-call", (answer: CallAnswer) => {
  const { toUserId, fromUserId, sdp } = answer;
  const targetSocketId = userToSocket.get(toUserId);
  if (!targetSocketId) return;
  io.to(targetSocketId).emit("answer-made", { fromUserId, sdp });
});

// 3b) Receiver declines call -> notify caller
socket.on("decline-call", (payload: { fromUserId: string; toUserId: string; reason?: string }) => {
  const { fromUserId, toUserId, reason } = payload;
  const targetSocketId = userToSocket.get(toUserId);
  if (!targetSocketId) return;
  io.to(targetSocketId).emit("call-rejected", { by: fromUserId, reason });
});

  // 4) ICE candidate relay
  socket.on("ice-candidate", (payload: IceCandidatePayload) => {
    const { toUserId, fromUserId, candidate } = payload;
    const targetSocketId = userToSocket.get(toUserId);
    if (!targetSocketId) {
      // optionally buffer candidate for a short time until peer comes online
      return;
    }
    io.to(targetSocketId).emit("ice-candidate", { fromUserId, candidate });
  });

  // 5) Reject call
  socket.on("reject-call", (payload: { fromUserId: string; toUserId: string; reason?: string }) => {
    const { fromUserId, toUserId, reason } = payload;
    const targetSocketId = userToSocket.get(fromUserId);
    if (targetSocketId) io.to(targetSocketId).emit("call-rejected", { by: toUserId, reason });
  });

  // 6) End call (e.g., user hung up)
  socket.on("end-call", (payload: { fromUserId: string; toUserId: string; reason?: string }) => {
    const { fromUserId, toUserId, reason } = payload;
    const targetSocketId = userToSocket.get(toUserId);
    if (targetSocketId) io.to(targetSocketId).emit("call-ended", { fromUserId, reason });
  });

  // Toggle audio
socket.on("toggle-audio", ({ toUserId, isMuted }) => {
  const targetSocketId = userToSocket.get(toUserId);
  if (targetSocketId) io.to(targetSocketId).emit("audio-toggled", { isMuted });
});

// Toggle video
socket.on("toggle-video", ({ toUserId, isMuted }) => {
  const targetSocketId = userToSocket.get(toUserId);
  if (targetSocketId) io.to(targetSocketId).emit("video-toggled", { isMuted });
});

  // Cleanup on disconnect
  socket.on("disconnect", (reason) => {
    const userId = socketToUser.get(socket.id);
    if (userId) {
      userToSocket.delete(userId);
      socketToUser.delete(socket.id);
      // notify counterpart(s) if needed — here we simply broadcast user-left to anyone listening
      socket.broadcast.emit("user-offline-notify", { userId });
      console.log(`user ${userId} disconnected (${socket.id})`);
    } else {
      console.log(`socket ${socket.id} disconnected (no registered user)`);
    }
  });

  // Error handling
  socket.on("error", (err) => {
    console.error("socket error", err);
  });
});
}


export default router;