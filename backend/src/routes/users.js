import express from 'express';
import { auth } from '../middleware/auth.js';
import { searchUsers, getUserProfile } from '../controllers/users.js';

const router = express.Router();

router.get('/search', auth, searchUsers);
router.get('/profile/:userId', auth, getUserProfile);

export default router;