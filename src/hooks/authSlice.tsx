import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { api } from "@/api/BaseUrl";
import type { ISlice, IPostRegister, IPostLogin } from "@/types/types";

export const PostLogin = createAsyncThunk<any, IPostLogin>(
  "auth/login",
  async (auth, thunkAPI) => {
    try {
      const response = await api.post("/login", auth);
      const data = response.data;
      if (data.data.token) {
        localStorage.setItem("token", data.data.token);
      }
      return data;
    } catch (error) {
      return thunkAPI.rejectWithValue(error);
    }
  },
);

export const PostRegister = createAsyncThunk<any, IPostRegister>(
  "auth/register",
  async (auth, thunkAPI) => {
    try {
      const response = await api.post("/register", auth);
      const data = response.data;
      if (data.data.token) {
        localStorage.setItem("token", data.data.token);
      }
      return data;
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

export const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(PostLogin.pending, (state) => {
        state.loading = true;
      })
      .addCase(PostLogin.fulfilled, (state, action) => {
        state.loading = false;
        state.data = action.payload;
        if (action.payload.data.token) {
          localStorage.setItem("token", action.payload.data.token);
        }
      })
      .addCase(PostLogin.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error?.message ?? null;
      });
    builder
      .addCase(PostRegister.pending, (state) => {
        state.loading = true;
      })
      .addCase(PostRegister.fulfilled, (state, action) => {
        state.loading = false;
        state.data = action.payload;
        if (action.payload.data.token) {
          localStorage.setItem("token", action.payload.data.token);
        }
      })
      .addCase(PostRegister.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error?.message ?? null;
      });
  },
});

export default authSlice.reducer;
