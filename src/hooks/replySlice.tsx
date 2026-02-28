import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { api } from "@/api/BaseUrl";
import type { IReplyProps, ISlice } from "@/types/types";

export const PostReplyAction = createAsyncThunk<any, IReplyProps>(
  "reply/postReply",
  async (replyData, thunkAPI) => {
    try {
      const formData = new FormData();
      formData.append("content", replyData.content);
      formData.append("threadId", replyData.threadId.toString());

      if (replyData.image) {
        if (replyData.image instanceof FileList) {
          formData.append("image", replyData.image[0]);
        } else if (replyData.image instanceof File) {
          formData.append("image", replyData.image);
        }
      }

      const response = await api.post("/reply", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      console.log("response post reply:", response.data);
      return response.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(error);
    }
  },
);

export const GetReplyByThreadId = createAsyncThunk<any, number>(
  "reply/getReplyByThreadId",
  async (threadId, thunkAPI) => {
    try {
      const response = await api.get(`/reply/${threadId}`);
      console.log("response get reply by thread id:", response.data.data);
      return response.data.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(error);
    }
  },
);

const initialState: ISlice = {
  data: null,
  loading: false,
  error: null,
};

export const replySlice = createSlice({
  name: "reply",
  initialState,
  reducers: {
    // 🔌 SOCKET.IO: Reducer to add a new reply from socket event
    addReply: (state, action) => {
      // Only add if data is an array (replies list exists)
      if (Array.isArray(state.data)) {
        // Check if reply already exists (prevent duplicates)
        const exists = state.data.some(
          (reply: any) => reply.id === action.payload.id,
        );
        if (!exists) {
          state.data.push(action.payload);
        }
      }
    },
    // Clear replies when leaving the page
    clearReplies: (state) => {
      state.data = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(PostReplyAction.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(PostReplyAction.fulfilled, (state, action) => {
        state.loading = false;
        state.data = action.payload;
      })
      .addCase(PostReplyAction.rejected, (state) => {
        state.loading = false;
        state.error = "Failed to post reply";
      });
    builder
      .addCase(GetReplyByThreadId.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(GetReplyByThreadId.fulfilled, (state, action) => {
        state.loading = false;
        state.data = action.payload;
      })
      .addCase(GetReplyByThreadId.rejected, (state) => {
        state.loading = false;
        state.error = "Failed to get replies";
      });
  },
});

// Export the actions for use in components
export const { addReply, clearReplies } = replySlice.actions;

export default replySlice.reducer;
