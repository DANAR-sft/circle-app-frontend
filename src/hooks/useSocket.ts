import { useEffect, useCallback } from "react";
import { useAppDispatch } from "@/app/hooks";
import {
  addThread,
  updateThread,
  deleteThread,
  setThreads,
  setReplyCount,
  setLikeData,
} from "@/hooks/threadSlice";
import { addReply } from "@/hooks/replySlice";
import { updateFollowStatus } from "@/hooks/followSlice";
import { updateFollowCount } from "@/hooks/profileSlice";
import {
  connectSocket,
  disconnectSocket,
  getSocket,
  onEvent,
  offEvent,
  emitEvent,
} from "@/lib/socket";
import type { IThreadProps, IReplyColProps } from "@/types/types"; // Add reply type

/**
 * Custom hook untuk mengelola koneksi Socket.io dan real-time updates
 * Menangani lifecycle koneksi dan cleanup otomatis
 */
export const useSocket = () => {
  const dispatch = useAppDispatch();

  useEffect(() => {
    // 1. Inisialisasi koneksi saat komponen mount
    connectSocket();

    // 2. Setup event listeners untuk real-time updates
    const handleNewThread = (thread: IThreadProps) => {
      console.log("📥 New thread received:", thread);
      dispatch(addThread(thread));
    };

    const handleThreadUpdated = (thread: IThreadProps) => {
      console.log("📝 Thread updated:", thread);
      dispatch(updateThread(thread));
    };

    const handleThreadDeleted = (threadId: number) => {
      console.log("🗑️ Thread deleted:", threadId);
      dispatch(deleteThread(threadId));
    };

    const handleThreadsSync = (threads: IThreadProps[]) => {
      console.log("🔄 Threads synced:", threads.length);
      dispatch(setThreads(threads));
    };

    // 🔌 SOCKET.IO: Handler for new replies
    const handleNewReply = (reply: IReplyColProps & { threadId: number }) => {
      console.log("💬 New reply received:", reply);
      dispatch(addReply(reply));
    };

    // 🔌 SOCKET.IO: Handler for reply count update (actual count from database)
    const handleReplyCountUpdate = (data: {
      threadId: number;
      replyCount: number;
    }) => {
      console.log(
        "🔢 Reply count updated for thread:",
        data.threadId,
        "count:",
        data.replyCount,
      );
      dispatch(
        setReplyCount({ threadId: data.threadId, replyCount: data.replyCount }),
      );
    };

    // 🔌 SOCKET.IO: Handler for like update (actual count from database)
    const handleLikeUpdate = (data: {
      threadId: number;
      likeCount: number;
      userId: number;
      action: "like" | "unlike";
      likeId?: number;
    }) => {
      dispatch(setLikeData(data));
    };

    // 🔌 SOCKET.IO: Handler for follow update
    const handleFollowUpdate = (data: {
      userId: number;
      targetUserId: number;
      isFollowing: boolean;
    }) => {
      console.log("👥 Follow status updated:", data);
      dispatch(updateFollowStatus(data));
    };

    // 🔌 SOCKET.IO: Handler for follow count update
    const handleFollowCountUpdate = (data: {
      userId: number;
      followerCount: number;
      followingCount: number;
    }) => {
      console.log("🔢 Follow count updated:", data);
      dispatch(updateFollowCount(data));
    };

    // Register event listeners
    onEvent("thread:created", handleNewThread);
    onEvent("thread:updated", handleThreadUpdated);
    onEvent("thread:deleted", handleThreadDeleted);
    onEvent("threads:sync", handleThreadsSync);
    onEvent("reply:created", handleNewReply); // Listen for new replies
    onEvent("reply:count:updated", handleReplyCountUpdate); // Listen for reply count updates
    onEvent("like:updated", handleLikeUpdate); // Listen for like updates
    onEvent("follow:updated", handleFollowUpdate); // Listen for follow updates
    onEvent("follow:count:updated", handleFollowCountUpdate); // Listen for follow count updates

    // 3. Cleanup saat komponen unmount (mencegah memory leak)
    return () => {
      offEvent("thread:created");
      offEvent("thread:updated");
      offEvent("thread:deleted");
      offEvent("threads:sync");
      offEvent("reply:created"); // Cleanup reply listener
      offEvent("reply:count:updated"); // Cleanup reply count listener
      offEvent("like:updated"); // Cleanup like listener
      offEvent("follow:updated"); // Cleanup follow listener
      offEvent("follow:count:updated"); // Cleanup follow count listener
      disconnectSocket();
    };
  }, [dispatch]);

  // Helper functions untuk emit events
  const emitNewThread = useCallback((thread: IThreadProps) => {
    emitEvent("thread:create", thread);
  }, []);

  const emitLikeThread = useCallback((threadId: number, userId: number) => {
    emitEvent("thread:like", { threadId, userId });
  }, []);

  const emitUnlikeThread = useCallback((threadId: number, userId: number) => {
    emitEvent("thread:unlike", { threadId, userId });
  }, []);

  const emitFollowUser = useCallback((targetUserId: number) => {
    emitEvent("user:follow", { targetUserId });
  }, []);

  const emitUnfollowUser = useCallback((targetUserId: number) => {
    emitEvent("user:unfollow", { targetUserId });
  }, []);

  const isConnected = useCallback(() => {
    const socket = getSocket();
    return socket.connected;
  }, []);

  return {
    emitNewThread,
    emitLikeThread,
    emitUnlikeThread,
    emitFollowUser,
    emitUnfollowUser,
    isConnected,
  };
};

export default useSocket;
