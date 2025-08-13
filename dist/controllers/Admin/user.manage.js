import prisma from "../../prisma.client.js";
//Fetch all buyers
export const GetBuyers = async (req, res) => {
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
        });
        res.status(200).json(buyers);
    }
    catch (err) {
        console.log('Failed to select buyers', err);
        return res.status(500).json({ message: 'Something went wrong, Failed to select buyers' });
    }
};
//Fetch all sellers
export const Getsellers = async (req, res) => {
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
                                product: true, // count products per shop
                            },
                        },
                    }
                }
            }
        });
        res.status(200).json(sellers);
    }
    catch (err) {
        console.log('Failed to select buyers', err);
        return res.status(500).json({ message: 'Something went wrong, Failed to select buyers' });
    }
};
//Delete Buyer
export const DeleteUser = async (req, res) => {
    const adminId = req.user?.id;
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
    }
    catch (err) {
        console.error('Failed to delete customer', err);
        return res.status(500).json({ message: 'Something went wrong, failed to delete user' });
    }
};
//Update user infomation
export const UpdateUser = async (req, res) => {
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
        });
        res.status(200).json({ message: 'User Infomation updated successfully' });
    }
    catch (err) {
        console.error('Soemthing went wrong, failed to update user infomation');
    }
};
//Update seller's infomation
export const UpdateSellers = async (req, res) => {
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
                        where: { userId: customerId },
                        data: {
                            storeName: storeName,
                        }
                    }
                }
            }
        });
        res.status(200).json({ message: 'User Infomation updated successfully' });
    }
    catch (err) {
        console.error('Soemthing went wrong, failed to update user infomation');
    }
};
