import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { api } from "@/api/BaseUrl";
import type { IUpdatedProfile, ProfileState } from "@/types/types";

export const GetProfile = createAsyncThunk<any>(
  "profile/getProfile",
  async () => {
    try {
      const response = await api.get("/profile");
      return response.data.data;
    } catch (error) {
      throw new Error("Error fetching profile");
    }
  },
);

export const GetAllProfiles = createAsyncThunk<any>(
  "profile/getAllProfiles",
  async (_, thunkAPI) => {
    try {
      const response = await api.get("/profiles");
      return response.data.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(error);
    }
  },
);

export const GetProfileById = createAsyncThunk<any, number>(
  "profile/getProfileById",
  async (id, thunkAPI) => {
    try {
      const response = await api.get(`/profile/${id}`);
      return response.data.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(error);
    }
  },
);

export const UpdateProfile = createAsyncThunk<any, IUpdatedProfile>(
  "profile/updateProfile",
  async (updatedData, thunkAPI) => {
    try {
      const formData = new FormData();
      if (updatedData.avatar) {
        formData.append("avatar", updatedData.avatar);
      }
      if (updatedData.username) {
        formData.append("username", updatedData.username);
      }
      if (updatedData.fullname) {
        formData.append("fullname", updatedData.fullname);
      }
      if (updatedData.bio) {
        formData.append("bio", updatedData.bio);
      }

      const response = await api.patch("/profile", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      console.log("response update profile:", response.data);
      return response.data.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(error);
    }
  },
);

const initialState: ProfileState = {
  profile: null,
  allProfiles: [],
  profileId: null,
  profileLoading: false,
  allProfilesLoading: false,
  profileIdLoading: false,
  profileError: null,
  allProfilesError: null,
  profileIdError: null,
};

export const profileSlice = createSlice({
  name: "profile",
  initialState,
  reducers: {
    updateFollowCount: (state, action) => {
      const { userId, followerCount, followingCount } = action.payload;
      // Update profileId if it matches (uses _count format from /profile/:id)
      if (state.profileId && state.profileId.id === userId) {
        state.profileId = {
          ...state.profileId,
          _count: {
            ...state.profileId._count,
            followers: followerCount,
            following: followingCount,
          },
        };
      }
      // Update current user profile if it matches (uses follower_count/following_count format from /profile)
      if (state.profile && state.profile.id === userId) {
        state.profile = {
          ...state.profile,
          follower_count: followerCount,
          following_count: followingCount,
        };
      }
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(GetProfile.pending, (state) => {
        state.profileLoading = true;
        state.profileError = null;
      })
      .addCase(GetProfile.fulfilled, (state, action) => {
        state.profileLoading = false;
        state.profile = action.payload;
      })
      .addCase(GetProfile.rejected, (state) => {
        state.profileLoading = false;
        state.profileError = "Failed to fetch profile";
      });
    builder
      .addCase(GetAllProfiles.pending, (state) => {
        state.allProfilesLoading = true;
        state.allProfilesError = null;
      })
      .addCase(GetAllProfiles.fulfilled, (state, action) => {
        state.allProfilesLoading = false;
        state.allProfiles = action.payload;
      })
      .addCase(GetAllProfiles.rejected, (state) => {
        state.allProfilesLoading = false;
        state.allProfilesError = "Failed to fetch profiles";
      });
    builder
      .addCase(GetProfileById.pending, (state) => {
        state.profileIdLoading = true;
        state.profileIdError = null;
      })
      .addCase(GetProfileById.fulfilled, (state, action) => {
        state.profileIdLoading = false;
        state.profileId = action.payload;
      })
      .addCase(GetProfileById.rejected, (state) => {
        state.profileIdLoading = false;
        state.profileIdError = "Failed to fetch profile by ID";
      });
  },
});

export const { updateFollowCount } = profileSlice.actions;

export default profileSlice.reducer;
