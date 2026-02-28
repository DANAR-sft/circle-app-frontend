import { DetailThread } from "@/components/DetailThread";
import { PostReply } from "@/components/PostReply";
import { useAppDispatch, useAppSelector } from "@/app/hooks";
import { useEffect } from "react";
import { GetThreadById } from "@/hooks/threadSlice";
import { GetReplyByThreadId, clearReplies } from "@/hooks/replySlice";
import { useParams, useNavigate } from "react-router";
import { LucideArrowLeft } from "lucide-react";
import { useAlert } from "@/context/AlertContext";
import { GetProfile } from "@/hooks/profileSlice";
import { ReplyCol } from "@/components/ReplyCol";
import { ThreadSkeleton } from "@/components/Skeleton";

export function DetailThreadPage() {
  const dispatch = useAppDispatch();
  const threadState = useAppSelector((state) => state.thread);
  const profileState = useAppSelector((state) => state.profile);
  const replyState = useAppSelector((state) => state.reply);
  const { id } = useParams();
  const navigate = useNavigate();
  const { showError } = useAlert();

  // Socket sudah diinisialisasi di HomePage (parent layout)
  // Tidak perlu memanggil useSocket() di sini untuk menghindari
  // socket disconnect saat navigasi antar halaman

  useEffect(() => {
    return () => {
      dispatch(clearReplies());
    };
  }, [dispatch]);

  useEffect(() => {
    const fetchThread = async () => {
      if (!id) return;
      try {
        await dispatch(GetThreadById(Number(id))).unwrap();
      } catch (error) {
        console.error("Failed to fetch thread:", error);
        showError("Failed to fetch thread. Please try again later.");
      }
    };

    fetchThread();
  }, [dispatch, id, showError]);

  useEffect(() => {
    const fetchThread = async () => {
      if (!id) return;
      try {
        await dispatch(GetReplyByThreadId(Number(id))).unwrap();
      } catch (error) {
        console.error("Failed to fetch replies:", error);
        showError("Failed to fetch replies. Please try again later.");
      }
    };

    fetchThread();
  }, [dispatch, id, showError]);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        await dispatch(GetProfile()).unwrap();
      } catch (error) {
        console.error("Failed to fetch profile:", error);
        showError("Failed to fetch profile. Please try again later.");
      }
    };

    fetchProfile();
  }, [dispatch, showError]);

  if (threadState.loading) {
    return (
      <div className="flex flex-col mt-4">
        <ThreadSkeleton />
        <ThreadSkeleton />
        <ThreadSkeleton />
      </div>
    );
  }

  if (profileState.profileLoading || !profileState.profile) {
    return (
      <div className="flex flex-col mt-4">
        <ThreadSkeleton />
      </div>
    );
  }

  return (
    <div className="p-4">
      {/* Header dengan tombol back */}
      <div className="flex items-center gap-3 mb-4">
        <button
          onClick={() => navigate(-1)}
          className="p-2 hover:bg-gray-100 rounded-full transition-colors"
        >
          <LucideArrowLeft className="w-5 h-5" />
        </button>
        <h1 className="text-xl font-bold">Status</h1>
      </div>

      {/* Detail Thread */}
      {threadState.dataById && <DetailThread thread={threadState.dataById} />}

      {/* Post Reply */}
      {threadState.dataById && (
        <PostReply
          fullname={profileState.profile.fullname}
          photo_profile={profileState.profile.photo_profile}
          threadId={threadState.dataById.id}
          onReplySuccess={() => {
            // Refresh replies setelah posting
            // Reply count will be updated via socket event with actual count from database
            if (id) {
              dispatch(GetReplyByThreadId(Number(id)));
            }
          }}
        />
      )}

      {/* List Replies */}
      {replyState.data &&
        Array.isArray(replyState.data) &&
        replyState.data.map((reply: any) => (
          <ReplyCol
            key={reply.id}
            content={reply.content}
            image={reply.image}
            user={reply.user}
            createdAt={reply.createdAt}
          />
        ))}
    </div>
  );
}
