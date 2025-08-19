import { Request, Response } from "express";
import { JwtPayload } from "jsonwebtoken";
import { AuthRequest } from '../../middlewares/auth.middleware.js';
import prisma from "../../prisma.client.js";
import { Resend } from "resend";
import bcrypt from "bcryptjs";


// Resend setup
const resend = new Resend(process.env.RESEND_API_KEY!);



//Fetch total numbers of users
export const getUsers = async (req: AuthRequest, res: Response) => {
    try {
        const buyers = await prisma.user.count();

        res.status(200).json(buyers);
    } catch (err: any) {
        console.log('Failed to count users', err);
        return res.status(500).json({ message: 'Something went wrong, Failed to count users' });
    }
};

//Get total number of shops
export const getShops = async (req: AuthRequest, res: Response) => {
    try {
        const stores = await prisma.sellerShop.count();

        res.status(200).json(stores);
    } catch (err: any) {
        console.log('Failed to count stores', err);
        return res.status(500).json({ message: 'Something went wrong, Failed to count Stores' });
    }
};

//Get all active listingd
export const getActiveListing = async (req: AuthRequest, res: Response) => {
    try {
        const listing = await prisma.product.count({ where: { isActive: true}});

        res.status(200).json(listing);
    } catch (err: any) {
        console.log('Failed to count active listing', err);
        return res.status(500).json({ message: 'Something went wrong, Failed to count active listing' });
    }
};

//Fetch activities for admin
export const activities = async (req: AuthRequest, res: Response) => {
    try {
        const activities = await prisma.activities.findMany({
            include: {
                user: {
                    select: {
                        id: true,
                        profile: {
                            select: {
                                name: true
                            }
                        }
                    }
                }
            }
        });
        
        res.status(200).json(activities);
    } catch (err: any) {
        console.error('Something went wrong, failed to fetch activities', err);
        return res.status(500).json({ message: 'Something went wrong, failed to fetch activities'})
    }
};

//Add new admin
export const newadmin = async (req: AuthRequest, res: Response) => {
    const userId = (req.user as JwtPayload)?.id;
    const { email, password, name, role, status } = req.body;
    try {
        //Check if user already axist
        const isExist = await prisma.user.findUnique({ where: { email }})

        const hashedPassword = await bcrypt.hash(password, 10);

        if (!isExist) {
            await prisma.user.create({
                data: {
                    email, password: hashedPassword,
                    profile: {
                        create: {
                        name, role, status
                        }
                    }
                }
            })
            await resend.emails.send({
        from: "no-reply@alabamarket.com",
        to: email,
        subject: "New Invite",
        html: `<p>You have been invited to be one of the admin at Alabamarket, please <a href="www.alabamarket.com">Click Here</a> sign in now and update your password, <br/>
        Your Login details: <br/>
        Email: <b>${email} <br/>
        Password: <b>${password}</b> <br/>
        Please Ignore if this mail is not for you.</p>`
      });
            res.status(200).json({message: 'New admin invited successfully'})
        }
        if (isExist) {
            // upgrade to admin if user already exist
            await prisma.user.update({ where: { email },
                data: {
                    profile: {
                        update: {
                            role
                        }
                    }
                }
        })
        await resend.emails.send({
        from: "no-reply@alabamarket.com",
        to: email,
        subject: "New Invite",
        html: `<p>You have been invited to be one of the admin at Alabamarket, and your new role is ${role} </p>`
        });

        const message = 'New user has been invited to be an admin';
        const type = 'User Activity';
        await prisma.notification.create({
            data: {
                userId, message, type
            }
        })
        
         res.status(200).json({message: 'New admin added successfully'})
        }
    } catch (err: any) {
        console.error('Something went wrong, failed to add new admin', err)
        return res.status(500).json({message: 'Something went wrong, failed to add or upgrade user new admin'})
    }
}


//Fetch all buyers
export const GetBuyers = async (req: AuthRequest, res: Response) => {
    try {
        const role = 'Buyer';
        const buyers = await prisma.profile.findMany({
            where: { role: role },
            include: {
                user: {
                    select: {
                        id: true, email: true, phone: true, createdAt: true
                    }
                }
            }
        })

        res.status(200).json(buyers);
    } catch (err: any) {
        console.log('Failed to select buyers', err);
        return res.status(500).json({ message: 'Something went wrong, Failed to select buyers' });
    }
};

//Fetch all sellers
export const Getsellers = async (req: AuthRequest, res: Response) => {
    try {
        const role = 'Seller';
        const sellers = await prisma.user.findMany({
            where: {
                profile: {
                    role: role
                }
            },
            select: {
                id: true,
                createdAt: true,
                profile: {
                    select: {
                        name: true,
                        status: true
                    }
                },
                sellerShop: {
                    select: {
                        id: true,
                        storeName: true,
                        product: {
                            select: {
                                id: true,
                                name: true,
                            },
                        },
                        _count: {
                            select: {
                                product: true,     // count products per shop
                            },
                        },
                    }
                }
            }
        });
        res.status(200).json(sellers);
    } catch (err: any) {
        console.log('Failed to select buyers', err);
        return res.status(500).json({ message: 'Something went wrong, Failed to select buyers' });
    }
};


//Delete Buyer
export const DeleteUser = async (req: AuthRequest, res: Response) => {
    const adminId = (req.user as JwtPayload)?.id;
    const customerId = req.params.customerId;

    try {
        const admin = await prisma.user.findFirst({
            where: { id: adminId },
            include: {
                profile: {
                    select: { role: true }
                }
            }
        });

        if (!admin || admin.profile?.role !== 'Admin') {
            console.log('Not authorized, only availabele for admin');
            return res.status(404).json({ message: "Unauthorized, Only available for admin" });
        }

        await prisma.user.delete({ where: { id: customerId } });

        res.status(200).json({ message: 'Customer Deleted successfully' });
    } catch (err: any) {
        console.error('Failed to delete customer', err);
        return res.status(500).json({ message: 'Something went wrong, failed to delete user' });
    }
};


//Update user infomation
export const UpdateUser = async (req: AuthRequest, res: Response) => {
    const { email, name, phoneNumber, role } = req.body;
    const customerId = req.params.customerId;
    try {
        await prisma.user.update({
            where: { id: customerId },
            data: {
                email: email, phone: phoneNumber,
                profile: {
                    update: {
                        name: name, role: role
                    }
                }
            }
        })

        res.status(200).json({ message: 'User Infomation updated successfully' });
    } catch (err: any) {
        console.error('Soemthing went wrong, failed to update user infomation');
    }
};


//Update seller's infomation
export const UpdateSellers = async (req: AuthRequest, res: Response) => {
    const { status, isVerified, storeName, email, name, phoneNumber } = req.body;
    const customerId = req.params.customerId;
    try {
        await prisma.user.update({
            where: { id: customerId },
            data: {
                email: email, phone: phoneNumber,
                profile: {
                    update: {
                        name: name,
                        status: status,
                        isVerified: isVerified
                    }
                },
                sellerShop: {
                    update: {
                        where: {userId: customerId},
                        data: {
                        storeName: storeName,
                        }
                    }
                }
            }
        })

        res.status(200).json({ message: 'User Infomation updated successfully' });
    } catch (err: any) {
        console.error('Soemthing went wrong, failed to update user infomation');
    }
};


//Get seller's rating
export const SellerRating = async (req: AuthRequest, res: Response) => {
  const sellerId = req.params.sellerId;

  try {
    const rating = await prisma.sellerRating.findMany({  where: { userId: sellerId }, 
    include: {
        customer: {
            select: {
                id: true,
                profile: {
                    select: {
                        profile_pic: true,
                        name: true
                    }
                }
            }
        }
    }
    })

    res.status(200).json(rating)
  } catch (err: any) {
    console.error('Failed to select sellers rating', err)
    return res.status(500).json({message: 'Failed to select sellers rating'});
  }
};

//Get store activities
export const StoreActivities = async (req: AuthRequest, res: Response) => {
    const sellerId = req.params.sellerId;
    try {
        const activities = await prisma.storeActivities.findMany({ where: {userId: sellerId}, 
            include: {
                user: {
                    select: {
                        id: true,
                        profile: {
                            select: {
                                role: true
                            }
                        }
                    }
                }
            }
    })
    res.status(200).json(activities)
        }
     catch (err: any) {
        console.log('Failed to select shop activities')
    }
};


// Update user role
export const updateUserRoleToSeller = async (req: AuthRequest, res: Response) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({ message: 'Email is required' });
    }

    await prisma.user.update({
      where: { email },
      data: { 
        profile: {
            upsert: {
                create: { role: 'Seller' },
                update: { role: 'Seller' },
            }
        }
      },
    });

    res.status(200).json({
      message: 'Role updated to Seller successfully'
    });
  } catch (err: any) {
      console.error('Internal server error', err)
    res.status(500).json({ message: 'Internal server error' });
  }
};

//Send Payment reminder
export const paymentReminder = async (req: AuthRequest, res: Response) => {
    const message = req.body.message;
    const userId = (req.user as JwtPayload)?.id;
    const receiverId = req.params.receiverId as string;
    const type = 'Campaign and ads';
    try {
        await prisma.notification.create({
            data: {
                userId, message, receiverId, type
            }
        })

        res.status(200).json({ message: 'Payment notification sent successfully'})
    } catch (err: any) {
        console.error('Something went wrong, Failed to create notification', err)
        return res.status(500).json({ message: 'Something went wrong, Failed to create notification'})
    }
}