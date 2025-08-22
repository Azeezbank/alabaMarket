import { Response, Request } from "express";
import { JwtPayload } from "jsonwebtoken";
import prisma from "../../prisma.client.js";
import { AuthRequest } from "../../middlewares/auth.middleware.js";


//Create new ticket
export const createTickets = async (req: AuthRequest, res: Response) => {
    const userId = (req.user as JwtPayload)?.id;
    const { issueSumary } = req.body;

    try {
        const owner = await prisma.user.findUnique({
            where: { id: userId },
            select: {
                id: true,
                profile: {
                    select: { name: true }
                }
            }
        })

        if (!owner || !owner.profile) {
            console.log('Ticket cannot be created, User not found')
      return res.status(404).json({ message: "User not found" });
    }

        const submittedBy = owner?.profile?.name ?? "Unknown user";

        const generateTicketId = async (): Promise<string> => {
            const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
            let random = "";
            for (let i = 0; i < 4; i++) {
                random += chars.charAt(Math.floor(Math.random() * chars.length));
            }

            const id = `#TK${random}`;

            // Ensure uniqueness
            const exists = await prisma.ticket.findUnique({
                where: { ticketId: id }
            });

            return exists ? await generateTicketId() : id;
        }

        const ticketId = await generateTicketId();

        await prisma.ticket.create({
            data: {
                ticketId, submittedBy, issueSumary, userId
            },
        })

        const message = `You have new ticket submitted by user ${submittedBy}`;
        const type = 'Ticket';

        await prisma.notification.create({
            data: {
                senderId: userId, message, type
            }
        })

        res.status(200).json({ message: 'Ticket submitted successfully' })
    } catch (err: any) {
        console.error('Failed to submit tickets', err)
        return res.status(500).json({ message: 'Something went wrong, Failed to submit tickets' })
    }
}

//Fetch all submitted ticket
export const getTickets = async (req: AuthRequest, res: Response) => {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 10;
    const skip = (page - 1) * limit;
    try {
        const total = await prisma.ticket.count();

        const ticket = await prisma.ticket.findMany({
            select: {
                ticketId: true, issueSumary: true, category: true, status: true, createdAt: true, assignedTo: true
            },
            orderBy: { createdAt: 'desc' },
            skip,
            take: limit
        })

        res.status(200).json({ page, limit, total, totalPages: Math.ceil(total / limit), ticket })
    } catch (err: any) {
        console.error('Failed to select tickets', err)
        return res.status(500).json({ message: 'Something went wrong, Failed to select tickets' })
    }
}

//Asign new agent to a ticket
export const assignTicketAgent = async (req: AuthRequest, res: Response) => {
    const ticketId = req.params.ticketId as string;
    const { assignedTo } = req.body;
    const assignedUserId = req.query.assignedUserId as string;
    const userId = (req.user as JwtPayload)?.id;
    try {
        await prisma.ticket.update({ where: {id: ticketId},
        data: {
            assignedTo
        }
        })

        const message = `You have been assigned to attend to a new ticket ${ticketId}`;
        const type = 'Ticket';

        await prisma.notification.create({
            data: {
                senderId: userId, message, type, receiverId: assignedUserId
            }
        })

        res.status(200).json({ message: 'Ticket assigned successfully'})
    } catch (err: any) {
        console.error('Failed to assigned ticket to agent', err)
        return res.status(500).json({ message: 'Something went wromg, failed to assigned ticket to agent'})
    }
}

//Opan or reopen ticket
export const openTicket = async (req: AuthRequest, res: Response) => {
    const ticketId = req.params.ticketId as string;

    try {
        const status = 'Open'
        await prisma.ticket.update({ where: {id: ticketId},
        data: {
            status
        }
        })

        res.status(200).json({ message: 'Ticket assigned successfully'})
    } catch (err: any) {
        console.error('Failed to assigned ticket to agent', err)
        return res.status(500).json({ message: 'Something went wromg, failed to assigned ticket to agent'})
    }
}

//Escalate ticket
export const escalateTicket = async (req: AuthRequest, res: Response) => {
    const ticketId = req.params.ticketId as string;
    const userId = (req.user as JwtPayload)?.id;
    const reason = req.body.reason;
    const status = 'Escalated';
    try {
        await prisma.ticket.update({ where: { id: ticketId},
        data: {
            status
        }
        })

        await prisma.actionLog.create({
            data: {
                ticketId, type: 'Ticket', action: 'Escalated', reason, performedBy: userId
            }
        });

        const superAdmin = await prisma.profile.findFirst({ where: { rank: 'Super Admin'},
        select: {
            user: {
                select: {
                id: true
                }
            }
        }
        });

        const admin = superAdmin?.user?.id;

        const message = `This ticket ${ticketId} as been escalated for your review. Because ${reason}`;
        const type = 'Ticket';

        await prisma.notification.create({
            data: {
                senderId: userId, message, type, receiverId: admin
            }
        })
        res.status(200).json({ message: 'Ticket escalated successfully'})
    } catch (err: any) {
        console.error('Failed to escalate ticket', err)
        return res.status(500).json({message: 'Soimething went wrong, Failed to escalate ticket'})
    }
}

// Mark ticket as read
export const markTicketAsRead = async (req: AuthRequest, res: Response) => {
    const ticketId = req.params.ticketId as string;
    const userId = (req.user as JwtPayload)?.id;
    const status = 'Resolved';
    const reason = req.body.reason;
    try {
        await prisma.ticket.update({ where: { id: ticketId},
        data: {
            status
        }
        })

        const ticketOwner = await prisma.ticket.findFirst({ where: { id: ticketId},
            select: {
                user: {
                    select: {
                        id: true
                    }
                }
            }
        })

        await prisma.actionLog.upsert({ where: { ticketId},
            update: {
                action: 'Read', reason
            },
            create: {
                ticketId, type: 'Ticket', action: 'Read', reason, performedBy: userId
            }
        });

        const receiverId = ticketOwner?.user.id;

        const message = `Your ticket ${ticketId} as been resolved. ${reason}`;
        const type = 'Ticket';

        await prisma.notification.create({
            data: {
                senderId: userId, message, type, receiverId
            }
        })
        res.status(200).json({ message: 'Ticked marked resolved'})
    } catch (err: any) {
        console.error('Failed to mark ticket as resolved', err)
        return res.status(500).json({ message: 'Something went wrong, Failed to mark ticket as resolved'})
    }
}