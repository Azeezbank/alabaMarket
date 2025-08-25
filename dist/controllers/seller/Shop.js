import prisma from "../../prisma.client.js";
import { imagekit } from '../../service/Imagekit.js';
import redis from "../../config/redisClient.js";
export const createShop = async (req, res) => {
    const userId = req.user?.id;
    try {
        if (!req.file) {
            return res.status(400).json({ message: "No file uploaded" });
        }
        // Upload file buffer to ImageKit
        const result = await imagekit.upload({
            file: req.file.buffer,
            fileName: req.file.originalname,
            folder: "/uploads/seller_shop",
        });
        // Extract additional form fields
        const { storeName, description, storeAddress, most_sell, phoneNumber } = req.body;
        // Save to DB
        const savedRecord = await prisma.sellerShop.create({
            data: {
                storeName,
                logo: result.url,
                description,
                storeAddress,
                most_sell,
                phoneNumber,
                userId: userId,
                createdAt: new Date()
            },
        });
        res.status(201).json({
            message: "File uploaded and saved successfully",
            data: savedRecord,
        });
    }
    catch (error) {
        console.error("Failed to create shop", error);
        return res.status(500).json({ message: "Failed to create shop" });
    }
};
//Fetch shop details
export const getShopdetails = async (req, res) => {
    try {
        let cachedStores;
        try {
            cachedStores = await redis.get("shop_details");
        }
        catch (redisErr) {
            console.warn("Redis unavailable, fetching from DB", redisErr);
        }
        if (cachedStores) {
            console.log('Fetched from redis');
            return res.status(200).json(JSON.parse(cachedStores));
        }
        // Get all stores with owner's name
        const stores = await prisma.sellerShop.findMany({
            include: {
                user: {
                    select: {
                        email: true,
                    }
                }
            }
        });
        try {
            await redis.set("shop_details", JSON.stringify(stores), "EX", 300);
        }
        catch (redisErr) {
            console.warn("Failed to cache in Redis", redisErr);
        }
        res.status(200).json(stores);
    }
    catch (err) {
        console.error("Error fetching shop details:", err);
        return res.status(500).json({ message: "Failed to fetch shop details" });
    }
};
// Update shop details
export const updateShopDetails = async (req, res) => {
    const userId = req.user?.id;
    const { storeOwner, storeName, storeAddress, storeEmail, phoneNumber } = req.body;
    try {
        let logoUrl;
        if (req.file) {
            // Upload file buffer to ImageKit only if a file is provided
            const result = await imagekit.upload({
                file: req.file.buffer,
                fileName: req.file.originalname,
                folder: "/uploads/seller_shop",
            });
            logoUrl = result.url;
        }
        const updatedStore = await prisma.sellerShop.update({
            where: { userId: userId },
            data: {
                ...(logoUrl && { logo: logoUrl }), // only update logo if new file is uploaded
                storeName,
                storeAddress,
                storeEmail,
                phoneNumber,
                user: {
                    update: {
                        profile: {
                            update: { name: storeOwner }
                        }
                    }
                }
            }
        });
        res.status(200).json({ mesage: "Shop details updated successfully" });
    }
    catch (err) {
        console.error("Error updating shop details:", err);
        return res.status(500).json({ message: "Failed to update shop details" });
    }
};
//Update shop status
export const updateShopStatus = async (req, res) => {
    const userId = req.user?.id;
    const { isActive } = req.body;
    try {
        const shopStatus = await prisma.sellerShop.update({
            where: { userId, },
            data: { isActive }
        });
        res.status(200).json({ message: "Shop status updated successfully", shopStatus });
    }
    catch (err) {
        console.error("Error updating shop status:", err);
        return res.status(500).json({ message: "Failed to update shop status" });
    }
};
// Delete shop
export const deleteShop = async (req, res) => {
    const userId = req.user?.id;
    try {
        const deletedShop = await prisma.sellerShop.delete({
            where: { userId }
        });
        res.status(200).json({ message: "Shop deleted successfully", deletedShop });
    }
    catch (err) {
        console.error("Error deleting shop:", err);
        return res.status(500).json({ message: "Failed to delete shop" });
    }
};
