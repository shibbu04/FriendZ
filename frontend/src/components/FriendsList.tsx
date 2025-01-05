import { UserMinus } from 'lucide-react';
import { motion } from 'framer-motion';

interface Friend {
  _id: string;
  username: string;
  email: string;
  hobbies: string[];
}

interface FriendsListProps {
  friends: Friend[];
  onRemoveFriend: (friendId: string) => void;
}

export default function FriendsList({ friends, onRemoveFriend }: FriendsListProps) {
  if (friends.length === 0) {
    return (
      <div className="text-center text-gray-500 py-8">
        No friends added yet. Start connecting with people!
      </div>
    );
  }

  return (
    <div className="grid gap-4 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
      {friends.map((friend) => (
        <motion.div
          key={friend._id}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-lg shadow-md p-4"
        >
          <div className="flex justify-between items-start">
            <div>
              <h3 className="font-medium text-gray-900">{friend.username}</h3>
              <p className="text-sm text-gray-500">{friend.email}</p>
              <div className="mt-2 flex flex-wrap gap-1">
                {friend.hobbies.map((hobby) => (
                  <span
                    key={hobby}
                    className="inline-block px-2 py-1 text-xs font-medium bg-indigo-100 text-indigo-800 rounded-full"
                  >
                    {hobby}
                  </span>
                ))}
              </div>
            </div>
            <button
              onClick={() => onRemoveFriend(friend._id)}
              className="text-red-600 hover:text-red-700 p-1 rounded-full hover:bg-red-50 transition-colors"
              title="Remove friend"
            >
              <UserMinus className="h-5 w-5" />
            </button>
          </div>
        </motion.div>
      ))}
    </div>
  );
}