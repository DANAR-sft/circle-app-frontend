import { api } from "../api/BaseUrl";
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import type { ISlice } from "@/types/types";

export const FollowUser = createAsyncThunk<any, number>(
  "follow/followUser",
  async (id, thunkAPI) => {
    try {
      const response = await api.post("/follow", { id });
      return { ...response.data.data, targetUserId: id };
    } catch (error: any) {
      return thunkAPI.rejectWithValue(
        error.response?.data?.message || "Failed to follow user",
      );
    }
  },
);

export const UnFollowUser = createAsyncThunk<any, number>(
  "follow/unFollowUser",
  async (id, thunkAPI) => {
    try {
      const response = await api.delete("/follow", { data: { id } });
      return { ...response.data.data, targetUserId: id };
    } catch (error: any) {
      return thunkAPI.rejectWithValue(
        error.response?.data?.message || "Failed to unfollow user",
      );
    }
  },
);

export const GetFollows = createAsyncThunk<any, string>(
  "follow/getFollows",
  async (value, thunkAPI) => {
    try {
      const response = await api.get(`/follow?type=${value}`);
      return response.data.data;
    } catch (error: any) {
      return thunkAPI.rejectWithValue(
        error.response?.data?.message || "Failed to get follows",
      );
    }
  },
);

const initialState: ISlice & {
  shouldRefresh: boolean;
  followingUsers: Record<number, boolean>;
  currentUserFollowingCount: number;
} = {
  data: null,
  loading: false,
  error: null,
  shouldRefresh: false,
  followingUsers: {},
  currentUserFollowingCount: 0,
};

const FollowSlice = createSlice({
  name: "follow",
  initialState,
  reducers: {
    updateFollowStatus: (state, _action) => {
      // Trigger refresh when follow status changes from socket
      state.shouldRefresh = true;
    },
    resetRefresh: (state) => {
      state.shouldRefresh = false;
    },
    setFollowingUsers: (state, action) => {
      // Initialize following users from profile data
      const users = action.payload as { id: number; isFollowing: boolean }[];
      users.forEach((user) => {
        state.followingUsers[user.id] = user.isFollowing;
      });
    },
    setInitialFollowingCount: (state, action) => {
      state.currentUserFollowingCount = action.payload;
    },
    toggleFollowOptimistic: (state, action) => {
      const userId = action.payload;
      const currentStatus = state.followingUsers[userId] || false;
      state.followingUsers[userId] = !currentStatus;
      state.currentUserFollowingCount += currentStatus ? -1 : 1;
    },
    revertFollowOptimistic: (state, action) => {
      const { userId, wasFollowing } = action.payload;
      state.followingUsers[userId] = wasFollowing;
      state.currentUserFollowingCount += wasFollowing ? 1 : -1;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(FollowUser.pending, (state) => {
        state.error = null;
      })
      .addCase(FollowUser.fulfilled, (state, action) => {
        state.error = null;
        state.followingUsers[action.payload.targetUserId] = true;
      })
      .addCase(FollowUser.rejected, (state) => {
        state.error = "Failed to follow user";
      });
    builder
      .addCase(UnFollowUser.pending, (state) => {
        state.error = null;
      })
      .addCase(UnFollowUser.fulfilled, (state, action) => {
        state.error = null;
        state.followingUsers[action.payload.targetUserId] = false;
      })
      .addCase(UnFollowUser.rejected, (state) => {
        state.error = "Failed to unfollow user";
      });
    builder
      .addCase(GetFollows.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(GetFollows.fulfilled, (state, action) => {
        state.loading = false;
        state.data = action.payload;
      })
      .addCase(GetFollows.rejected, (state) => {
        state.loading = false;
        state.error = "Failed to get follows";
      });
  },
});

export const {
  updateFollowStatus,
  resetRefresh,
  setFollowingUsers,
  setInitialFollowingCount,
  toggleFollowOptimistic,
  revertFollowOptimistic,
} = FollowSlice.actions;

export default FollowSlice.reducer;
