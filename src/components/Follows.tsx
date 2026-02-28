import { useState } from "react";
import { FollowList } from "./FollowList";

export function Follows() {
  const [activeTab, setActiveTab] = useState<"followers" | "following">(
    "followers",
  );

  return (
    <div>
      <div>
        <h1 className="text-2xl font-bold ml-4 mt-4">Follows</h1>
      </div>
      <div className="border-b border-gray-200">
        <div className="flex">
          <button
            onClick={() => setActiveTab("followers")}
            className={`flex-1 py-4 text-sm font-semibold transition relative ${
              activeTab === "followers"
                ? "text-gray-800"
                : "text-gray-500 hover:text-gray-700"
            }`}
          >
            Followers
            {activeTab === "followers" && (
              <div className="absolute bottom-0 left-0 right-0 h-1 bg-green-500 rounded-t-full" />
            )}
          </button>
          <button
            onClick={() => setActiveTab("following")}
            className={`flex-1 py-4 text-sm font-semibold transition relative ${
              activeTab === "following"
                ? "text-gray-800"
                : "text-gray-500 hover:text-gray-700"
            }`}
          >
            Following
            {activeTab === "following" && (
              <div className="absolute bottom-0 left-0 right-0 h-1 bg-green-500 rounded-t-full" />
            )}
          </button>
        </div>

        <FollowList isActive={activeTab} />
      </div>
    </div>
  );
}
