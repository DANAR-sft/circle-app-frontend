import type { IThreadByIdWithImgProps } from "@/types/types";
import { Heart, MessageCircle } from "lucide-react";
import { useState } from "react";

export function DetailThread({ thread }: { thread: IThreadByIdWithImgProps }) {
  const [showAllImages, setShowAllImages] = useState(false);

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleString("id-ID", {
      hour: "2-digit",
      minute: "2-digit",
      day: "numeric",
      month: "short",
      year: "numeric",
    });
  };

  const imagesToShow =
    showAllImages || !thread.image ? thread.image : thread.image.slice(0, 4);

  return (
    <div className="border-b border-gray-200 dark:border-gray-700 pb-4">
      {/* User Info */}
      <div className="flex items-start gap-3 mb-4">
        <img
          src={
            thread.user.photo_profile
              ? (thread.user.photo_profile?.startsWith('http') ? thread.user.photo_profile : (thread.user.photo_profile?.startsWith('http') ? thread.user.photo_profile : `http://localhost:4000/uploads/${thread.user.photo_profile}`))
              : "https://ui-avatars.com/api/?name=" + thread.user.fullname
          }
          alt={thread.user.fullname}
          className="w-10 h-10 rounded-full object-cover bg-gray-600"
        />
        <div>
          <p className="font-semibold text-black dark:text-white">
            {thread.user.fullname}
          </p>
          <p className="text-zinc-500 dark:text-zinc-400 text-sm">
            @{thread.user.username}
          </p>
        </div>
      </div>

      {/* Content */}
      <p className="text-gray-700 dark:text-gray-300 mb-4 whitespace-pre-wrap">
        {thread.content}
      </p>

      {/* Images */}
      {thread.image && thread.image.length > 0 && (
        <div
          className={`grid gap-2 mb-4 ${
            thread.image.length === 1
              ? "grid-cols-1"
              : thread.image.length === 2
                ? "grid-cols-2"
                : "grid-cols-2"
          }`}
        >
          {imagesToShow?.map((img, index) => (
            <div key={index} className="relative">
              <img
                src={(img?.startsWith('http') ? img : (img?.startsWith('http') ? img : `http://localhost:4000/uploads/${img}`))}
                alt={`Thread image ${index + 1}`}
                className="w-full rounded-lg object-cover max-h-80"
              />
              {!showAllImages &&
                thread.image &&
                thread.image.length > 4 &&
                index === 3 && (
                  <button
                    onClick={() => setShowAllImages(true)}
                    className="absolute inset-0 bg-black/60 rounded-lg flex items-center justify-center text-white text-xl font-bold"
                  >
                    +{thread.image.length - 4}
                  </button>
                )}
            </div>
          ))}
        </div>
      )}

      {/* Date */}
      <p className="text-sm text-gray-400 mb-4">
        {formatDate(thread.createdAt)}
      </p>

      {/* Stats */}
      <div className="flex items-center gap-6 py-3 border-t border-b border-gray-700">
        <div className="flex items-center gap-2">
          <Heart className="w-5 h-5 text-gray-400" />
          <span className="text-gray-400">{thread.likes} Likes</span>
        </div>
        <div className="flex items-center gap-2">
          <MessageCircle className="w-5 h-5 text-gray-400" />
          <span className="text-gray-400">{thread.replies} Replies</span>
        </div>
      </div>
    </div>
  );
}
