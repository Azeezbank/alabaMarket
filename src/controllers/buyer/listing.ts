import { Response, Request } from "express";
import { JwtPayload } from "jsonwebtoken";
import prisma from "../../prisma.client.js";
import { AuthRequest } from "../../middlewares/auth.middleware.js";
import redis from "../../config/redisClient.js";


//Filter listing by name/popular search
export const filterpopularListings = async (req: AuthRequest, res: Response) => {
  const name = req.query.name as string;

  // Parse pagination query params with defaults
  const page = parseInt(req.query.page as string) || 1;
  const limit = parseInt(req.query.limit as string) || 10;
  const skip = (page - 1) * limit;

  const cacheKey = `popular_listings:page=${page}:limit=${limit}`;
  try {
    // Get total count
    const total = await prisma.product.count({ where: { name, isVisible: true, status: 'Approved' } });

    // 1️ Check Redis cache first
    const cachedData = await redis.get(cacheKey);
    if (cachedData) {
      return res.status(200).json(JSON.parse(cachedData));
    }

    // Fetch paginated products
    const products = await prisma.product.findMany({
      where: {
        name, isVisible: true, status: 'Approved'
      },
      include: {
        productPhoto: true,
        productVideo: true,
        productPricing: true,
      },
      orderBy: { createdAt: 'desc' },
      skip,
      take: limit
    });

    const responseData = {
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit),
      products,
    };

    await redis.set(cacheKey, JSON.stringify(responseData), "EX", 300);

    res.status(200).json(responseData);
  } catch (err: any) {
    console.error("Error fetching product listings:", err);
    res.status(500).json({ message: "Failed to fetch product listings" });
  }
};

//Filter listing by price range
export const filterListingsByPriceRange = async (req: AuthRequest, res: Response) => {
  const fromAmount = Number(req.query.fromAmount);
  const toAmount = Number(req.query.toAmount);

  // Parse pagination query params with defaults
  const page = parseInt(req.query.page as string) || 1;
  const limit = parseInt(req.query.limit as string) || 10;
  const skip = (page - 1) * limit;

const cacheKey = `active_seller_listings:page=${page}:limit=${limit}`;
  try {
    // 1️ Check Redis cache first
    const cachedData = await redis.get(cacheKey);
    if (cachedData) {
      return res.status(200).json(JSON.parse(cachedData));
    }

    // Get total count
    const total = await prisma.product.count({
      where: {
        status: 'Approved', isVisible: true, productPricing: {
          price: {
            gte: fromAmount,
            lte: toAmount
          }
        }
      }
    });

    // Fetch paginated products
    const products = await prisma.product.findMany({
      where: {
        isActive: true, productPricing: {
          price: {
            gte: fromAmount,
            lte: toAmount
          }
        }
      },
      include: {
        productPhoto: true,
        productVideo: true,
        productPricing: true
      },
      orderBy: { createdAt: 'desc' },
      skip,
      take: limit
    });

    const responseData = {
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit),
      products,
    };

    await redis.set(cacheKey, JSON.stringify(responseData), "EX", 300);

    res.status(200).json(responseData);
  } catch (err: any) {
    console.error("Error fetching product listings:", err);
    res.status(500).json({ message: "Failed to fetch product listings" });
  }
};

//Filter listeing by price less than
export const filterListingsByLessPrice = async (req: AuthRequest, res: Response) => {
  const lessThan = Number(req.query.fromAmount);

  // Parse pagination query params with defaults
  const page = parseInt(req.query.page as string) || 1;
  const limit = parseInt(req.query.limit as string) || 10;
  const skip = (page - 1) * limit;

  try {
    // Get total count
    const total = await prisma.product.count({
      where: {
        isVisible: true, status: 'Approved', productPricing: {
          price: {
            lte: lessThan
          }
        }
      }
    });

    // Fetch paginated products
    const products = await prisma.product.findMany({
      where: {
        isVisible: true, status: 'Approved', productPricing: {
          price: {
            lte: lessThan
          }
        }
      },
      include: {
        productPhoto: true,
        productVideo: true,
        productPricing: true,
      },
      orderBy: { createdAt: 'desc' },
      skip,
      take: limit
    });

    res.status(200).json({ page, limit, total, totalPages: Math.ceil(total / limit), products });
  } catch (err: any) {
    console.error("Error fetching product listings:", err);
    res.status(500).json({ message: "Failed to fetch product listings" });
  }
};

//Filter listing by price greater than 
export const filterListingsByGreaterPrice = async (req: AuthRequest, res: Response) => {
  const greaterThan = Number(req.query.fromAmount);

  // Parse pagination query params with defaults
  const page = parseInt(req.query.page as string) || 1;
  const limit = parseInt(req.query.limit as string) || 10;
  const skip = (page - 1) * limit;

  try {
    // Get total count
    const total = await prisma.product.count({
      where: { isVisible: true, status: 'Approved',
        productPricing: {
          price: {
            gte: greaterThan
          }
        }
      }
    });

    // Fetch paginated products
    const products = await prisma.product.findMany({
      where: {
        isVisible: true, status: 'Approved', productPricing: {
          price: {
            gte: greaterThan
          }
        }
      },
      include: {
        productPhoto: true,
        productVideo: true,
        productPricing: true,
      },
      orderBy: { createdAt: 'desc' },
      skip,
      take: limit
    });

    res.status(200).json({ page, limit, total, totalPages: Math.ceil(total / limit), products });
  } catch (err: any) {
    console.error("Error fetching product listings:", err);
    res.status(500).json({ message: "Failed to fetch product listings" });
  }
};


// //fetch all products active or no active
// export const FetchAllSellerListings = async (req: AuthRequest, res: Response) => {

//   // Parse pagination query params with defaults
//   const page = parseInt(req.query.page as string) || 1;
//   const limit = parseInt(req.query.limit as string) || 10;
//   const skip = (page - 1) * limit;

//   try {
//     // Get total count
//     const total = await prisma.product.count();

//     // Fetch paginated products
//     const products = await prisma.product.findMany({
//       where: { isActive: true },
//       include: {
//         productPhoto: true,
//         productVideo: true,
//         productPricing: true
//       },
//       orderBy: { createdAt: 'desc' },
//       skip,
//       take: limit
//     });

//     res.status(200).json({ page, limit, total, totalPages: Math.ceil(total / limit), products });
//   } catch (err: any) {
//     console.error("Error fetching product listings:", err);
//     res.status(500).json({ message: "Failed to fetch product listings" });
//   }
// };

//Fetch listing from verified seller
export const fetchVerifiedSellerListing = async (req: AuthRequest, res: Response) => {

  // Parse pagination query params with defaults
  const page = parseInt(req.query.page as string) || 1;
  const limit = parseInt(req.query.limit as string) || 10;
  const skip = (page - 1) * limit;

  const cacheKey = `active_seller_listings:page=${page}:limit=${limit}`;

  try {
    // Get total count
    const total = await prisma.product.count({ where: { isVisible: true, status: 'Approved', user: { sellerVerification: { isVerified: true } } } });

    // 1️ Check Redis cache first
    const cachedData = await redis.get(cacheKey);
    if (cachedData) {
      return res.status(200).json(JSON.parse(cachedData));
    }

    // Fetch paginated products
    const products = await prisma.product.findMany({
      where: { isVisible: true, status: 'Approved', user: { sellerVerification: { isVerified: true } } },
      include: {
        productPhoto: true,
        productVideo: true,
        productPricing: true,
      },
      orderBy: { createdAt: 'desc' },
      skip,
      take: limit
    });

    const responseData = {
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit),
      products,
    };

    await redis.set(cacheKey, JSON.stringify(responseData), "EX", 300);

    res.status(200).json(responseData);
  } catch (err: any) {
    console.error("Error fetching product listings:", err);
    res.status(500).json({ message: "Failed to fetch product listings" });
  }
};

//Fecth unverified user listing
export const fetchUnverifiedSellerListing = async (req: AuthRequest, res: Response) => {

  // Parse pagination query params with defaults
  const page = parseInt(req.query.page as string) || 1;
  const limit = parseInt(req.query.limit as string) || 10;
  const skip = (page - 1) * limit;

  try {
    // Get total count
    const total = await prisma.product.count({ where: { isVisible: true, status: 'Approved', user: { sellerVerification: { isVerified: false } } } });

    // Fetch paginated products
    const products = await prisma.product.findMany({
      where: { isVisible: true, status: 'Approved', user: { sellerVerification: { isVerified: false } } },
      include: {
        productPhoto: true,
        productVideo: true,
        productPricing: true
      },
      orderBy: { createdAt: 'desc' },
      skip,
      take: limit
    });

    res.status(200).json({ page, limit, total, totalPages: Math.ceil(total / limit), products });
  } catch (err: any) {
    console.error("Error fetching product listings:", err);
    res.status(500).json({ message: "Failed to fetch product listings" });
  }
};

//Fectch listing by condition e.g Brand new, Neatly Used
export const fetchSellerListingByCondition = async (req: AuthRequest, res: Response) => {

  // Parse pagination query params with defaults
  const page = parseInt(req.query.page as string) || 1;
  const limit = parseInt(req.query.limit as string) || 10;
  const skip = (page - 1) * limit;
  const condition = req.query.condition as string;

  try {
    // Get total count
    const total = await prisma.product.count({ where: { isVisible: true, status: 'Approved', productPricing: { condition } } });

    // Fetch paginated products
    const products = await prisma.product.findMany({
      where: { isVisible: true, status: 'Approved', productPricing: { condition } },
      include: {
        productPhoto: true,
        productVideo: true,
        productPricing: true,
      },
      orderBy: { createdAt: 'desc' },
      skip,
      take: limit
    });

    res.status(200).json({ page, limit, total, totalPages: Math.ceil(total / limit), products });
  } catch (err: any) {
    console.error("Error fetching product listings:", err);
    res.status(500).json({ message: "Failed to fetch product listings" });
  }
};

//Select listen owner details
export const productOwner = async (req: AuthRequest, res: Response) => {
  const productId = req.params.productId as string;
  try {
    const productOwner = await prisma.product.findFirst({
      where: {
        id: productId, isVisible: true, status: 'Approved',
      },
      include: {
        user: {
          select: {
            id: true,
            profile: {
              select: {
                profile_pic: true,
                isVerified: true
              }
            },
            sellerShop: {
              select: {
                storeName: true
              }
            }
          }
        }
      }
    })

    res.status(200).json(productOwner)
  } catch (err: any) {
    console.error('Something went wrong, Failed to select product owner', err)
    return res.status(500).json({ message: 'Something went wrong, Failed to select product owner' })
  }
}

//Create product report
export const productReport = async (req: AuthRequest, res: Response) => {
  const productId = req.params.productId as string;
  const userId = (req.user as JwtPayload)?.id;
  const { reason, description } = req.body;
  try {
    await prisma.report.create({
      data: {
        productId, userId, reason, description
      }
    })

    res.status(200).json({ message: 'Report submitted successfully' })
  } catch (err: any) {
    console.error('Something went wrong, Failed to submit report', err)
    return res.status(500).json({ message: 'Something went wrong, Failed to submit report' })
  }
}


//bookmark or saved product
export const savedProduct = async (req: AuthRequest, res: Response) => {
  const userId = (req.user as JwtPayload)?.id;
  const productId = req.params.productId as string;
  try {
    await prisma.savedProducts.create({
      data: {
        userId, productId
      }
    })

    res.status(201).json({ message: 'Product saved successfully' })
  } catch (err: any) {
    console.error('Something went wrong, Failed to bookmarked product', err)
    return res.status(500).json({ message: 'Something went wrong, Failed to bookmarked product' })
  }
}

//Fetch all the user bookmarked product
export const getSavedProduct = async (req: AuthRequest, res: Response) => {
  const userId = (req.user as JwtPayload)?.id;
  const page = parseInt(req.query.page as string) || 1;
  const limit = parseInt(req.query.limit as string) || 10;
  const skip = (page - 1) * limit;

  try {
      // Get total count for pagination
    const total = await prisma.savedProducts.count({
      where: { userId, product: { isVisible: true } },
    });

    const savedProduct = await prisma.savedProducts.findMany({
      where: { userId },
      include: {
        product: {
          include: {
            productPhoto: true,
        productVideo: true,
        productPricing: true,
        user: {
          select: {
            id: true,
            profile: {
              select: { profile_pic: true, isVerified: true }
            },
            sellerShop: {
              select: { storeName: true }
            }
          }
        }
          }
        }
      },
      orderBy: { createdAt: 'desc'},
      skip,
      take: limit
    });


    res.status(200).json({ page, limit, total, data: savedProduct });
  } catch (err: any) {
    console.error('Failed to select saved products', err)
    return res.status(500).json({ message: 'Something went wrong, Failed to select saved products' })
  }
};

//Select only non expire, active free and paid boosted listing
export const getActiveListing = async (req: Request, res: Response) => {
  // Parse pagination query params with defaults
  const page = parseInt(req.query.page as string) || 1;
  const limit = parseInt(req.query.limit as string) || 10;
  const skip = (page - 1) * limit;

  const cacheKey = `active_listings:page=${page}:limit=${limit}`;
  try {

       // 1️ Check Redis cache first
    const cachedData = await redis.get(cacheKey);
    if (cachedData) {
      return res.status(200).json(JSON.parse(cachedData));
    }

    const today = new Date();

    const activeBoosts = await prisma.product.findMany({
      where: { isVisible: true, status: "Approved" },
      include: {
        productPhoto: true,
        productVideo: true,
        productPricing: true,
        _count: {
          select: { likes: true, love: true },
        },
        user: {
          select: {
            id: true,
            profile: true, // adjust what you need
          },
        },
      },
      orderBy: { createdAt: 'desc' },
      skip,
      take: limit
    });

    const responseData = {
      page,
      limit,
      activeBoosts,
    };

    await redis.set(cacheKey, JSON.stringify(responseData), "EX", 300);

    res.status(200).json(responseData);
  } catch (err: any) {
    console.error("Failed to fetch active boost ads", err);
    res.status(500).json({ message: "Something went wrong" });
  }
};

// // select listing by boost plan
// export const getActiveListingByPlan = async (req: Request, res: Response) => {
//   // Parse pagination query params with defaults
//   const plan = (req.query.plan as string);
//   const page = parseInt(req.query.page as string) || 1;
//   const limit = parseInt(req.query.limit as string) || 10;
//   const skip = (page - 1) * limit;

//   const cacheKey = `active_boostedplan=${plan}:page=${page}:limit=${limit}`;
//   try {

//        // 1️ Check Redis cache first
//     const cachedData = await redis.get(cacheKey);
//     if (cachedData) {
//       return res.status(200).json(JSON.parse(cachedData));
//     }

//     const today = new Date();

//     const activePaidBoosts = await prisma.boostAd.findMany({
//       where: {
//         endDate: {
//           gte: today, // not expired yet
//         },
//         status: "Active", // optional: only approved ones
//         plan,
//         product: {
//     status: "Approved",              // only active products
//   },
//       },
//       include: {
//         product: {
//         include: {
//         productPhoto: true,
//         productVideo: true,
//         productPricing: true,
//         _count: {
//           select: { likes: true, love: true },
//         },
//         user: {
//           select: {
//             id: true,
//             profile: true, // adjust what you need
//           },
//         },
//       },
//       },
//       },
//       orderBy: { createdAt: 'desc' },
//       skip,
//       take: limit
//     });

//     const responseData = {
//       page,
//       limit,
//       activePaidBoosts
//     };

//     await redis.set(cacheKey, JSON.stringify(responseData), "EX", 300);

//     res.status(200).json(responseData);
//   } catch (err: any) {
//     console.error("Failed to fetch active boost ads", err);
//     res.status(500).json({ message: "Something went wrong" });
//   }
// };


//Select all free listing
// export const getActiveFreeListing = async (req: Request, res: Response) => {
//   // Parse pagination query params with defaults
//   const plan = 'Free'
//   const page = parseInt(req.query.page as string) || 1;
//   const limit = parseInt(req.query.limit as string) || 10;
//   const skip = (page - 1) * limit;

//   const cacheKey = `active_freeboostedplan=${plan}:page=${page}:limit=${limit}`;
//   try {

//        // 1️ Check Redis cache first
//     const cachedData = await redis.get(cacheKey);
//     if (cachedData) {
//       return res.status(200).json(JSON.parse(cachedData));
//     }

//     const today = new Date();

//     const activePaidBoosts = await prisma.boostAd.findMany({
//       where: {
//         endDate: {
//           gte: today, // not expired yet
//         },
//         status: "Active", // optional: only approved ones
//         type: plan,
//         product: {
//     status: "Approved",              // only active products
//   },
//       },
//       include: {
//         product: {
//         include: {
//         productPhoto: true,
//         productVideo: true,
//         productPricing: true,
//         _count: {
//           select: { likes: true, love: true },
//         },
//         user: {
//           select: {
//             id: true,
//             profile: true, // adjust what you need
//           },
//         },
//       },
//       },
//       },
//       orderBy: { createdAt: 'desc' },
//       skip,
//       take: limit
//     });

//     const responseData = {
//       page,
//       limit,
//       activePaidBoosts
//     };

//     await redis.set(cacheKey, JSON.stringify(responseData), "EX", 300);

//     res.status(200).json(responseData);
//   } catch (err: any) {
//     console.error("Failed to fetch active boost ads", err);
//     res.status(500).json({ message: "Something went wrong" });
//   }
// };