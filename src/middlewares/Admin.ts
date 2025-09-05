// import { Request, Response, NextFunction } from "express";
// import { JwtPayload } from "jsonwebtoken";
// import { AuthRequest } from "./auth.middleware.js";
// import prisma from '../prisma.client.js';

// export const isAdmin = async (req: AuthRequest, res: Response, next: NextFunction) => {
//     try {
//         const userId = (req.user as JwtPayload)?.id;

//         if (!userId) {
//       return res.status(401).json({ message: "Unauthorized: No user ID found" });
//     }

//         const admin = await prisma.user.findUnique({
//             where: { id: userId, profile: { status: 'Active'} },
//             select: {
//                 id: true,
//                 profile: {
//                     select: {
//                         role: true, status: true
//                     }
//                 }
//             }
//         });

//         if (!admin?.profile?.role || admin.profile?.role !== 'Admin' || admin.profile.status !== 'Active') {
//             console.log('No admin found')
//             return res.status(403).json({ message: "Forbidden: Active Admin access only" });
//         }

//         next();
//     } catch (error) {
//         return res.status(401).json({ message: "Unauthorized" });
//     }
// };