import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

const API_URL = 'http://localhost:5000/api';

export const sendFriendRequest = createAsyncThunk(
  'friends/sendRequest',
  async (friendId: string, { getState }) => {
    const { auth } = getState() as { auth: { token: string } };
    const response = await axios.post(
      `${API_URL}/friends/request`,
      { friendId },
      {
        headers: { Authorization: `Bearer ${auth.token}` },
      }
    );
    return response.data;
  }
);

export const getFriendRecommendations = createAsyncThunk(
  'friends/getRecommendations',
  async (_, { getState }) => {
    const { auth } = getState() as { auth: { token: string } };
    const response = await axios.get(`${API_URL}/friends/recommendations`, {
      headers: { Authorization: `Bearer ${auth.token}` },
    });
    return response.data;
  }
);

const friendsSlice = createSlice({
  name: 'friends',
  initialState: {
    friends: [],
    recommendations: [],
    requests: [],
    loading: false,
    error: null as string | null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(sendFriendRequest.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(sendFriendRequest.fulfilled, (state) => {
        state.loading = false;
      })
      .addCase(sendFriendRequest.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to send friend request';
      })
      .addCase(getFriendRecommendations.fulfilled, (state, action) => {
        state.recommendations = action.payload;
      });
  },
});

export default friendsSlice.reducer;