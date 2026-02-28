import { useEffect, useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "@/app/hooks";
import { GetProfileById } from "@/hooks/profileSlice";
import { GetThread } from "@/hooks/threadSlice";
import { 
  FollowUser, 
  UnFollowUser, 
  setFollowingUsers,
  toggleFollowOptimistic, 
  revertFollowOptimistic 
} from "@/hooks/followSlice";
import { ThreadSide } from "@/components/ThreadSide";
import { MediaProfile } from "./MediaProfile";
import { ModalUpdateProfile } from "./ModalUpdateProfile";
import type { IMediaProfile, IThreadProps } from "@/types/types";
import { ArrowLeft } from "lucide-react";

export function ProfileDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const profileState = useAppSelector((state) => state.profile.profileId);
  const profileProccess = useAppSelector((state) => state.profile);
  const currentUser = useAppSelector((state) => state.profile.profile);
  const threadState = useAppSelector((state) => state.thread);
  const followingUsers = useAppSelector((state) => state.follow.followingUsers);
  const currentUserFollowingCount = useAppSelector((state) => state.follow.currentUserFollowingCount);
  const [activeTab, setActiveTab] = useState<"allpost" | "media">("allpost");
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [followerCountOffset, setFollowerCountOffset] = useState(0);

  // Initialize follow status when profile loads
  useEffect(() => {
    if (profileState?.id && profileState?.isFollowing !== undefined) {
      dispatch(setFollowingUsers([{ id: profileState.id, isFollowing: profileState.isFollowing }]));
    }
    setFollowerCountOffset(0); // Reset offset when profile changes
  }, [profileState, dispatch]);

  const handleFollow = async () => {
    if (profileState?.id && !isLoading) {
      setIsLoading(true);
      const wasFollowing = followingUsers[profileState.id] || false;

      // Optimistic update
      dispatch(toggleFollowOptimistic(profileState.id));
      setFollowerCountOffset((prev) => prev + (wasFollowing ? -1 : 1));

      try {
        if (wasFollowing) {
          await dispatch(UnFollowUser(profileState.id)).unwrap();
        } else {
          await dispatch(FollowUser(profileState.id)).unwrap();
        }
      } catch (error) {
        // Revert on error
        dispatch(revertFollowOptimistic({ userId: profileState.id, wasFollowing }));
        setFollowerCountOffset((prev) => prev + (wasFollowing ? 1 : -1));
      } finally {
        setIsLoading(false);
      }
    }
  };

  useEffect(() => {
    if (id) {
      dispatch(GetProfileById(Number(id)));
      dispatch(GetThread());
    }
  }, [dispatch, id]);

  // Filter threads by user
  const userThreads = threadState.data
    ? Array.isArray(threadState.data)
      ? threadState.data.filter(
          (thread: IThreadProps) => thread.user.id === Number(id),
        )
      : []
    : [];

  // Filter threads with images for media tab
  const mediaThreads = userThreads.filter(
    (thread: IMediaProfile) => thread.image && thread.image.length > 0,
  );

  // Show loading jika masih loading atau data belum ada
  if (
    profileProccess.profileIdLoading ||
    !profileState ||
    currentUser === null
  ) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900 dark:border-gray-100 mx-auto"></div>
          <p className="mt-4 text-gray-600 dark:text-gray-300">Loading profile...</p>
        </div>
      </div>
    );
  }

  // Jika sudah selesai loading tapi data tidak ada
  if (!profileState && !profileProccess.profileIdLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p className="text-gray-600 dark:text-gray-300">Profile not found</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white dark:bg-neutral-900">
      {/* Header */}
      <div className="sticky top-0 bg-background dark:bg-sidebar backdrop-blur-md z-10 border-b border-border">
        <div className="flex items-center gap-4 p-4">
          <button
            onClick={() => navigate("/")}
            className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-full transition"
          >
            <ArrowLeft className="w-5 h-5 text-gray-700 dark:text-gray-200" />
          </button>
          <h1 className="text-xl font-bold text-gray-800 dark:text-gray-100">
            {profileState.fullname}
          </h1>
        </div>
      </div>

      {/* Cover Image */}
      <div className="relative">
        <div
          className="h-48 bg-linear-to-r from-yellow-200 via-green-200 to-yellow-300"
          style={{
            backgroundImage: profileState.photo_profile
              ? `url(${profileState.photo_profile?.startsWith('http') ? profileState.photo_profile : `http://localhost:4000/uploads/${profileState.photo_profile}`})`
              : undefined,
            backgroundSize: "cover",
            backgroundPosition: "center",
          }}
        />

        {/* Profile Picture */}
        <div className="absolute bottom-6 left-4">
          <div className="relative">
            <img
              src={
                profileState.photo_profile
                  ? (profileState.photo_profile?.startsWith('http') ? profileState.photo_profile : `http://localhost:4000/uploads/${profileState.photo_profile}`)
                  : "https://ui-avatars.com/api/?name=" +
                    (profileState.fullname || "User")
              }
              alt={profileState.fullname}
              className="w-24 h-24 rounded-full border-4 border-white dark:border-gray-800 object-cover bg-gray-200 dark:bg-gray-800"
            />
          </div>
        </div>

        {currentUser?.id === Number(id) ? (
          <div className="flex justify-end p-4">
            <button
              onClick={() => setIsEditModalOpen(true)}
              className="px-4 py-1.5 border border-gray-300 dark:border-gray-700 rounded-full text-sm font-semibold text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-800 transition"
            >
              Edit Profile
            </button>
          </div>
        ) : (
          <div className="flex justify-end p-4">
            <button
              onClick={handleFollow}
              disabled={isLoading}
              className={`px-4 py-1.5 border rounded-full text-sm font-semibold transition ${
                followingUsers[profileState.id]
                  ? "border-gray-600 text-black dark:text-white hover:bg-gray-100 dark:hover:bg-gray-800"
                  : "border-gray-300 dark:border-gray-700 text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-800"
              } ${isLoading ? "opacity-50 cursor-not-allowed" : ""}`}
            >
              {isLoading ? "Loading..." : followingUsers[profileState.id] ? "Following" : "Follow"}
            </button>
          </div>
        )}
      </div>

      {/* Profile Info */}
      <div className="px-4 mt-2 mb-6">
        <h2 className="text-xl font-bold text-gray-800 dark:text-gray-100">
          {profileState.fullname}
        </h2>
        <p className="text-sm text-gray-500 dark:text-gray-400 mb-3">@{profileState.username}</p>

        {profileState.bio && (
          <p className="text-sm text-gray-700 dark:text-gray-300 mb-3">{profileState.bio}</p>
        )}
        {currentUser.id === Number(id) ? (
          <Link to="/follows">
            <div className="flex gap-4 text-sm">
              <div className="flex gap-2">
                <span className="font-bold text-gray-800 dark:text-gray-100">
                  {currentUserFollowingCount}
                </span>
                <span className="text-gray-500 dark:text-gray-400">Following</span>
              </div>
              <div className="flex gap-2">
                <span className="font-bold text-gray-800 dark:text-gray-100">
                  {profileState._count?.followers || 0}
                </span>
                <span className="text-gray-500 dark:text-gray-400">Followers</span>
              </div>
            </div>
          </Link>
        ) : (
          <div className="flex gap-4 text-sm">
            <div className="flex gap-2">
              <span className="font-bold text-gray-800 dark:text-gray-100">
                {profileState._count?.following || 0}
              </span>
              <span className="text-gray-500 dark:text-gray-400">Following</span>
            </div>
            <div className="flex gap-2">
              <span className="font-bold text-gray-800 dark:text-gray-100">
                {(profileState._count?.followers || 0) + followerCountOffset}
              </span>
              <span className="text-gray-500 dark:text-gray-400">Followers</span>
            </div>
          </div>
        )}
      </div>

      {/* Tabs */}
      <div className="border-b border-gray-200 dark:border-gray-700">
        <div className="flex">
          <button
            onClick={() => setActiveTab("allpost")}
            className={`flex-1 py-4 text-sm font-semibold transition relative ${
              activeTab === "allpost"
                ? "text-gray-800 dark:text-gray-100"
                : "text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200"
            }`}
          >
            All Post
            {activeTab === "allpost" && (
              <div className="absolute bottom-0 left-0 right-0 h-1 bg-green-500 rounded-t-full" />
            )}
          </button>
          <button
            onClick={() => setActiveTab("media")}
            className={`flex-1 py-4 text-sm font-semibold transition relative ${
              activeTab === "media"
                ? "text-gray-800 dark:text-gray-100"
                : "text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200"
            }`}
          >
            Media
            {activeTab === "media" && (
              <div className="absolute bottom-0 left-0 right-0 h-1 bg-green-500 rounded-t-full" />
            )}
          </button>
        </div>
      </div>

      {/* Posts */}
      <div>
        {activeTab === "allpost" && (
          <>
            {userThreads.length > 0 ? (
              userThreads.map((thread) => (
                <ThreadSide
                  key={thread.id}
                  id={thread.id}
                  image={thread.image}
                  content={thread.content}
                  user={thread.user}
                  createdAt={thread.createdAt}
                  likes={thread.likes}
                  reply={thread.reply}
                  isliked={thread.isliked}
                  likeId={thread.likeId}
                />
              ))
            ) : (
              <div className="text-center py-12 text-gray-500 dark:text-gray-400">
                No posts yet
              </div>
            )}
          </>
        )}

        {activeTab === "media" && (
          <>
            {mediaThreads.length > 0 ? (
              mediaThreads.map((thread) => (
                <MediaProfile key={thread.id} image={thread.image} />
              ))
            ) : (
              <div className="text-center py-12 text-gray-500 dark:text-gray-400">
                No media posts yet
              </div>
            )}
          </>
        )}
      </div>

      <ModalUpdateProfile
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
      />
    </div>
  );
}
