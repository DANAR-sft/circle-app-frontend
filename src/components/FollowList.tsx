import { Button } from "./ui/button";
import type { IFollowListProps } from "@/types/types";
import { useAppDispatch, useAppSelector } from "@/app/hooks";
import { useEffect, useState } from "react";
import {
  GetFollows,
  FollowUser,
  UnFollowUser,
  resetRefresh,
  toggleFollowOptimistic,
  revertFollowOptimistic,
} from "@/hooks/followSlice";
import { Link } from "react-router-dom";
import { useAlert } from "@/context/AlertContext";
import { ProfileSkeleton } from "@/components/Skeleton";

export function FollowList({ isActive }: IFollowListProps) {
  const dispatch = useAppDispatch();
  const { data, loading, shouldRefresh, followingUsers } = useAppSelector(
    (state) => state.follow,
  );
  const { showSuccess } = useAlert();
  const [loadingUsers, setLoadingUsers] = useState<Record<number, boolean>>({});

  useEffect(() => {
    dispatch(GetFollows(isActive));
  }, [dispatch, isActive]);

  // Refresh data when socket triggers shouldRefresh
  useEffect(() => {
    if (shouldRefresh) {
      dispatch(GetFollows(isActive));
      dispatch(resetRefresh());
    }
  }, [shouldRefresh, dispatch, isActive]);

  const handleFollow = async (id: number) => {
    setLoadingUsers((prev) => ({ ...prev, [id]: true }));
    dispatch(toggleFollowOptimistic(id));

    try {
      await dispatch(FollowUser(id)).unwrap();
      dispatch(GetFollows(isActive));
      showSuccess("Successfully followed the user");
    } catch (error) {
      dispatch(revertFollowOptimistic({ userId: id, wasFollowing: false }));
    } finally {
      setLoadingUsers((prev) => ({ ...prev, [id]: false }));
    }
  };

  const handleUnfollow = async (id: number) => {
    setLoadingUsers((prev) => ({ ...prev, [id]: true }));
    dispatch(toggleFollowOptimistic(id));

    try {
      await dispatch(UnFollowUser(id)).unwrap();
      dispatch(GetFollows(isActive));
      showSuccess("Successfully unfollowed the user");
    } catch (error) {
      dispatch(revertFollowOptimistic({ userId: id, wasFollowing: true }));
    } finally {
      setLoadingUsers((prev) => ({ ...prev, [id]: false }));
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col">
        {[1, 2, 3, 4, 5].map((key) => (
          <ProfileSkeleton key={key} />
        ))}
      </div>
    );
  }

  if (!data || data.length === 0) {
    return (
      <div className="p-4 text-center text-gray-500">No {isActive} yet</div>
    );
  }

  return (
    <div>
      {isActive === "followers" &&
        data?.map((item: any) => {
          if (!item?.follower) return null;
          return (
            <div
              key={item.id}
              className="flex flex-row items-center gap-3 w-full border-b border-gray-200 dark:border-gray-700 p-4"
            >
              <Link
                to={`/profile/${item.follower.id}`}
                key={item.id}
                className="flex flex-row items-center gap-3 w-full"
              >
                <div className="flex-shrink-0">
                  <img
                    src={
                      item.follower.photo_profile
                        ? (item.follower.photo_profile?.startsWith('http') ? item.follower.photo_profile : (item.follower.photo_profile?.startsWith('http') ? item.follower.photo_profile : `http://localhost:4000/uploads/${item.follower.photo_profile}`))
                        : "https://ui-avatars.com/api/?name=" +
                          item.follower.fullname
                    }
                    alt={item.follower.fullname}
                    className="w-10 h-10 rounded-full object-cover"
                  />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-semibold text-black dark:text-white truncate">
                    {item.follower.fullname}
                  </p>
                  <p className="text-sm text-gray-400 dark:text-gray-300 truncate">
                    @{item.follower.username}
                  </p>
                  <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                    {item.follower.bio || "All for jesus and the A #GoBraves"}
                  </p>
                </div>
              </Link>
              <div className="flex-shrink-0">
                {(followingUsers[item.follower.id] ?? item.isFollowedBack) ? (
                  <Button
                    onClick={() => handleUnfollow(item.follower.id)}
                    disabled={loadingUsers[item.follower.id]}
                    className={`bg-transparent border border-gray-600 dark:border-gray-600 text-black dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full px-4 py-1 font-semibold ${loadingUsers[item.follower.id] ? "opacity-50 cursor-not-allowed" : ""}`}
                  >
                    {loadingUsers[item.follower.id]
                      ? "Loading..."
                      : "Following"}
                  </Button>
                ) : (
                  <Button
                    onClick={() => handleFollow(item.follower.id)}
                    disabled={loadingUsers[item.follower.id]}
                    className={`bg-white dark:bg-neutral-800 border border-gray-600 dark:border-gray-600 text-black dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full px-6 py-1 font-semibold ${loadingUsers[item.follower.id] ? "opacity-50 cursor-not-allowed" : ""}`}
                  >
                    {loadingUsers[item.follower.id] ? "Loading..." : "Follow"}
                  </Button>
                )}
              </div>
            </div>
          );
        })}

      {isActive === "following" &&
        data?.map((item: any) => {
          if (!item?.following) return null;
          return (
            <div
              key={item.id}
              className="flex flex-row items-center w-full border-b border-gray-200 dark:border-gray-700 p-4"
            >
              <Link
                to={`/profile/${item.following.id}`}
                key={item.id}
                className="flex flex-row items-center gap-3 w-full"
              >
                <div className="flex-shrink-0">
                  <img
                    src={
                      item.following.photo_profile
                        ? (item.following.photo_profile?.startsWith('http') ? item.following.photo_profile : (item.following.photo_profile?.startsWith('http') ? item.following.photo_profile : `http://localhost:4000/uploads/${item.following.photo_profile}`))
                        : "https://ui-avatars.com/api/?name=" +
                          item.following.fullname
                    }
                    alt={item.following.fullname}
                    className="w-10 h-10 rounded-full object-cover"
                  />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-semibold text-black dark:text-white truncate">
                    {item.following.fullname}
                  </p>
                  <p className="text-sm text-gray-400 dark:text-gray-300 truncate">
                    @{item.following.username}
                  </p>
                  <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                    {item.following.bio || "All for jesus and the A #GoBraves"}
                  </p>
                </div>
              </Link>
              <div className="flex-shrink-0">
                <Button
                  onClick={() => handleUnfollow(item.following.id)}
                  disabled={loadingUsers[item.following.id]}
                  className={`bg-transparent border border-gray-600 dark:border-gray-600 text-black dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full px-4 py-1 font-semibold ${loadingUsers[item.following.id] ? "opacity-50 cursor-not-allowed" : ""}`}
                >
                  {loadingUsers[item.following.id] ? "Loading..." : "Following"}
                </Button>
              </div>
            </div>
          );
        })}
    </div>
  );
}
