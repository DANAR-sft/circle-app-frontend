import {
  createAsyncThunk,
  createSlice,
  type PayloadAction,
} from "@reduxjs/toolkit";
import { api } from "@/api/BaseUrl";
import type { ISlice, IThreadProps } from "@/types/types";
import type { IThread } from "@/types/types";

export const GetThread = createAsyncThunk<any, number | undefined>(
  "thread/getThreads",
  async (page = 1, thunkAPI) => {
    try {
      const response = await api.get(`/thread?page=${page}`);
      return {
        data: response.data.data,
        pagination: response.data.pagination,
        page,
      };
    } catch (error: any) {
      // Only remove token if it's an auth error (401)
      if (error.response?.status === 401) {
        localStorage.removeItem("token");
      }
      const message =
        error.response?.data?.message ||
        error.message ||
        "Failed to fetch threads";
      console.error("GetThread error:", message);
      return thunkAPI.rejectWithValue(message);
    }
  },
);

// New: Get current authenticated user's threads (cached endpoint)
export const GetMyThreads = createAsyncThunk<any, number | undefined>(
  "thread/getMyThreads",
  async (page = 1, thunkAPI) => {
    try {
      // Use a short timeout so we don't wait long when the "my threads" cache endpoint is slow
      const response = await api.get(`/thread/mine?page=${page}`, {
        timeout: 1500,
      });
      return {
        data: response.data.data,
        pagination: response.data.pagination,
        page,
      };
    } catch (error: any) {
      // Only remove token if it's an auth error (401)
      if (error.response?.status === 401) {
        localStorage.removeItem("token");
      }
      const message =
        error.response?.data?.message ||
        error.message ||
        "Failed to fetch my threads";
      console.error("GetMyThreads error:", message);

      // Fallback: try to fetch public threads (getThreads)
      try {
        console.warn(
          "GetMyThreads failed (fast timeout), falling back to GetThread",
        );
        const fallback = await api.get(`/thread?page=${page}`);
        return {
          data: fallback.data.data,
          pagination: fallback.data.pagination,
          page,
        };
      } catch (fallbackError: any) {
        console.error(
          "GetThread fallback failed:",
          fallbackError?.message || fallbackError,
        );
        return thunkAPI.rejectWithValue(message);
      }
    }
  },
);

export const GetThreadById = createAsyncThunk<any, number>(
  "thread/getThreadById",
  async (threadId, thunkAPI) => {
    try {
      const response = await api.get(`/thread/${threadId}`);
      return response.data.data;
    } catch (error) {
      alert("Failed to fetch thread.");
      return thunkAPI.rejectWithValue(error);
    }
  },
);

export const PostThread = createAsyncThunk<any, IThread>(
  "thread/postThread",
  async (threadData, thunkAPI) => {
    try {
      const formData = new FormData();
      formData.append("content", threadData.content);

      // Handle multiple images
      if (threadData.image) {
        if (threadData.image instanceof FileList) {
          for (let i = 0; i < threadData.image.length; i++) {
            formData.append("image", threadData.image[i]);
          }
        } else if (Array.isArray(threadData.image)) {
          threadData.image.forEach((file) => {
            formData.append("image", file);
          });
        }
      }

      const response = await api.post("/thread", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      return response.data;
    } catch (error) {
      return thunkAPI.rejectWithValue("Failed to post thread");
    }
  },
);

const initialState: ISlice = {
  data: null,
  dataById: null,
  loading: false,
  error: null,
};

export const threadSlice = createSlice({
  name: "thread",
  initialState,
  reducers: {
    // Real-time reducers untuk Socket.io
    addThread: (state, action: PayloadAction<IThreadProps>) => {
      if (Array.isArray(state.data)) {
        // Tambahkan thread baru di awal array (newest first)
        state.data = [action.payload, ...state.data];
      } else {
        state.data = [action.payload];
      }
    },
    updateThread: (state, action: PayloadAction<IThreadProps>) => {
      if (Array.isArray(state.data)) {
        const index = state.data.findIndex(
          (t: IThreadProps) => t.id === action.payload.id,
        );
        if (index !== -1) {
          state.data[index] = action.payload;
        }
      }
    },
    deleteThread: (state, action: PayloadAction<number>) => {
      if (Array.isArray(state.data)) {
        state.data = state.data.filter(
          (t: IThreadProps) => t.id !== action.payload,
        );
      }
    },
    setThreads: (state, action: PayloadAction<IThreadProps[]>) => {
      state.data = action.payload;
    },
    // 🔌 SOCKET.IO: Set reply count with actual value from database
    setReplyCount: (
      state,
      action: PayloadAction<{ threadId: number; replyCount: number }>,
    ) => {
      if (Array.isArray(state.data)) {
        const thread = state.data.find(
          (t: IThreadProps) => t.id === action.payload.threadId,
        );
        if (thread) {
          thread.reply = action.payload.replyCount;
        }
      }
      // Also update dataById if it matches
      if (state.dataById && state.dataById.id === action.payload.threadId) {
        state.dataById.replies = action.payload.replyCount;
      }
    },
    // 🔌 SOCKET.IO: Set like data with actual value from database
    setLikeData: (
      state,
      action: PayloadAction<{
        threadId: number;
        likeCount: number;
        userId: number;
        action: "like" | "unlike";
        likeId?: number;
      }>,
    ) => {
      // Get current user ID from token
      const token = localStorage.getItem("token");
      let currentUserId: number | null = null;
      if (token) {
        try {
          const payload = JSON.parse(atob(token.split(".")[1]));
          currentUserId = payload.id;
        } catch (e) {
          console.error("Failed to decode token", e);
        }
      }

      if (Array.isArray(state.data)) {
        const thread = state.data.find(
          (t: IThreadProps) => t.id === action.payload.threadId,
        );
        if (thread) {
          thread.likes = action.payload.likeCount;
          // Update isliked only for the user who performed the action
          if (currentUserId === action.payload.userId) {
            thread.isliked = action.payload.action === "like";
            // Store likeId for unlike functionality
            if (action.payload.action === "like" && action.payload.likeId) {
              thread.likeId = action.payload.likeId;
            } else if (action.payload.action === "unlike") {
              thread.likeId = undefined;
            }
          }
        }
      }
      // Also update dataById if it matches
      if (state.dataById && state.dataById.id === action.payload.threadId) {
        state.dataById.likes = action.payload.likeCount;
        if (currentUserId === action.payload.userId) {
          state.dataById.isliked = action.payload.action === "like";
        }
      }
    },
    // Optimistic Update for Likes
    toggleLikeOptimistic: (state, action: PayloadAction<number>) => {
      const threadId = action.payload;
      if (Array.isArray(state.data)) {
        const thread = state.data.find((t: IThreadProps) => t.id === threadId);
        if (thread) {
          thread.isliked = !thread.isliked;
          thread.likes += thread.isliked ? 1 : -1;
        }
      }
      if (state.dataById && state.dataById.id === threadId) {
        state.dataById.isliked = !state.dataById.isliked;
        state.dataById.likes += state.dataById.isliked ? 1 : -1;
      }
    },
    revertLikeOptimistic: (
      state,
      action: PayloadAction<{ threadId: number; wasLiked: boolean }>,
    ) => {
      const { threadId, wasLiked } = action.payload;
      if (Array.isArray(state.data)) {
        const thread = state.data.find((t: IThreadProps) => t.id === threadId);
        if (thread) {
          thread.isliked = wasLiked;
          thread.likes += wasLiked ? 1 : -1;
        }
      }
      if (state.dataById && state.dataById.id === threadId) {
        state.dataById.isliked = wasLiked;
        state.dataById.likes += wasLiked ? 1 : -1;
      }
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(GetThread.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(GetThread.fulfilled, (state, action) => {
        state.loading = false;
        if (action.payload.page === 1) {
          state.data = action.payload.data;
        } else {
          const existingIds = new Set(
            state.data?.map((t: IThreadProps) => t.id) || [],
          );
          const newThreads = action.payload.data.filter(
            (t: IThreadProps) => !existingIds.has(t.id),
          );
          state.data = [...(state.data || []), ...newThreads];
        }
        state.pagination = action.payload.pagination;
      })
      .addCase(GetThread.rejected, (state) => {
        state.loading = false;
        state.error = "Failed to fetch threads";
      });

    // Handlers for GetMyThreads
    builder
      .addCase(GetMyThreads.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(GetMyThreads.fulfilled, (state, action) => {
        state.loading = false;
        if (action.payload.page === 1) {
          state.data = action.payload.data;
        } else {
          const existingIds = new Set(
            state.data?.map((t: IThreadProps) => t.id) || [],
          );
          const newThreads = action.payload.data.filter(
            (t: IThreadProps) => !existingIds.has(t.id),
          );
          state.data = [...(state.data || []), ...newThreads];
        }
        state.pagination = action.payload.pagination;
      })
      .addCase(GetMyThreads.rejected, (state) => {
        state.loading = false;
        state.error = "Failed to fetch my threads";
      });
    builder
      .addCase(GetThreadById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(GetThreadById.fulfilled, (state, action) => {
        state.loading = false;
        state.dataById = action.payload;
      })
      .addCase(GetThreadById.rejected, (state) => {
        state.loading = false;
        state.error = "Failed to fetch thread by ID";
      });
    builder
      .addCase(PostThread.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(PostThread.fulfilled, (state) => {
        state.loading = false;
        // ✅ Tidak mengubah state.data di sini
        // Thread baru akan ditambahkan melalui Socket.io event "thread:created"
      })
      .addCase(PostThread.rejected, (state) => {
        state.loading = false;
        state.error = "Failed to post thread";
      });
  },
});

// Export actions untuk real-time updates
export const {
  addThread,
  updateThread,
  deleteThread,
  setThreads,
  setReplyCount,
  setLikeData,
  toggleLikeOptimistic,
  revertLikeOptimistic,
} = threadSlice.actions;

export default threadSlice.reducer;
