import { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { Search, UserPlus } from 'lucide-react';
import axios from 'axios';
import { toast } from 'react-hot-toast';
import type { RootState } from '../store';

interface User {
  _id: string;
  username: string;
  email: string;
}

export default function SearchUsers() {
  const [query, setQuery] = useState('');
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(false);
  const { token } = useSelector((state: RootState) => state.auth);

  useEffect(() => {
    if (query.length >= 2) {
      const timeoutId = setTimeout(() => {
        searchUsers();
      }, 300);
      return () => clearTimeout(timeoutId);
    } else {
      setUsers([]);
    }
  }, [query]);

  const searchUsers = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`http://localhost:5000/api/users/search?query=${query}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setUsers(response.data);
    } catch (error) {
      console.error('Search failed:', error);
    } finally {
      setLoading(false);
    }
  };

  const sendFriendRequest = async (userId: string) => {
    try {
      await axios.post(
        'http://localhost:5000/api/friends/request',
        { friendId: userId },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      toast.success('Friend request sent!');
    } catch (error) {
      toast.error('Failed to send friend request');
    }
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 mb-8">
      <div className="relative">
        <Search className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search users..."
          className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-indigo-500 dark:focus:ring-indigo-400 focus:border-transparent dark:bg-gray-700 dark:text-white"
        />
      </div>

      {loading && <div className="mt-4 text-gray-500 dark:text-gray-400">Searching...</div>}

      {users.length > 0 && (
        <div className="mt-4 space-y-2">
          {users.map((user) => (
            <div
              key={user._id}
              className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700 rounded-lg"
            >
              <div>
                <h3 className="font-medium text-gray-900 dark:text-white">{user.username}</h3>
                <p className="text-sm text-gray-500 dark:text-gray-400">{user.email}</p>
              </div>
              <button
                onClick={() => sendFriendRequest(user._id)}
                className="inline-flex items-center px-3 py-2 border border-transparent text-sm rounded-md text-white bg-indigo-600 hover:bg-indigo-700 dark:bg-indigo-500 dark:hover:bg-indigo-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              >
                <UserPlus className="h-4 w-4 mr-2" />
                Add Friend
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}