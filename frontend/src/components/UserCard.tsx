import { UserPlus } from 'lucide-react';
import { motion } from 'framer-motion';

interface User {
  _id: string;
  username: string;
  email: string;
  hobbies: string[];
}

interface UserCardProps {
  user: User;
  onSendRequest: (userId: string) => void;
  disabled?: boolean;
}

export default function UserCard({ user, onSendRequest, disabled }: UserCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white rounded-lg shadow-md p-4"
    >
      <div className="flex justify-between items-start">
        <div>
          <h3 className="font-medium text-gray-900">{user.username}</h3>
          <p className="text-sm text-gray-500">{user.email}</p>
          <div className="mt-2 flex flex-wrap gap-1">
            {user.hobbies.map((hobby) => (
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
          onClick={() => onSendRequest(user._id)}
          disabled={disabled}
          className={`inline-flex items-center px-3 py-2 border border-transparent text-sm rounded-md text-white
            ${disabled
              ? 'bg-gray-400 cursor-not-allowed'
              : 'bg-indigo-600 hover:bg-indigo-700 focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500'
            }`}
        >
          <UserPlus className="h-4 w-4 mr-2" />
          Add Friend
        </button>
      </div>
    </motion.div>
  );
}