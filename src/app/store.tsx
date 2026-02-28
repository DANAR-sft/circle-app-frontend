import { configureStore } from "@reduxjs/toolkit";
import authReducer from "../hooks/authSlice";
import threadReducer from "../hooks/threadSlice";
import profileReducer from "../hooks/profileSlice";
import replyReducer from "../hooks/replySlice";
import likeReducer from "../hooks/likeSlice";
import followReducer from "../hooks/followSlice";
import sliceReducer from "../hooks/searchSlice";

export const store = configureStore({
  reducer: {
    auth: authReducer,
    thread: threadReducer,
    profile: profileReducer,
    reply: replyReducer,
    like: likeReducer,
    follow: followReducer,
    search: sliceReducer,
  },
});

// Infer the `RootState`,  `AppDispatch`, and `AppStore` types from the store itself
export type RootState = ReturnType<typeof store.getState>;
// Inferred type: {posts: PostsState, comments: CommentsState, users: UsersState}
export type AppDispatch = typeof store.dispatch;
export type AppStore = typeof store;
