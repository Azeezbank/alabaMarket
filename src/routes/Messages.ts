import express from 'express';
import { Response, Request } from "express";
import { Server, Socket } from "socket.io";
import prisma from "../prisma.client.js";
import { authenticate, AuthRequest } from "../middlewares/auth.middleware.js";
import { upload } from "../middlewares/upload.multer.js";
import { imagekit } from '../service/Imagekit.js';
import { JwtPayload } from 'jsonwebtoken';

const router = express.Router();

// Track connected users (userId -> socketId)
const users: Record<string, string> = {};

type PrivateMessagePayload = {
  senderId: string;
  receiverId: string;
  content: string;
  productId: string;
};

type TypingPayload = {
  senderId: string;
  receiverId: string;
};

type ReadMessagePayload = {
  senderId: string;   // the sender of unread messages
  receiverId: string; // the one who just read them
};

export const initializeSocket = (io: Server) => {
  io.on("connection", (socket: Socket) => {
    console.log("New client connected:", socket.id);

    // Register user
    socket.on("register", (userId: string) => {
      users[userId] = socket.id;
      console.log("User registered:", userId);
    });

    // Check if a user is online
    socket.on("check_online", (userId: string, callback: (online: boolean) => void) => {
      const isOnline = !!users[userId];
      callback(isOnline);
    });


    // Send text message
    socket.on("private_message", async (payload: PrivateMessagePayload) => {
      const { senderId, receiverId, content, productId } = payload;

      try {
        // Save message in DB
        const newMessage = await prisma.chat.create({
          data: { senderId, receiverId, content, productId },
        });

        // Emit to sender (so it shows in their chat immediately)
        socket.emit("private_message", newMessage);

        // Emit to receiver if online
        const receiverSocket = users[receiverId];
        if (receiverSocket) {
          io.to(receiverSocket).emit("private_message", newMessage);
        }
      } catch (err: any) {
        console.error("Error saving private message:", err);
      }
    });

    // Typing indicator
    socket.on("typing", (payload: TypingPayload) => {
      const { senderId, receiverId } = payload;
      const receiverSocket = users[receiverId];
      if (receiverSocket) {
        io.to(receiverSocket).emit("typing", { senderId });
      }
    });

    // Mark messages as read
    socket.on("read_message", async (payload: ReadMessagePayload) => {
      const { senderId, receiverId } = payload;

      try {
        // Mark all unread messages from sender -> receiver as read
        await prisma.chat.updateMany({
          where: { senderId, receiverId, isRead: false },
          data: { isRead: true },
        });

        // Notify sender that their messages were read
        const senderSocket = users[senderId];
        if (senderSocket) {
          io.to(senderSocket).emit("messages_read", {
            readerId: receiverId,
          });
        }
      } catch (err: any) {
        console.error("Error marking messages as read:", err);
      }
    });

    // Handle disconnect
    socket.on("disconnect", () => {
      for (const userId in users) {
        if (users[userId] === socket.id) {
          delete users[userId];
          break;
        }
      }
      console.log("Client disconnected:", socket.id);
    });
  });
};

//Select chat list for buyer
// export const getChatListForBuyer = async (req: AuthRequest, res: Response) => {
//   const userId = (req.user as JwtPayload)?.id;
//   if (!userId) {
//     return res.status(401).json({ message: 'Unauthorized' });
//   }
//   try {
//     // Get latest chat per product]
// const chats = await prisma.chat.findMany({
//   where: {
//     OR: [
//       { senderId: userId },
//       { receiverId: userId },
//     ],
//   },
//   orderBy: {
//     createdAt: 'desc',
//   },
//   distinct: ['productId'], // ensures only one per product (latest, because of orderBy)
//   // include: {
//   //   product: true,
//   //   sender: true,
//   //   receiver: true,
//   // },
// });
// return res.status(200).json({ message: 'Chat list fetched successfully', chats });
//   } catch (err: any) {
//     console.error('Failed to fetch chat list for buyer', err)
//     return res.status(500).json({ message: 'Something went wrong, Failed to fetch chat list for buyer' })
//   }
// }


//Chat list
router.get('/list', authenticate, async (req: AuthRequest, res: Response) => {
  const senderId = (req.user as JwtPayload)?.id as string;

  try {
    // Step 1: get latest createdAt per products
    const grouped = await prisma.chat.groupBy({
      by: ['productId'],
      where: {
        OR: [
          { senderId: senderId },
          { receiverId: senderId }
        ]
      },
      _max: { createdAt: true },
    });

    if (!grouped.length) {
      return res.status(200).json([]);
    }

    // Step 2: fetch full chat rows including product
    const latestChats = await prisma.chat.findMany({
      where: {
        OR: grouped
          .filter((g): g is { productId: string; _max: { createdAt: Date } } => g._max.createdAt !== null) // filter out nulls
          .map((g: { productId: string; _max: { createdAt: Date }}) => ({
            productId: g.productId,
            createdAt: g._max.createdAt!, // non-null assertion
          })),
      },
      include: {
        product: {
          select: {
            id: true,
            name: true,
            productPhoto: {
              select: {
                url: true
              }
            }
          },
        },
      },
      orderBy: { createdAt: 'desc' },
    });
    res.status(200).json(latestChats);
  } catch (err: any) {
    console.error('Failed to fetch chat list', err)
    return res.status(500).json({ message: 'Something went wrong, Failed to fetch chat list' })
  }
});


//Fetch messges
router.get('/:senderId/:receiverId/:productId', authenticate, async (req: AuthRequest, res: Response) => {
  const { senderId, receiverId, productId } = req.params;
  try {

    const productDetails = await prisma.product.findUnique({
      where: { id: productId },
      select: {
        id: true, name: true,
        productPricing: {
          select: { price: true }
        },
        productPhoto: { select: { url: true } }
      }
    });

    const sellerDetails = await prisma.user.findUnique({
      where: { id: receiverId },
      select: {
        id: true, email: true,
        profile: { select: { name: true, profile_pic: true } }
      }
    });

    const senderDetails = await prisma.user.findUnique({
      where: { id: senderId },
      select: {
        id: true, email: true,
        profile: { select: { name: true, profile_pic: true } }
      }
    });


    const messages = await prisma.chat.findMany({
      where: {
        OR: [
          { senderId, receiverId, productId },
          { senderId: receiverId, receiverId: senderId, productId: productId }
        ]
      },
      include: {
        sender: {
          select: {
            id: true,
            email: true,
            profile: {
              select: {
                name: true,
                profile_pic: true
              }
            }
          }
        },
        receiver: {
          select: {
            id: true,
            email: true,
            profile: {
              select: {
                name: true,
                profile_pic: true
              }
            }
          }
        }
      },
      orderBy: { createdAt: "asc" }
    });

    res.status(200).json({ productDetails, sellerDetails, senderDetails, messages });
  } catch (err: any) {
    console.error('Failed to select messages', err)
    return res.status(500).json({ message: 'Something went wrong, Failed to select messages' })
  }
});

// Audio recording
router.post('/audio/record/:receiverId/:productId', authenticate, upload.single("file"), async (req: AuthRequest, res: Response) => {
  const userId = (req.user as JwtPayload)?.id;
  const receiverId = req.params.receiverId as string;
  const productId = req.params.productId as string;
  try {
    if (!req.file) {
      return res.status(400).json({ message: "No file uploaded" });
    }

    let extension = req.file.mimetype.split("/")[1];
    if (extension === "mpeg") extension = "mp3";
    const fileName = `voice_${Date.now()}.${extension}`;

    const result = await imagekit.upload({
      file: req.file.buffer, // actual file buffer
      fileName, // give unique name
      folder: "/voice_notes" // optional folder
    });

    await prisma.chat.create({
      data: {
        senderId: userId, receiverId, content: result.url, productId
      }
    })

    // Save result.url to DB in message
    res.json({ message: 'Recording sent successfully', audioUrl: result.url });
  } catch (error: any) {
    console.error("Voice upload error:", error);
    return res.status(500).json({ message: 'Failed to send voice record', error });
  }
});


export default router;