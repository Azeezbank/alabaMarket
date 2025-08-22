import { Response, Request } from "express";
import { JwtPayload } from "jsonwebtoken";
import prisma from '../../prisma.client.js';
import { AuthRequest } from "../../middlewares/auth.middleware.js";
import { imagekit } from '../../service/Imagekit.js';
import { Param } from "@prisma/client/runtime/library.js";


//Create product details
export const productDetails = async (req: AuthRequest, res: Response) => {
  const userId = (req.user as JwtPayload)?.id;
  const shopId = req.params.shopId;
  const { name } = req.body;
  try {
    const files = req.files as { [fieldname: string]: Express.Multer.File[] };

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
        productPhoto: {
          create: [{
            url: uploadedImage.url,
          }]
        },
        productVideo: {
          create: [{
            url: uploadedVideo.url
          }]
        }
      },
      include: {
        productPhoto: true, productVideo: true
      }
    })
    res.status(200).json({ message: 'product details inserted', newProduct })
  } catch (err: any) {
    console.error('Something went wrong, Failed to insert dedails', err)
    return res.status(500).json({ message: 'Something went wrong, Failed to insert dedails' })
  }
};

//Update product pricing
export const productPricing = async (req: AuthRequest, res: Response) => {
  const { price, priceStatus, condition, description } = req.body;
  const productId = req.query.productId as string;
  try {
    await prisma.product.update({
      where: { id: productId },
      data: {
        productPricing: {
          update: {
            price, priceStatus, condition, description
          }
        }
      }
    })

    res.status(200).json({ message: "Pricing updated" });
  } catch (err: any) {
    console.error('Failed to update pricing', err)
    return res.status(500).json({ message: 'Something went wrong, failed to update pricing' })
  }
}

//fetch all category 
export const allproductCategory = async (req: AuthRequest, res: Response) => {
  try {
    const category = await prisma.category.findMany({
      select: {
        id: true, name: true
      }
    })
    res.status(200).json(category)
  } catch (err: any) {
    console.error('Failed to select category', err)
    return res.status(500).json({ message: 'Something went wrong, failed to select product category' })
  }
}

//Fetch sub category
export const productSubCategory = async (req: AuthRequest, res: Response) => {
  const categoryId = req.params.categoryId;
  try {
    const subCategory = await prisma.subCategory.findMany({
      where: { categoryId },
      select: {
        id: true, name: true
      }
    })
    res.status(200).json(subCategory)
  } catch (err: any) {
    console.error('Failed to select sub category', err)
    return res.status(500).json({ message: 'Something went wrong, failed to select sub product category' })
  }
}

//update category
export const updateProductcategory = async (req: AuthRequest, res: Response) => {
  const { categoryId, subCategoryId } = req.params;
  const productId = req.query.productId as string
  try {
    const category = await prisma.category.findUnique({
      where: { id: categoryId },
      select: {
        name: true
      }
    })

    const subCategory = await prisma.subCategory.findUnique({
      where: { id: subCategoryId },
      select: {
        name: true
      }
    })

    const categoryName = category?.name ?? null;
    const subCategoryName = subCategory?.name ?? null;

    await prisma.product.update({
      where: { id: productId },
      data: {
        categoryName, subCategoryName
      }
    })
    res.status(200).json({ message: 'Smething went wrong, Failed to update product category' })
  } catch (err: any) {
    console.error('Smething went wrong, Failed to update product category', err)
    return res.status(500).json({ message: 'Smething went wrong, Failed to update product category' })
  }
}

//update product promotion
export const productPromotion = async (req: AuthRequest, res: Response) => {
  const listingPromotion = req.body.listingPromotion;
  const productId = req.query.productId as string
  try {
    await prisma.product.update({
      where: { id: productId },
      data: {
        listingPromotion
      }
    })

    res.status(200).json({ message: 'Promotion updated' })
  } catch (err: any) {
    console.log('Failed to update promotion', err)
    return res.status(500).json({ message: 'Something went wrong, Faiked to update promotion' })
  }
};



//Fetch all seller listings including the shop details
export const FetchSellerListings = async (req: AuthRequest, res: Response) => {
  const userId = (req.user as JwtPayload)?.id;

  // Parse pagination query params with defaults
  const page = parseInt(req.query.page as string) || 1;
  const limit = parseInt(req.query.limit as string) || 10;
  const skip = (page - 1) * limit;

  try {
    // Get total count
    const total = await prisma.product.count({ where: { userId } });

    // Fetch paginated products
    const products = await prisma.product.findMany({
      where: {
        userId, shop: {
          isActive: true // Only from active shops
        }
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
  } catch (err: any) {
    console.error("Error fetching product listings:", err);
    res.status(500).json({ message: "Failed to fetch seller's product listings" });
  }
};



//Edit product or listing
export const EditSellerListing = async (req: AuthRequest, res: Response) => {
  const userId = (req.user as JwtPayload)?.id;
  const { productId, categoryId, subCategoryId } = req.params; // or req.body.productId
  const { name, condition, price, priceStatus, description, categoryName,  subCategoryName } = req.body;

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
  } catch (err: any) {
    console.error("Error updating product listing:", err);
    res.status(500).json({ message: "Failed to update product listing" });
  }
};


//Delete product or listing
export const DeleteSellerListing = async (req: AuthRequest, res: Response) => {
  const userId = (req.user as JwtPayload)?.id;
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
  } catch (err: any) {
    console.error("Error deleting product listing:", err);
    res.status(500).json({ message: "Failed to delete product listing" });
  }
};


// Pause or unpause a product listing
export const PauseSellerListing = async (req: AuthRequest, res: Response) => {
  const userId = (req.user as JwtPayload)?.id;
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
  } catch (err: any) {
    console.error("Error updating product listing pause status:", err);
    res.status(500).json({ message: "Failed to update product listing pause status" });
  }
};

//Select Active listing
export const activeListing = async (req: AuthRequest, res: Response) => {
  try {
    const activeListing = await prisma.product.findMany({
      where: { isActive: true }
    })

    res.status(200).json(activeListing)
  } catch (err: any) {
    console.error('Something went wrong, Failed to select active listen', err)
    return res.status(500).json({ message: 'Something went wrong' })
  }
};

//Selct all boost plan
export const BoostPlans = async (req: AuthRequest, res: Response) => {
  try {
    const plans = await prisma.boostPackages.findMany({
      select: {
        id: true, plan: true,
        boostPackagesDetails: {
          select: {
            id: true, duration: true, price: true, status: true
          }
        }
      }
    })

    res.status(200).json(plans)
  } catch (err: any) {
    console.error('Failed to select plan', err)
    return res.status(500).json({ message: 'Failed to select plan' })
  }
};

//Select boost plan details
export const boostDetails = async (req: AuthRequest, res: Response) => {
  const { plan } = req.body;
  try {
    const boostPlanDetails = await prisma.boostPackages.findMany({ where: {plan},
      select: {
        id: true, type: true,  placement: true,
        boostPackagesDetails: {
          select: {
            duration: true, price: true, status: true
          }
        }
      }
    })

    res.status(200).json(boostPlanDetails)
  } catch (err: any) {
    console.error('Failed to select plan details', err)
    return res.status(500).json({ message: 'Failed to select plan details' })
  }
};


//Boost Ad
export const createBoostAd = async (req: AuthRequest, res: Response) => {
  const productId = req.params.productId;
  const userId = (req.user as JwtPayload)?.id;
  const { productName, plan, type, period, price, placement } = req.body;
  try {
    await prisma.boostAd.create({
      data: {
        productId, userId, productName, plan, type, period, price, placement
      }
    });

    const message = "You have new submission for Boost Ad";
    const typeOfNotification = 'Boosted Ad';
    await prisma.notification.create({
      data: {
        senderId: userId, message, type: typeOfNotification,
      }
    })
    res.status(200).json({ message: 'Boost Submitted For Reviews' })
  } catch (err: any) {
    console.error('Something went wrong, Failed to submit boosting', err)
    return res.status(500).json({ message: 'Something went wrong, Failed to submit boosting' })
  }
};

//Select sellers Boost adds
export const fetchBoostAd = async (req: AuthRequest, res: Response) => {
  const userId = (req.user as JwtPayload)?.id;

  try {
    const sellerBoost = await prisma.boostAd.findMany({
      where: { userId },
    });

    res.status(200).json(sellerBoost)
  } catch (err: any) {
    console.error('Something went wrong, Failed to select boosting', err)
    return res.status(500).json({ message: 'Something went wrong, Failed to select boosting' })
  }
};