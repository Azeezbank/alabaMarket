import { Response, Request } from "express";
import prisma from "../../prisma.client.js";
import { AuthRequest } from "../../middlewares/auth.middleware.js";
import { imagekit } from '../../service/Imagekit.js';

//Create product categories
export const productCategories = async (req: AuthRequest, res: Response) => {
    const { categoryName, status } = req.body;  //The status is boolean true/false

    try {
        if (!req.file) {
            return res.status(400).json({ message: "No file uploaded" });
        }

        // Upload file buffer to ImageKit
        const result = await imagekit.upload({
            file: req.file.buffer,
            fileName: req.file.originalname,
            folder: "/uploads/category",
        });

        let state;

        if (status === 'true') {
            state = true
        } else if (status === 'false') {
            state = false
        } else {
            console.log("Invalid status value. Must be 'true' or 'false'.")
            return res.status(400).json({ message: "Invalid status value. Must be 'true' or 'false'." });
        }

        const data = await prisma.category.create({
            data: {
                image: result.url, name: categoryName, status: state
            }
        })

        res.status(201).json({ message: 'Category created', data })
    } catch (err: any) {
        console.error('Something went wrong, Failed to create category', err)
        return res.status(500).json({ message: 'Something went wrong, Failed to create category' });
    }
}

//Update category
export const updateProductCategories = async (req: AuthRequest, res: Response) => {
    const { categoryName, status } = req.body;  //The status is boolean true/false
    const categoryId = req.params.categoryId as string;

    try {
        if (!req.file) {
            return res.status(400).json({ message: "No file uploaded" });
        }

        // Upload file buffer to ImageKit
        const result = await imagekit.upload({
            file: req.file.buffer,
            fileName: req.file.originalname,
            folder: "/uploads/category",
        });

        await prisma.category.update({
            where: { id: categoryId },
            data: {
                image: result.url, name: categoryName, status
            }
        })

        res.status(200).json({ message: 'Category updated' })
    } catch (err: any) {
        console.error('Something went wrong, Failed to update category', err)
        return res.status(500).json({ message: 'Something went wrong, Failed to update category' });
    }
}

//Fetch all category
export const getCategories = async (req: AuthRequest, res: Response) => {
    try {
        const categories = await prisma.category.findMany({
            select: {
                id: true, image: true, name: true, status: true,
                _count: {
                    select: {
                        subCategory: true,
                        product: true
                    }
                }
            },
        })

        res.status(200).json(categories)
    } catch (err: any) {
        console.error('Something went wrong', err)
        return res.status(500).json({ message: 'Something went wrong, failed to fetch all category' })
    }
};

//Fetch all subcategoty
export const getSubCategories = async (req: AuthRequest, res: Response) => {
    try {
        const subCategories = await prisma.subCategory.findMany({
            select: {
                id: true, name: true, status: true,
                _count: {
                    select: {
                        product: true,
                    }
                },
                category: {
                    select: {
                        name: true
                    }
                }
            }
        })

        res.status(200).json(subCategories)
    } catch (err: any) {
        console.error('Something went wrong', err)
        return res.status(500).json({ message: 'Something went wrong, failed to fetch all category' })
    }
};

//Create sub categories
export const createSubCategories = async (req: AuthRequest, res: Response) => {
    const { parentCategory, name } = req.body;
    try {
        if (!req.file) {
            return res.status(400).json({ message: "No file uploaded" });
        }

        // Upload file buffer to ImageKit
        const result = await imagekit.upload({
            file: req.file.buffer,
            fileName: req.file.originalname,
            folder: "/uploads/subCategory",
        });

        const categoryId = await prisma.category.findFirst({
            where: { name: parentCategory },
            select: {
                id: true
            }
        })

        if (!categoryId) {
            console.log('No categoryId found')
            return res.status(400).json({ message: 'No category id found' })
        }

        const catId = categoryId.id;

        await prisma.subCategory.create({
            data: {
                categoryId: catId, name, image: result.url
            }
        })

        res.status(200).json({ message: 'Sub Category created successfully' })
    } catch (err: any) {
        console.error('Something went wrong', err)
        return res.status(500).json({ message: 'Something went wrong, failed to create sub category' })
    }
};

//Update subCategory
export const updateProductSubCategories = async (req: AuthRequest, res: Response) => {
    const { subCategoryName, status } = req.body;  //The status is boolean true/false
    const subCategoryId = req.params.categoryId as string;

    try {
        if (!req.file) {
            return res.status(400).json({ message: "No file uploaded" });
        }

        // Upload file buffer to ImageKit
        const result = await imagekit.upload({
            file: req.file.buffer,
            fileName: req.file.originalname,
            folder: "/uploads/subCategory",
        });

        await prisma.subCategory.update({
            where: { id: subCategoryId },
            data: {
                name: subCategoryName, image: result.url, status
            }
        })

        res.status(200).json({ message: 'Sub-category updated' })
    } catch (err: any) {
        console.error('Something went wrong, Failed to update sub category', err)
        return res.status(500).json({ message: 'Something went wrong, Failed to update sub category' });
    }
}