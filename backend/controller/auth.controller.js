import { generateTokenAndSetCookie } from "../lib/utlils/generateToken.js";
import User from "../models/user.model.js";
import bcrypt from "bcryptjs";
export const register = async (req, res) => {
    try {
        const { userName, email, country, password, town } = req.body;
        if (!userName || !email || !country || !password || !town) {
            return res.status(400).json({ message: "All fields are required" });
        }
        if (password.length < 6){
            return res.status(400).json({ message: "Password must be at least 6 characters long" });
        }
        if (userName.length < 3){
            return res.status(400).json({ message: "Username must be at least 3 characters long" });
        }
        if (country !== "india"){
            return res.status(400).json({ message: "Country must be india" });
        }
        if (town !== "nellore"){
            return res.status(400).json({ message: "Town must be nellore" });
        }
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ message: "User already exists" });
        }
        const genSalt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, genSalt);
        const newUser = new User({
            userName,
            email,
            country,
            password: hashedPassword,
            town
        });
        if (newUser){
            generateTokenAndSetCookie(newUser._id, res);
            await newUser.save();
            res.status(201).json({ message: "User registered successfully", user: newUser });
        }
    } catch (error) {
        console.error("Error in register:", error);
        res.status(500).json({ message: "Internal server error" });
    }
}

export const login = async (req, res) => {
    try {
        const { email, password } = req.body;
        if (!email || !password) {
            return res.status(400).json({ message: "Email and password are required" });
        }
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(400).json({ message: "Invalid email or password" });
        }
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({ message: "Invalid email or password" });
        }
        generateTokenAndSetCookie(user._id, res);
        res.status(200).json({ message: "Login successful", user });
    } catch (error) {
        console.error("Error in login:", error);
        res.status(500).json({ message: "Internal server error" });
    }
}

export const profile = async (req, res) => {
    try {
        const user = await User.findById(req.user._id).select('-password'); // Exclude password from user object
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }
        res.status(200).json({ user });
    } catch (error) {
        console.error("Error in profile:", error);
        res.status(500).json({ message: "Internal server error" }); 
    }
}

export const logout = async (req, res) => {
    try {
        res.cookie("jwt", "", {maxAge: 0});
        res.status(200).json({ message: "Logged out successfully" });
    } catch (error) {
        console.error("Error in logout:", error);
        res.status(500).json({ message: "Internal server error" });
    }
}