import express from 'express';
import { login, logout, profile, register } from '../controller/auth.controller.js';
import { protectRoute } from '../middleware/protectRoute.js';

const router = express.Router();
router.post('/register', register);
router.post('/login', login); // Assuming login is handled by the same controller for now
router.get('/profile', protectRoute, profile);
router.post('/logout', logout); // Assuming logout is a POST request for security reasons
export default router;