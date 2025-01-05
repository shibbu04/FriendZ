import express from 'express';
import { auth } from '../middleware/auth.js';
import {
  sendFriendRequest,
  handleFriendRequest,
  getFriendRecommendations,
  getFriendRequests,
  removeFriend
} from '../controllers/friends.js';

const router = express.Router();

router.post('/request', auth, sendFriendRequest);
router.post('/handle-request', auth, handleFriendRequest);
router.get('/recommendations', auth, getFriendRecommendations);
router.get('/requests', auth, getFriendRequests);
router.delete('/:friendId', auth, removeFriend);

export default router;