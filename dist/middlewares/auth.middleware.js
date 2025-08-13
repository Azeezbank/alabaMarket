import dotenv from 'dotenv';
import jwt from "jsonwebtoken";
dotenv.config();
export const authenticate = (req, res, next) => {
    const token = req.cookies?.token; // Get token from cookies
    if (!token) {
        return res.status(401).json({ message: "Access denied. No token provided." });
    }
    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET); // Verify token
        req.user = decoded; // Attach user payload to request
        next();
    }
    catch (error) {
        return res.status(403).json({ message: "Invalid or expired token." });
    }
};
