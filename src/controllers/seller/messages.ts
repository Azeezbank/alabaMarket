// import { Response, Request } from "express";
// import { JwtPayload } from "jsonwebtoken";
// import prisma from "../../prisma.client.js";
// import { AuthRequest } from "../../middlewares/auth.middleware.js";

// // Fetch message where sender is buyer
// export const buyerNotification = async (req: AuthRequest, res: Response) => {
//   const receiverId = (req.user as JwtPayload)?.id;
//   try {
//     const buyerNotifications = await prisma.notification.findMany({
//   where: {
//     user: {
//       profile: {
//       role: 'Buyer' // role value from User model
//       }
//     }
//   },
//   select: {
//     id: true,
//         message: true,
//         type: true,
//         isRead: true,
//         createdAt: true,
//     user: {
//       select: {
//         id: true,
//         role: true
//       }
//     }
//   }
// });
//   }
// }