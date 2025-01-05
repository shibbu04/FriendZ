import { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { motion } from 'framer-motion';
import { Check, X, UserCheck } from 'lucide-react';
import axios from 'axios';
import { toast } from 'react-hot-toast';
import type { RootState } from '../store';

const API_URI = import.meta.env.VITE_API_URI || 'http://localhost:5000/api';

interface FriendRequest {
  _id: string;
  from: {
    _id: string;
    username: string;
    email: string;
  };
  status: string;
}

interface FriendRequestsProps {
  onRequestHandled?: () => void;
}

export default function FriendRequests({ onRequestHandled }: FriendRequestsProps) {
  const [requests, setRequests] = useState<FriendRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const { token } = useSelector((state: RootState) => state.auth);

  useEffect(() => {
    if (token) {
      fetchRequests();
    }
  }, [token]);

  const fetchRequests = async () => {
    if (!token) {
      setRequests([]);
      setLoading(false);
      return;
    }

    try {
      const response = await axios.get(`${API_URI}/friends/requests`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      // Ensure response.data is an array
      setRequests(Array.isArray(response.data) ? response.data : []);
    } catch (error) {
      console.error('Failed to fetch requests:', error);
      setRequests([]); // Set empty array on error
    } finally {
      setLoading(false);
    }
  };

  const handleRequest = async (requestId: string, action: 'accept' | 'reject') => {
    if (!token) return;

    try {
      await axios.post(
        `${API_URI}/friends/handle-request`,
        { requestId, action },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      toast.success(`Friend request ${action}ed`);
      await fetchRequests();
      onRequestHandled?.(); // Call the callback if provided
    } catch (error) {
      toast.error('Failed to handle request');
    }
  };

  if (loading) {
    return <div>Loading requests...</div>;
  }

  return (
    <div className="bg-white rounded-lg shadow-lg p-6 mt-8">
      <div className="flex items-center mb-4">
        <UserCheck className="h-6 w-6 text-indigo-600 mr-2" />
        <h2 className="text-xl font-semibold">Friend Requests</h2>
      </div>

      {!token ? (
        <p className="text-gray-500">Please log in to see friend requests</p>
      ) : requests.length === 0 ? (
        <p className="text-gray-500">No pending friend requests</p>
      ) : (
        <div className="space-y-4">
          {requests.map((request) => (
            <motion.div
              key={request._id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex items-center justify-between p-4 bg-gray-50 rounded-lg"
            >
              <div>
                <h3 className="font-medium text-gray-900">{request.from.username}</h3>
                <p className="text-sm text-gray-500">{request.from.email}</p>
              </div>
              <div className="flex space-x-2">
                <button
                  onClick={() => handleRequest(request._id, 'accept')}
                  className="inline-flex items-center px-3 py-2 border border-transparent text-sm rounded-md text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
                >
                  <Check className="h-4 w-4 mr-1" />
                  Accept
                </button>
                <button
                  onClick={() => handleRequest(request._id, 'reject')}
                  className="inline-flex items-center px-3 py-2 border border-transparent text-sm rounded-md text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                >
                  <X className="h-4 w-4 mr-1" />
                  Reject
                </button>
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
}