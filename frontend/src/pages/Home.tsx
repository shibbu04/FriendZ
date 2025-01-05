import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { toast } from 'react-hot-toast';
import { Users } from 'lucide-react';
import axios from 'axios';
import SearchBar from '../components/SearchBar';
import FriendsList from '../components/FriendsList';
import UserCard from '../components/UserCard';
import FriendRequests from '../components/FriendRequests';
import type { RootState } from '../store';

interface User {
  _id: string;
  username: string;
  email: string;
  hobbies: string[];
}

export default function Home() {
  const [searchResults, setSearchResults] = useState<User[]>([]);
  const [recommendations, setRecommendations] = useState<User[]>([]);
  const [friends, setFriends] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const { token, user } = useSelector((state: RootState) => state.auth);

  useEffect(() => {
    fetchFriends();
    fetchRecommendations();
  }, [token]);

  const fetchFriends = async () => {
    try {
      const response = await axios.get(`http://localhost:5000/api/users/profile/${user?.id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setFriends(response.data.friends);
    } catch (error) {
      console.error('Failed to fetch friends:', error);
    }
  };

  const fetchRecommendations = async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/friends/recommendations', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setRecommendations(response.data);
    } catch (error) {
      console.error('Failed to fetch recommendations:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = async (query: string) => {
    if (query.length < 2) {
      setSearchResults([]);
      return;
    }

    try {
      const response = await axios.get(`http://localhost:5000/api/users/search?query=${query}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setSearchResults(response.data);
    } catch (error) {
      console.error('Search failed:', error);
    }
  };

  const handleSendRequest = async (friendId: string) => {
    try {
      await axios.post(
        'http://localhost:5000/api/friends/request',
        { friendId },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      toast.success('Friend request sent!');
      fetchRecommendations();
    } catch (error) {
      toast.error('Failed to send friend request');
    }
  };

  const handleRemoveFriend = async (friendId: string) => {
    try {
      await axios.delete(
        `http://localhost:5000/api/friends/${friendId}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      toast.success('Friend removed');
      fetchFriends();
      fetchRecommendations();
    } catch (error) {
      toast.error('Failed to remove friend');
    }
  };

  return (
    <div className="max-w-7xl mx-auto space-y-8">
      <div className="flex flex-col md:flex-row justify-between items-center gap-4">
        <h1 className="text-3xl font-bold text-gray-900">Welcome, {user?.username}!</h1>
        <SearchBar onSearch={handleSearch} />
      </div>

      {searchResults.length > 0 && (
        <section className="space-y-4">
          <h2 className="text-xl font-semibold text-gray-900">Search Results</h2>
          <div className="grid gap-4 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
            {searchResults.map((user) => (
              <UserCard
                key={user._id}
                user={user}
                onSendRequest={handleSendRequest}
                disabled={friends.some(f => f._id === user._id)}
              />
            ))}
          </div>
        </section>
      )}

      <section className="space-y-4">
        <h2 className="text-xl font-semibold text-gray-900">Your Friends</h2>
        <FriendsList friends={friends} onRemoveFriend={handleRemoveFriend} />
      </section>

      <FriendRequests onRequestHandled={() => {
        fetchFriends();
        fetchRecommendations();
      }} />

      <section className="space-y-4">
        <h2 className="text-xl font-semibold text-gray-900">Recommended Friends</h2>
        {loading ? (
          <div>Loading recommendations...</div>
        ) : (
          <div className="grid gap-4 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
            {recommendations.map((user) => (
              <UserCard
                key={user._id}
                user={user}
                onSendRequest={handleSendRequest}
              />
            ))}
          </div>
        )}
      </section>
    </div>
  );
}