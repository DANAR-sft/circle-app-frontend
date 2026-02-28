import { Github, Linkedin, Facebook, Instagram } from "lucide-react";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
} from "@/components/ui/sidebar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "./ui/button";
import { useIsMobile } from "@/hooks/use-mobile";
import { useAppSelector, useAppDispatch } from "@/app/hooks";
import {
  FollowUser,
  UnFollowUser,
  setFollowingUsers,
  setInitialFollowingCount,
  toggleFollowOptimistic,
  revertFollowOptimistic,
} from "@/hooks/followSlice";
import { useEffect, useState } from "react";
import { Link } from "react-router";

export function ProfileSideBar() {
  const isMobile = useIsMobile();
  const dispatch = useAppDispatch();
  const profile = useAppSelector((state) => state.profile.profile);
  const allProfiles = useAppSelector((state) => state.profile.allProfiles);
  const followingUsers = useAppSelector((state) => state.follow.followingUsers);
  const currentUserFollowingCount = useAppSelector(
    (state) => state.follow.currentUserFollowingCount,
  );
  const [loadingUsers, setLoadingUsers] = useState<Record<number, boolean>>({});

  // Initialize follow states when profiles load
  useEffect(() => {
    if (allProfiles.length > 0) {
      const users = allProfiles.map((user) => ({
        id: user.id,
        isFollowing: user.isFollowing || false,
      }));
      dispatch(setFollowingUsers(users));
    }
  }, [allProfiles, dispatch]);

  // Initialize following count from profile
  useEffect(() => {
    if (profile?.following_count !== undefined) {
      dispatch(setInitialFollowingCount(profile.following_count));
    }
  }, [profile?.following_count, dispatch]);

  const handleFollow = async (userId: number) => {
    if (loadingUsers[userId]) return;

    const wasFollowing = followingUsers[userId] || false;

    // Optimistic update
    setLoadingUsers((prev) => ({ ...prev, [userId]: true }));
    dispatch(toggleFollowOptimistic(userId));

    try {
      if (wasFollowing) {
        await dispatch(UnFollowUser(userId)).unwrap();
      } else {
        await dispatch(FollowUser(userId)).unwrap();
      }
    } catch (error) {
      // Revert on error
      dispatch(revertFollowOptimistic({ userId, wasFollowing }));
    } finally {
      setLoadingUsers((prev) => ({ ...prev, [userId]: false }));
    }
  };

  if (isMobile) return null;

  return (
    <Sidebar side="right">
      <SidebarContent className="px-6 pt-6 gap-2">
        <SidebarGroup className="p-0">
          <SidebarGroupContent>
            {/* My Profile Card */}
            <Card className="bg-white dark:bg-neutral-800 border dark:border-gray-700">
              <CardHeader className="pb-2">
                <CardTitle className="text-black dark:text-white text-lg">
                  My Profile
                </CardTitle>
              </CardHeader>
              <CardContent className="py-4 border-t">
                <div className="flex items-start justify-between mb-3">
                  <img
                    src={
                      profile?.avatar
                        ? (profile.avatar?.startsWith('http') ? profile.avatar : (profile.avatar?.startsWith('http') ? profile.avatar : `http://localhost:4000/uploads/${profile.avatar}`))
                        : "https://ui-avatars.com/api/?name=" +
                          (profile?.name || "User")
                    }
                    alt="Profile"
                    className="w-16 h-16 rounded-full object-cover"
                  />
                  <Link to={`/profile/${profile?.id}`}>
                    <Button
                      variant="outline"
                      size="sm"
                      className="rounded-full text-xs border-zinc-600 dark:border-gray-600 text-black dark:text-white hover:bg-zinc-100 dark:hover:bg-zinc-800"
                    >
                      Edit Profile
                    </Button>
                  </Link>
                </div>
                <h3 className="text-black dark:text-white font-semibold text-lg">
                  {profile?.name || "User"}
                </h3>
                <p className="text-zinc-500 dark:text-zinc-400 text-sm">
                  @{profile?.username || "username"}
                </p>
                <p className="text-black dark:text-white text-sm mt-1">
                  {profile?.bio || "No bio yet"}
                </p>
                <div className="flex gap-2 mt-3 text-sm">
                  <span className="text-black dark:text-white font-semibold">
                    {currentUserFollowingCount}
                  </span>
                  <span className="text-zinc-500 dark:text-zinc-400">
                    Following
                  </span>
                  <span className="text-black dark:text-white font-semibold ml-2">
                    {profile?.follower_count || 0}
                  </span>
                  <span className="text-zinc-500 dark:text-zinc-400">
                    Followers
                  </span>
                </div>
              </CardContent>
            </Card>

            {/* Suggested for you Card */}
            {allProfiles.filter((user) => !followingUsers[user.id]).length >
              0 && (
              <Card className="bg-white dark:bg-neutral-800 border dark:border-gray-700 mt-2">
                <CardHeader className="pb-2">
                  <CardTitle className="text-black dark:text-white text-lg">
                    Suggested for you
                  </CardTitle>
                </CardHeader>
                <CardContent className="pb-2">
                  <div className="space-y-3">
                    {allProfiles
                      .filter((user) => !followingUsers[user.id])
                      .slice(0, 5)
                      .map((user) => (
                        <div
                          key={user.id}
                          className="flex items-center justify-between"
                        >
                          <div className="flex items-center gap-2">
                            <Link
                              to={`/profile/${user.id}`}
                              key={user.id}
                              className="flex items-center gap-2"
                            >
                              <img
                                src={
                                  user.photo_profile
                                    ? (user.photo_profile?.startsWith('http') ? user.photo_profile : (user.photo_profile?.startsWith('http') ? user.photo_profile : `http://localhost:4000/uploads/${user.photo_profile}`))
                                    : "https://ui-avatars.com/api/?name=" +
                                      (user.fullname || "User")
                                }
                                alt={user.fullname}
                                className="w-10 h-10 rounded-full object-cover"
                              />
                              <div>
                                <p className="text-black dark:text-white text-sm font-medium">
                                  {user.fullname}
                                </p>
                                <p className="text-zinc-500 dark:text-zinc-400 text-xs">
                                  @{user.username}
                                </p>
                              </div>
                            </Link>
                          </div>
                          <Button
                            onClick={() => handleFollow(user.id)}
                            disabled={loadingUsers[user.id]}
                            variant={
                              followingUsers[user.id] ? "outline" : "default"
                            }
                            size="sm"
                            className={`rounded-full text-xs ${
                              followingUsers[user.id]
                                ? "border-zinc-600 dark:border-gray-600 text-black dark:text-white hover:bg-zinc-200 dark:hover:bg-zinc-700"
                                : "bg-white dark:bg-neutral-800 text-black dark:text-white border border-zinc-600 dark:border-gray-600 hover:bg-zinc-200 dark:hover:bg-zinc-700"
                            } ${loadingUsers[user.id] ? "opacity-50 cursor-not-allowed" : ""}`}
                          >
                            {loadingUsers[user.id]
                              ? "Loading..."
                              : followingUsers[user.id]
                                ? "Following"
                                : "Follow"}
                          </Button>
                        </div>
                      ))}
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Footer Card */}
            <Card className="bg-white dark:bg-neutral-800 border dark:border-gray-700 mt-2">
              <CardContent className="py-4">
                <div className="flex items-center gap-2 text-sm text-zinc-400 dark:text-zinc-300">
                  <span>Developed by</span>
                  <span className="text-black dark:text-white font-semibold">
                    Danar
                  </span>
                  <span>•</span>
                  <div className="flex gap-2">
                    <a
                      href="#"
                      className="hover:text-black dark:hover:text-white"
                    >
                      <Github className="w-4 h-4" />
                    </a>
                    <a
                      href="#"
                      className="hover:text-black dark:hover:text-white"
                    >
                      <Linkedin className="w-4 h-4" />
                    </a>
                    <a
                      href="#"
                      className="hover:text-black dark:hover:text-white"
                    >
                      <Facebook className="w-4 h-4" />
                    </a>
                    <a
                      href="#"
                      className="hover:text-black dark:hover:text-white "
                    >
                      <Instagram className="w-4 h-4" />
                    </a>
                  </div>
                </div>
                <div className="flex flex-col mt-2 gap-2 text-xs text-zinc-500 dark:text-zinc-400">
                  <div className="flex flex-row gap-1">
                    <span>Powered by</span>
                    <span>DumbWays Indonesia</span>
                  </div>

                  <div className="flex flex-row gap-1">
                    <span>#1 Coding Bootcamp</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
}
