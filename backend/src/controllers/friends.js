import User from '../models/User.js';

export const sendFriendRequest = async (req, res) => {
  try {
    const { friendId } = req.body;
    const userId = req.user.id;

    // Check if users exist
    const [user, friend] = await Promise.all([
      User.findById(userId),
      User.findById(friendId)
    ]);

    if (!friend) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Check if request already exists
    const existingRequest = friend.friendRequests.find(
      request => request.from.toString() === userId && request.status === 'pending'
    );

    if (existingRequest) {
      return res.status(400).json({ message: 'Friend request already sent' });
    }

    // Add friend request
    friend.friendRequests.push({
      from: userId,
      status: 'pending'
    });

    await friend.save();
    res.json({ message: 'Friend request sent successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

export const handleFriendRequest = async (req, res) => {
  try {
    const { requestId, action } = req.body;
    const userId = req.user.id;

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    const request = user.friendRequests.id(requestId);
    if (!request) {
      return res.status(404).json({ message: 'Request not found' });
    }

    if (action === 'accept') {
      user.friends.push(request.from);
      const friend = await User.findById(request.from);
      if (friend) {
        friend.friends.push(userId);
        await friend.save();
      }
    }

    request.status = action === 'accept' ? 'accepted' : 'rejected';
    await user.save();

    res.json({ message: `Friend request ${action}ed successfully` });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

export const removeFriend = async (req, res) => {
  try {
    const { friendId } = req.params;
    const userId = req.user.id;

    await Promise.all([
      User.findByIdAndUpdate(userId, { $pull: { friends: friendId } }),
      User.findByIdAndUpdate(friendId, { $pull: { friends: userId } })
    ]);

    res.json({ message: 'Friend removed successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

export const getFriendRecommendations = async (req, res) => {
  try {
    const userId = req.user.id;
    const user = await User.findById(userId).populate('friends');

    // Get users with similar hobbies
    const recommendations = await User.find({
      _id: { $ne: userId, $nin: user.friends },
      hobbies: { $in: user.hobbies }
    })
    .select('username email hobbies')
    .limit(10);

    res.json(recommendations);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

export const getFriendRequests = async (req, res) => {
  try {
    const userId = req.user.id;
    const user = await User.findById(userId)
      .populate({
        path: 'friendRequests.from',
        select: 'username email'
      });

    const pendingRequests = user.friendRequests.filter(
      request => request.status === 'pending'
    );

    res.json(pendingRequests);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};