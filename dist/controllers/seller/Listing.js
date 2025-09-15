import prisma from '../../prisma.client.js';
import { imagekit } from '../../service/Imagekit.js';
import redis from '../../config/redisClient.js';
//Create product details
export const productDetails = async (req, res) => {
    const userId = req.user?.id;
    const shopId = req.params.shopId;
    const { name } = req.body;
    try {
        const files = req.files;
        let uploadedImage;
        let uploadedVideo;
        // Upload image if provided
        if (files?.productImage?.[0]) {
            uploadedImage = await imagekit.upload({
                file: files.productImage[0].buffer,
                fileName: files.productImage[0].originalname,
                folder: "/uploads/productImage"
            });
        }
        // Upload video if provided
        if (files?.productVideo?.[0]) {
            uploadedVideo = await imagekit.upload({
                file: files.productVideo[0].buffer,
                fileName: files.productVideo[0].originalname,
                folder: "/uploads/productVideo"
            });
        }
        const newProduct = await prisma.product.create({
            data: {
                name,
                userId,
                shopId,
                productPhoto: uploadedImage
                    ? {
                        create: [{ url: uploadedImage.url }]
                    }
                    : undefined,
                productVideo: uploadedVideo
                    ? {
                        create: [{ url: uploadedVideo.url }]
                    }
                    : undefined,
            },
            include: {
                productPhoto: true,
                productVideo: true
            }
        });
        res.status(200).json({ message: 'product details inserted', newProduct });
    }
    catch (err) {
        console.error('Something went wrong, Failed to insert details', err);
        return res.status(500).json({ message: 'Something went wrong, Failed to insert dedails' });
    }
};
//Update product pricing
export const productPricing = async (req, res) => {
    const { price, priceStatus, condition, description } = req.body;
    const productId = req.query.productId;
    try {
        await prisma.product.update({
            where: { id: productId },
            data: {
                productPricing: {
                    upsert: {
                        create: {
                            price, priceStatus, condition, description
                        },
                        update: {
                            price, priceStatus, condition, description
                        }
                    }
                }
            }
        });
        res.status(200).json({ message: "Pricing updated" });
    }
    catch (err) {
        console.error('Failed to update pricing', err);
        return res.status(500).json({ message: 'Something went wrong, failed to update pricing' });
    }
};
//fetch all category 
export const allproductCategory = async (req, res) => {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;
    const cachedKey = `category:page=${page}:limit=${limit}`;
    try {
        const total = await prisma.category.count();
        const cachedData = await redis.get(cachedKey);
        if (cachedData) {
            return res.status(200).json(JSON.parse(cachedKey));
        }
        const category = await prisma.category.findMany({
            select: {
                id: true, name: true
            },
            orderBy: { createdAt: 'desc' },
            skip,
            take: limit
        });
        const responseData = {
            total, page, limit, totalPages: Math.ceil(total / limit), category
        };
        await redis.set(cachedKey, JSON.stringify(responseData), "EX", 300);
        res.status(200).json(responseData);
    }
    catch (err) {
        console.error('Failed to select category', err);
        return res.status(500).json({ message: 'Something went wrong, failed to select product category' });
    }
};
//Fetch sub category
export const productSubCategory = async (req, res) => {
    const categoryId = req.params.categoryId;
    try {
        const subCategory = await prisma.subCategory.findMany({
            where: { categoryId },
            select: {
                id: true, name: true
            }
        });
        res.status(200).json(subCategory);
    }
    catch (err) {
        console.error('Failed to select sub category', err);
        return res.status(500).json({ message: 'Something went wrong, failed to select sub product category' });
    }
};
//update category
export const updateProductcategory = async (req, res) => {
    const { categoryId, subCategoryId } = req.params;
    const productId = req.query.productId;
    try {
        const category = await prisma.category.findUnique({
            where: { id: categoryId },
            select: {
                name: true
            }
        });
        const subCategory = await prisma.subCategory.findUnique({
            where: { id: subCategoryId },
            select: {
                name: true
            }
        });
        const categoryName = category?.name ?? null;
        const subCategoryName = subCategory?.name ?? null;
        await prisma.product.update({
            where: { id: productId },
            data: {
                categoryName, subCategoryName, categoryId, subCategoryId
            }
        });
        res.status(200).json({ message: 'Product Category updated successfully' });
    }
    catch (err) {
        console.error('Smething went wrong, Failed to update product category', err);
        return res.status(500).json({ message: 'Smething went wrong, Failed to update product category' });
    }
};
//Fetch seller listing details to populate update for publish
export const FetchSellerListings = async (req, res) => {
    const productId = req.query.productId;
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
            where: {
                userId, id: productId
            },
            include: {
                productPhoto: true,
                productVideo: true,
                productPricing: true,
                user: {
                    select: {
                        createdAt: true,
                        sellerShop: true,
                        sellerVerification: {
                            select: { isVerified: true }
                        }
                    }
                }
            },
            orderBy: { createdAt: 'desc' },
            skip,
            take: limit
        });
        res.status(200).json({ page, limit, total, totalPages: Math.ceil(total / limit), products });
    }
    catch (err) {
        console.error("Error fetching product listings:", err);
        res.status(500).json({ message: "Failed to fetch seller's product listings" });
    }
};
//Fetch all seller's listing
export const FetchAllSellerListings = async (req, res) => {
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
            where: {
                userId
            },
            include: {
                productPhoto: true,
                productVideo: true,
                productPricing: true,
                user: {
                    select: {
                        createdAt: true,
                        sellerShop: {
                            select: {
                                storeName: true,
                            }
                        },
                        sellerVerification: {
                            select: { isVerified: true }
                        }
                    }
                }
            },
            orderBy: { createdAt: 'desc' },
            skip,
            take: limit
        });
        res.status(200).json({ page, limit, total, totalPages: Math.ceil(total / limit), products });
    }
    catch (err) {
        console.error("Error fetching product listings:", err);
        res.status(500).json({ message: "Failed to fetch seller's product listings" });
    }
};
//Edit product or listing
export const EditSellerListing = async (req, res) => {
    const userId = req.user?.id;
    const { productId, categoryId, subCategoryId } = req.params; // or req.body.productId
    const { name, condition, price, priceStatus, description, categoryName, subCategoryName } = req.body;
    try {
        // Find existing product, verify ownership
        const existingProduct = await prisma.product.findFirst({
            where: { id: productId },
        });
        if (!existingProduct) {
            return res.status(404).json({ message: "Product not found" });
        }
        if (existingProduct.userId !== userId) {
            return res.status(403).json({ message: "Not authorized to edit this product" });
        }
        // Update product and relations
        const updatedProduct = await prisma.product.update({
            where: { id: productId },
            data: {
                name,
                categoryName,
                subCategoryName,
                categoryId,
                subCategoryId,
                // Update pricing relation
                productPricing: {
                    update: {
                        price,
                        priceStatus,
                        condition,
                        description
                    }
                },
            },
            include: {
                productPhoto: true,
                productVideo: true,
                productPricing: true
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
        const existingProduct = await prisma.product.findUnique({
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
// //Select Active listing
// export const activeListing = async (req: AuthRequest, res: Response) => {
//   const page = parseInt(req.query.page as string) || 1;
//   const limit = parseInt(req.query.limit as string) || 10;
//   const skip = (page - 1) * limit;
//   const cacheKey = `active_seller_listings:page=${page}:limit=${limit}`;
//   try {
//     const activeListing = await prisma.product.findMany({
//       where: { isActive: true }
//     })
//     res.status(200).json(activeListing)
//   } catch (err: any) {
//     console.error('Something went wrong, Failed to select active listen', err)
//     return res.status(500).json({ message: 'Something went wrong' })
//   }
// };
//Selct all boost plan
// export const BoostPlans = async (req: AuthRequest, res: Response) => {
//   try {
//     const plans = await prisma.boostPackages.findMany({
//       select: {
//         id: true, plan: true,
//         // boostPackagesDetails: {
//         //   select: {
//         //     id: true, duration: true, price: true, status: true
//         //   }
//         // }
//       }
//     })
//     res.status(200).json(plans)
//   } catch (err: any) {
//     console.error('Failed to select plan', err)
//     return res.status(500).json({ message: 'Failed to select plan' })
//   }
// };
//Select boost plan details
// export const boostDetails = async (req: AuthRequest, res: Response) => {
//   const { plan } = req.body;
//   try {
//     const boostPlanDetails = await prisma.boostPackages.findMany({ where: {plan},
//       select: {
//         id: true, type: true,  placement: true,
//         boostPackagesDetails: {
//           select: {
//             duration: true, price: true, status: true
//           }
//         }
//       }
//     })
//     res.status(200).json(boostPlanDetails)
//   } catch (err: any) {
//     console.error('Failed to select plan details', err)
//     return res.status(500).json({ message: 'Failed to select plan details' })
//   }
// };
//Upgrade Boost listing
// export const upgradeListingBoost = async (req: AuthRequest, res: Response) => {
//   const productId = req.params.productId;
//   const userId = (req.user as JwtPayload)?.id;
//   const { productName, plan, period, price, placement } = req.body;
//   try {
//     await prisma.boostAd.update({ where: {productId},
//       data: {
//         productName, plan, type: 'Paid', period, price, placement
//       }
//     });
//     const message = "You have new submission for Boost Ad";
//     const typeOfNotification = 'Boosted Ad';
//     await prisma.notification.create({
//       data: {
//         senderId: userId, message, type: typeOfNotification,
//       }
//     })
//     res.status(200).json({ message: 'Boost Submitted For Reviews' })
//   } catch (err: any) {
//     console.error('Something went wrong, Failed to submit boosting', err)
//     return res.status(500).json({ message: 'Something went wrong, Failed to submit boosting' })
//   }
// };
//Select sellers Boost adds
// export const fetchBoostAd = async (req: AuthRequest, res: Response) => {
//   const userId = (req.user as JwtPayload)?.id;
//   try {
//     const sellerBoost = await prisma.boostAd.findMany({
//       where: { userId },
//     });
//     res.status(200).json(sellerBoost)
//   } catch (err: any) {
//     console.error('Something went wrong, Failed to select boosting', err)
//     return res.status(500).json({ message: 'Something went wrong, Failed to select boosting' })
//   }
// };
// Seller toggles visibility for a product (mark/unmark visible)
export const toggleProductVisibility = async (req, res) => {
    try {
        const { productId } = req.params;
        let { makeVisible } = req.body; // makeVisible: true/false
        const userId = req.user?.id;
        if (typeof makeVisible !== 'boolean') {
            console.log('makeVisible must be a boolean');
            return res.status(400).json({ message: "makeVisible must be a boolean" });
        }
        const product = await prisma.product.findUnique({
            where: { id: productId },
            include: { category: true }
        });
        const productsInCategory = await prisma.product.count({
            where: { categoryId: product?.categoryId, isVisible: true, userId }
        });
        if (!product)
            return res.status(404).json({ message: "product not found" });
        if (product.userId !== userId)
            return res.status(403).json({ message: "not product owner" });
        if (!makeVisible) {
            // unmark visibility
            const updated = await prisma.product.update({
                where: { id: productId },
                data: { isVisible: false, visibleMarkedAt: null },
            });
            return res.json(updated);
        }
        // make visible: check seller's plan and current count
        const seller = await prisma.user.findUnique({
            where: { id: userId },
            include: {
                subscriptionPlan: {
                    include: {
                        maxVisiblePerCat: true
                    }
                }
            },
        });
        if (!seller)
            return res.status(404).json({ message: "seller not found" });
        // determine active plan; if expired or null, default to free plan (find plan named "Free")
        const now = new Date();
        let plan = seller.subscriptionPlan;
        if (!plan || (seller.subscriptionExpiresAt && seller.subscriptionExpiresAt < now)) {
            // treat as Free plan
            plan = await prisma.subscriptionPlan.findFirst({ where: { name: "Free" }, include: { maxVisiblePerCat: true } });
            if (!plan) {
                console.log('No free plan availabel');
                return res.status(500).json({ message: "Free plan not configured in DB" });
            }
        }
        if (!plan.maxVisiblePerCat) {
            console.log('Maximun visible product not set');
            return res.status(400).json({ message: 'Maximun visible product not set' });
        }
        // global visible check
        const currentVisibleCount = await prisma.product.count({
            where: { userId, isVisible: true },
        });
        if (currentVisibleCount >= plan.maxVisibleProducts) {
            return res.status(400).json({
                message: "visible limit reached for your current subscription",
                maxVisible: plan.maxVisibleProducts,
            });
        }
        // per-category check
        // const currentVisibleInCategory = await prisma.product.count({
        //   where: { userId, isVisible: true, categoryId: product.categoryId },
        // });
        if (plan.maxVisiblePerCat && productsInCategory >= plan.maxVisiblePerCat.maxVisible) {
            console.log(`Per-category limit reached. Only ${plan.maxVisiblePerCat?.maxVisible} visible in ${product.category?.name}`);
            return res.status(400).json({
                message: `Per-category limit reached. Only ${plan.maxVisiblePerCat?.maxVisible} visible in ${product.category?.name}`,
            });
        }
        // update product
        const updated = await prisma.product.update({
            where: { id: productId },
            data: { isVisible: true, visibleMarkedAt: new Date() },
        });
        return res.json(updated);
    }
    catch (err) {
        console.error(err);
        return res.status(500).json({ message: "server error" });
    }
};
