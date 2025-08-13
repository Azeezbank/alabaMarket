import prisma from "../../prisma.client.js";
import { imagekit } from '../../service/Imagekit.js';
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
    const { logo, storeName, storeAddress, storeEmail, phoneNumber } = req.body;
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
        const updatedStore = await prisma.sellerShop.update({
            where: { userId: userId },
            data: {
                logo,
                storeName,
                storeAddress,
                storeEmail,
                phoneNumber
            },
            include: {
                user: {
                    include: {
                        profile: {
                            select: { name: true }
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
