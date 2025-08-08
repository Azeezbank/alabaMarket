import express from "express";
import { upload } from "../../middlewares/upload.multer";
import { createShop } from "../../controllers/seller/Shop";
import { authenticate } from "@/middlewares/auth.middleware";

const router = express.Router();

router.post("/create/shop", authenticate, upload.single("file"), createShop);

export default router;