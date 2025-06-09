import jwt from 'jsonwebtoken';
import User from '../models/user.model.js';

export const protectRoute = async (req, res, next) => {
    try {
        const token = req.cookies.jwt;
        if (!token) {
            return res.status(401).json({ message: "Unauthorized access, token missing" });
        }
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        if (!decoded || !decoded.userId) {
            return res.status(401).json({ message: "Unauthorized access, invalid token" });
        }
        const user = await User.findById(decoded.userId).select('-password'); // Exclude password from user object
        if (!user) {
            return res.status(401).json({ message: "Unauthorized access, user not found" });
        }
        req.user = user; // Attach user to request object
        next(); // Proceed to the next middleware or route handler
    } catch (error) {
        console.error("Error in protectRoute:", error);
        res.status(500).json({ message: "Internal server error" });
    }
}