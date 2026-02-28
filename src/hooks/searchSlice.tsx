import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { api } from "../api/BaseUrl";
import type { ISlice } from "@/types/types";

export const SearchProfiles = createAsyncThunk<any, string>(
  "search/searchProfiles",
  async (keyword, thunkAPI) => {
    try {
      const response = await api.get(`/search?keyword=${keyword}`);
      return response.data.data;
    } catch (error) {
      return (
        thunkAPI.rejectWithValue(error) ||
        new Error("Failed to search profiles")
      );
    }
  },
);

const initialState: ISlice = {
  data: null,
  loading: false,
  error: null,
};

const SearchSlice = createSlice({
  name: "search",
  initialState,
  reducers: {
    clearSearch: (state) => {
      state.data = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(SearchProfiles.pending, (state) => {
        ((state.loading = true), (state.error = null));
      })
      .addCase(SearchProfiles.fulfilled, (state, action) => {
        ((state.loading = false), (state.data = action.payload));
      })
      .addCase(SearchProfiles.rejected, (state) => {
        ((state.loading = false), (state.error = "Failed to search profiles"));
      });
  },
});

export const { clearSearch } = SearchSlice.actions;

export default SearchSlice.reducer;
