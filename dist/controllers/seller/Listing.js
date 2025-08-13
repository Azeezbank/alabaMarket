import prisma from '../../prisma.client.js';
import { imagekit } from '../../service/Imagekit.js';
export const SellerListing = async (req, res) => {
    const userId = req.user?.id;
    const shopId = req.params.shopId;
    const { name, condition, price, priceStatus, description, mainCategory, subCategory } = req.body;
    try {
        const files = req.files;
        // Upload image
        const uploadedImage = await imagekit.upload({
            file: files.productImage[0].buffer,
            fileName: files.productImage[0].originalname,
            folder: "/uploads/productImage"
        });
        // Upload video
        const uploadedVideo = await imagekit.upload({
            file: files.productVideo[0].buffer,
            fileName: files.productVideo[0].originalname,
            folder: "/uploads/productVideo"
        });
        const newProduct = await prisma.product.create({
            data: {
                name,
                userId,
                shopId,
                //Product image
                photos: {
                    create: [
                        {
                            url: uploadedImage.url, // from ImageKit
                        }
                    ]
                },
                // Product Videos
                video: {
                    create: [
                        {
                            url: uploadedVideo.url, // from ImageKit
                        }
                    ]
                },
                // Product Pricing
                pricing: {
                    create: {
                        price,
                        priceStatus,
                        condition,
                        description
                    }
                },
                // Product Category (relation)
                productCategory: {
                    create: {
                        mainCategory,
                        subCategory
                    }
                },
            },
            include: {
                productCategory: true,
                photos: true,
                video: true,
                pricing: true
            }
        });
        res.status(201).json({ message: 'Product listing successful' });
    }
    catch (err) {
        console.error("Error creating product listing:", err);
        return res.status(500).json({ message: "Failed to create product listing" });
    }
};
//Fetch all seller listings
export const FetchSellerListings = async (req, res) => {
    const userId = req.user?.id;
    // Parse pagination query params with defaults
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;
    try {
        // Get total count
        const total = await prisma.product.count({ where: { userId } });
        // Fetch paginated products
        const products = await prisma.product.findMany({
            where: { userId, shop: {
                    isActive: true // Only from active shops
                } },
            include: {
                photos: true,
                video: true,
                pricing: true,
                productCategory: true
            },
            orderBy: { createdAt: 'desc' },
            skip,
            take: limit
        });
        res.status(200).json({ page, limit, total, totalPages: Math.ceil(total / limit), products });
    }
    catch (err) {
        console.error("Error fetching product listings:", err);
        res.status(500).json({ message: "Failed to fetch product listings" });
    }
};
//Edit product or listing
export const EditSellerListing = async (req, res) => {
    const userId = req.user?.id;
    const productId = req.params.id; // or req.body.productId
    const { name, condition, price, priceStatus, description, mainCategory, subCategory } = req.body;
    try {
        // Find existing product, verify ownership
        const existingProduct = await prisma.product.findFirst({
            where: { id: productId },
            include: { photos: true, video: true, pricing: true, productCategory: true }
        });
        if (!existingProduct) {
            return res.status(404).json({ message: "Product not found" });
        }
        if (existingProduct.userId !== userId) {
            return res.status(403).json({ message: "Not authorized to edit this product" });
        }
        const files = req.files;
        // Handle new image upload if provided
        let uploadedImageUrl = existingProduct.photos[0]?.url;
        if (files?.productImage?.length) {
            const uploadedImage = await imagekit.upload({
                file: files.productImage[0].buffer,
                fileName: files.productImage[0].originalname,
                folder: "/uploads/productImage"
            });
            uploadedImageUrl = uploadedImage.url;
            // Optionally delete old image from ImageKit here
        }
        // Handle new video upload if provided
        let uploadedVideoUrl = existingProduct.video[0]?.url;
        if (files?.productVideo?.length) {
            const uploadedVideo = await imagekit.upload({
                file: files.productVideo[0].buffer,
                fileName: files.productVideo[0].originalname,
                folder: "/uploads/productVideo"
            });
            uploadedVideoUrl = uploadedVideo.url;
            // Optionally delete old video from ImageKit here
        }
        // Update product and relations
        const updatedProduct = await prisma.product.update({
            where: { id: productId },
            data: {
                name,
                // Update photos relation
                photos: {
                    updateMany: {
                        where: { productId: productId },
                        data: { url: uploadedImageUrl }
                    }
                },
                // Update video relation
                video: {
                    updateMany: {
                        where: { productId: productId },
                        data: { url: uploadedVideoUrl }
                    }
                },
                // Update pricing relation
                pricing: {
                    update: {
                        price,
                        priceStatus,
                        condition,
                        description
                    }
                },
                // Update product category relation
                productCategory: {
                    updateMany: {
                        where: { productId: productId },
                        data: {
                            mainCategory,
                            subCategory
                        }
                    }
                }
            },
            include: {
                productCategory: true,
                photos: true,
                video: true,
                pricing: true
            }
        });
        res.status(200).json({ message: "Product listing updated successfully", updatedProduct });
    }
    catch (err) {
        console.error("Error updating product listing:", err);
        res.status(500).json({ message: "Failed to update product listing" });
    }
};
//Delete product or listing
export const DeleteSellerListing = async (req, res) => {
    const userId = req.user?.id;
    const productId = req.params.id; // or req.body.productId
    try {
        const existingProduct = await prisma.product.findFirst({
            where: { id: productId }
        });
        if (!existingProduct) {
            return res.status(404).json({ message: "Product not found" });
        }
        if (existingProduct.userId !== userId) {
            return res.status(403).json({ message: "Not authorized to delete this product" });
        }
        // Optionally: delete images/videos from ImageKit here
        await prisma.product.delete({
            where: { id: productId }
        });
        res.status(200).json({ message: "Product listing deleted successfully" });
    }
    catch (err) {
        console.error("Error deleting product listing:", err);
        res.status(500).json({ message: "Failed to delete product listing" });
    }
};
// Pause or unpause a product listing
export const PauseSellerListing = async (req, res) => {
    const userId = req.user?.id;
    const productId = req.params.id; // or req.body.productId
    try {
        const existingProduct = await prisma.product.findFirst({
            where: { id: productId }
        });
        if (!existingProduct) {
            console.error("Product not found");
            return res.status(404).json({ message: "Product not found" });
        }
        if (existingProduct.userId !== userId) {
            console.error("Not authorized to pause this product");
            return res.status(403).json({ message: "Not authorized to pause this product" });
        }
        const updatedProduct = await prisma.product.update({
            where: { id: productId },
            data: { isPause: !existingProduct.isPause } // Toggle pause status
        });
        res.status(200).json({ message: "Product listing pause status updated", updatedProduct });
    }
    catch (err) {
        console.error("Error updating product listing pause status:", err);
        res.status(500).json({ message: "Failed to update product listing pause status" });
    }
};
