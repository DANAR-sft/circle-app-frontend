import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { api } from "@/api/BaseUrl";
import type { ISlice } from "@/types/types";

export const PostLike = createAsyncThunk<any, { threadId: number }>(
  "like/postLike",
  async (likeData, thunkAPI) => {
    try {
      // Send threadId in request body
      const response = await api.post("/like", { threadId: likeData.threadId });
      console.log("response post like:", response.data.data);
      return response.data.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(error);
    }
  },
);

export const DeleteLikeById = createAsyncThunk<any, number>(
  "like/deleteLikeById",
  async (likeId, thunkAPI) => {
    try {
      const response = await api.delete(`/like/${likeId}`);
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

const likeSlice = createSlice({
  name: "like",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(PostLike.pending, (state) => {
        ((state.loading = true), (state.error = null));
      })
      .addCase(PostLike.fulfilled, (state, action) => {
        ((state.loading = false), (state.data = action.payload));
      })
      .addCase(PostLike.rejected, (state) => {
        ((state.loading = false), (state.error = "Failed to post like"));
      });
  },
});

export default likeSlice.reducer;
