import { useRef, useState } from "react";
import { useAppDispatch, useAppSelector } from "@/app/hooks";
import { SearchProfiles, clearSearch } from "@/hooks/searchSlice";
import { Search } from "lucide-react";
import { Link } from "react-router";
import {
  FollowUser,
  UnFollowUser,
  toggleFollowOptimistic,
  revertFollowOptimistic,
} from "@/hooks/followSlice";

export function SearchInput() {
  const dispatch = useAppDispatch();
  const searchState = useAppSelector((state) => state.search);
  const profile = useAppSelector((state) => state.profile.profile);
  const followingUsers = useAppSelector((state) => state.follow.followingUsers);
  const searchRef = useRef<HTMLInputElement>(null);
  const [loadingUserId, setLoadingUserId] = useState<number | null>(null);

  const handleSearch = () => {
    const keyword = searchRef.current?.value;
    if (keyword) {
      dispatch(SearchProfiles(keyword));
      searchRef.current!.value = "";
    } else {
      dispatch(clearSearch());
    }
  };

  const handleFollowToggle = async (userId: number) => {
    setLoadingUserId(userId);
    const wasFollowing = followingUsers[userId] || false;

    // Optimistic update using Redux
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
      setLoadingUserId(null);
    }
  };

  return (
    <div>
      <div className="w-full">
        <span className="flex flex-row justify-between w-full p-4 gap-2 items-center">
          <input
            ref={searchRef}
            id="search"
            name="name"
            placeholder="Search...."
            onChange={(e) => {
              searchRef.current!.value = e.target.value;
              if (e.target.value === "") dispatch(clearSearch());
            }}
            className="w-full border border-gray-300 dark:border-gray-700 rounded-full h-8 px-4 focus:outline-none bg-white dark:bg-neutral-800 text-black dark:text-white placeholder-gray-500 dark:placeholder-gray-400"
          />
          <Search className="w-7 h-7" onClick={handleSearch} />
        </span>
        <div>
          {searchState.loading ? (
            <div className="p-4 text-center">Searching...</div>
          ) : searchState.error ? (
            <div className="p-4 text-center text-red-500">
              {searchState.error}
            </div>
          ) : searchState.data == null ? (
            <div />
          ) : Array.isArray(searchState.data) &&
            searchState.data.length === 0 ? (
            <div className="p-4 text-center text-gray-500 dark:text-gray-400">
              No results found
            </div>
          ) : (
            <div>
              {Array.isArray(searchState.data) &&
                searchState.data.map((profileItem: any) => (
                  <div
                    key={profileItem.id}
                    className="flex flex-row items-center justify-between w-full p-4 border-b border-gray-200 gap-3"
                  >
                    <Link
                      to={`/profile/${profileItem.id}`}
                      className="flex flex-row items-start gap-3 flex-1"
                    >
                      <img
                        src={
                          profileItem.photo_profile
                            ? (profileItem.photo_profile?.startsWith('http') ? profileItem.photo_profile : (profileItem.photo_profile?.startsWith('http') ? profileItem.photo_profile : `http://localhost:4000/uploads/${profileItem.photo_profile}`))
                            : "https://ui-avatars.com/api/?name=" +
                              profileItem?.fullname
                        }
                        alt="Profile"
                        className="w-10 h-10 rounded-full object-cover"
                      />
                      <div className="flex flex-col">
                        <span className="font-semibold text-md dark:text-gray-100">
                          {profileItem.fullname}
                        </span>
                        <span className="font-semibold text-sm text-gray-500 dark:text-zinc-400">
                          {profileItem.username}
                        </span>
                        <span className="text-sm text-gray-800 dark:text-gray-300">
                          {profileItem.bio}
                        </span>
                      </div>
                    </Link>
                    {profile && profileItem.id !== profile.id && (
                      <button
                        onClick={() => handleFollowToggle(profileItem.id)}
                        disabled={loadingUserId === profileItem.id}
                        className={`px-4 py-1 border rounded-full transition-colors ${
                          (followingUsers[profileItem.id] ??
                          profileItem.isFollowing)
                            ? "bg-white dark:bg-neutral-800 text-black dark:text-white border-gray-600 dark:border-gray-600 hover:bg-gray-100 dark:hover:bg-gray-700"
                            : "bg-white dark:bg-neutral-800 text-black dark:text-white border-gray-300 dark:border-gray-600 hover:bg-gray-100 dark:hover:bg-gray-700"
                        } ${loadingUserId === profileItem.id ? "opacity-50 cursor-not-allowed" : ""}`}
                      >
                        {loadingUserId === profileItem.id
                          ? "Loading..."
                          : (followingUsers[profileItem.id] ??
                              profileItem.isFollowing)
                            ? "Following"
                            : "Follow"}
                      </button>
                    )}
                  </div>
                ))}
            </div>
          )}
        </div>
      </div>
      {searchRef.current &&
        searchRef.current.value === "" &&
        !searchState.data && (
          <div
            className="h-180
       w-full mx-auto p-16 text-center place-content-center"
          >
            <h1>Write and Search Something</h1>
            <p className="text-sm text-gray-400 dark:text-zinc-400">
              Try searchiing something else or check the spelling of what you
              typed
            </p>
          </div>
        )}
    </div>
  );
}
