import type { IThreadProps } from "@/types/types";
import {
  Heart,
  MessageCircle,
  X,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { useState, memo } from "react";
import { Link } from "react-router-dom";
import { useAppDispatch } from "@/app/hooks";
import { PostLike, DeleteLikeById } from "@/hooks/likeSlice";
import {
  toggleLikeOptimistic,
  revertLikeOptimistic,
} from "@/hooks/threadSlice";

export const ThreadSide = memo(function ThreadSide({
  id,
  image,
  content,
  user,
  createdAt,
  likes,
  reply,
  isliked,
  likeId,
}: IThreadProps) {
  const dispatch = useAppDispatch();
  const [isLiking, setIsLiking] = useState(false); // Prevent double clicks
  const [showAllImages, setShowAllImages] = useState(false);
  const [zoomImage, setZoomImage] = useState<string | null>(null);
  const [zoomIndex, setZoomIndex] = useState(0);

  const openZoom = (img: string, index: number) => {
    setZoomImage(img);
    setZoomIndex(index);
  };

  const closeZoom = () => {
    setZoomImage(null);
  };

  const nextImage = () => {
    if (image && zoomIndex < image.length - 1) {
      setZoomIndex(zoomIndex + 1);
      setZoomImage(image[zoomIndex + 1]);
    }
  };

  const prevImage = () => {
    if (image && zoomIndex > 0) {
      setZoomIndex(zoomIndex - 1);
      setZoomImage(image[zoomIndex - 1]);
    }
  };

  const formatTimeAgo = (dateString: string) => {
    const now = new Date();
    const date = new Date(dateString);
    const seconds = Math.floor((now.getTime() - date.getTime()) / 1000);

    let interval = seconds / 31536000;
    if (interval > 1) return Math.floor(interval) + "y";
    interval = seconds / 2592000;
    if (interval > 1) return Math.floor(interval) + "mo";
    interval = seconds / 86400;
    if (interval > 1) return Math.floor(interval) + "d";
    interval = seconds / 3600;
    if (interval > 1) return Math.floor(interval) + "h";
    interval = seconds / 60;
    if (interval > 1) return Math.floor(interval) + "m";
    return Math.floor(seconds) + "s";
  };

  return (
    <div className="flex flex-row border-b border-gray-200 dark:border-gray-700 p-4 hover:bg-white/5 transition duration-200 cursor-pointer text-black dark:text-gray-100 max-h-300">
      <div className="mr-3 shrink-0">
        <img
          src={
            user.photo_profile
              ? (user.photo_profile?.startsWith('http') ? user.photo_profile : `http://localhost:4000/uploads/${user.photo_profile}`)
              : "https://ui-avatars.com/api/?name=" + user.fullname
          }
          alt={user.fullname}
          className="w-10 h-10 rounded-full object-cover bg-gray-600"
        />
      </div>
      <div className="flex-1 w-full relative">
        <Link to={`/profile/${user.id}`}>
          <div className="flex flex-wrap items-center gap-2 mb-1">
            <span className="font-bold text-sm text-black dark:text-white">
              {user.fullname}
            </span>
            <span className="text-zinc-500 dark:text-zinc-400 text-sm">
              @{user.username}
            </span>
            <span className="text-zinc-500 dark:text-zinc-400 text-[10px]">
              •
            </span>
            <span className="text-zinc-500 dark:text-zinc-400 text-sm">
              {formatTimeAgo(createdAt)}
            </span>
          </div>
        </Link>
        <div className="text-gray-600 dark:text-gray-300 mb-3 text-sm leading-relaxed whitespace-pre-wrap">
          {content}
        </div>

        {image && image.length > 0 && (
          <div className="mb-3 mt-3 max-w-lg">
            {image.length === 1 && (
              <div
                className="rounded-2xl overflow-hidden border border-gray-300 dark:border-gray-600 cursor-pointer"
                onClick={() => openZoom(image[0], 0)}
              >
                <img
                  src={(image[0]?.startsWith('http') ? image[0] : `http://localhost:4000/uploads/${image[0]}`)}
                  alt="Thread content"
                  className="w-full max-h-[512px] object-cover hover:opacity-90 transition-opacity"
                />
              </div>
            )}

            {image.length === 2 && (
              <div className="grid grid-cols-2 gap-0.5 rounded-2xl overflow-hidden border border-gray-300">
                {image.map((img, index) => (
                  <img
                    key={index}
                    src={(img?.startsWith('http') ? img : `http://localhost:4000/uploads/${img}`)}
                    alt={`Thread content ${index + 1}`}
                    className="w-full h-72 object-cover cursor-pointer hover:opacity-90 transition-opacity"
                    onClick={() => openZoom(img, index)}
                  />
                ))}
              </div>
            )}

            {image.length === 3 && (
              <div className="grid grid-cols-2 gap-0.5 rounded-2xl overflow-hidden border border-gray-300 h-72">
                <img
                  src={(image[0]?.startsWith('http') ? image[0] : `http://localhost:4000/uploads/${image[0]}`)}
                  alt="Thread content 1"
                  className="w-full h-full object-cover row-span-2 cursor-pointer hover:opacity-90 transition-opacity"
                  onClick={() => openZoom(image[0], 0)}
                />
                <div className="flex flex-col gap-0.5">
                  <img
                    src={(image[1]?.startsWith('http') ? image[1] : `http://localhost:4000/uploads/${image[1]}`)}
                    alt="Thread content 2"
                    className="w-full h-36 object-cover cursor-pointer hover:opacity-90 transition-opacity"
                    onClick={() => openZoom(image[1], 1)}
                  />
                  <img
                    src={(image[2]?.startsWith('http') ? image[2] : `http://localhost:4000/uploads/${image[2]}`)}
                    alt="Thread content 3"
                    className="w-full h-36 object-cover cursor-pointer hover:opacity-90 transition-opacity"
                    onClick={() => openZoom(image[2], 2)}
                  />
                </div>
              </div>
            )}

            {image.length >= 4 && (
              <>
                <div className="grid grid-cols-2 gap-0.5 rounded-2xl overflow-hidden border border-gray-300">
                  {(showAllImages ? image : image.slice(0, 4)).map(
                    (img, index) => (
                      <div key={index} className="relative">
                        <img
                          src={(img?.startsWith('http') ? img : `http://localhost:4000/uploads/${img}`)}
                          alt={`Thread content ${index + 1}`}
                          className="w-full h-36 object-cover cursor-pointer hover:opacity-90 transition-opacity"
                          onClick={() => openZoom(img, index)}
                        />
                        {!showAllImages && index === 3 && image.length > 4 && (
                          <div
                            onClick={() => setShowAllImages(true)}
                            className="absolute inset-0 bg-black/60 flex items-center justify-center cursor-pointer hover:bg-black/70 transition-colors"
                          >
                            <span className="text-white font-bold text-xl">
                              +{image.length - 4}
                            </span>
                          </div>
                        )}
                      </div>
                    ),
                  )}
                </div>
                {showAllImages && image.length > 4 && (
                  <button
                    onClick={() => setShowAllImages(false)}
                    className="mt-2 text-sm text-blue-500 dark:text-blue-400 hover:underline"
                  >
                    Show less
                  </button>
                )}
              </>
            )}
          </div>
        )}
        {/* Zoom Modal */}
        {zoomImage && (
          <div
            className="fixed inset-0 bg-black/90 z-50 flex items-center justify-center"
            onClick={closeZoom}
          >
            {/* Close button */}
            <button
              onClick={closeZoom}
              className="absolute top-4 right-4 text-white hover:text-gray-300 transition-colors z-10"
            >
              <X className="w-8 h-8" />
            </button>

            {/* Previous button */}
            {image && zoomIndex > 0 && (
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  prevImage();
                }}
                className="absolute left-4 text-white hover:text-gray-300 transition-colors z-10"
              >
                <ChevronLeft className="w-10 h-10" />
              </button>
            )}

            {/* Image */}
            <img
              src={(zoomImage?.startsWith('http') ? zoomImage : `http://localhost:4000/uploads/${zoomImage}`)}
              alt="Zoomed content"
              className="max-w-[90vw] max-h-[90vh] object-contain"
              onClick={(e) => e.stopPropagation()}
            />

            {/* Next button */}
            {image && zoomIndex < image.length - 1 && (
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  nextImage();
                }}
                className="absolute right-4 text-white hover:text-gray-300 transition-colors z-10"
              >
                <ChevronRight className="w-10 h-10" />
              </button>
            )}

            {/* Image counter */}
            {image && image.length > 1 && (
              <div className="absolute bottom-4 text-white text-sm">
                {zoomIndex + 1} / {image.length}
              </div>
            )}
          </div>
        )}
        <div className="flex items-center gap-6 text-gray-500 mt-2">
          <div className="flex items-center gap-2 group cursor-pointer transition-colors duration-200 hover:text-red-500">
            <Heart
              className={`w-4 h-4 transition-all duration-200 ${
                isliked
                  ? "fill-red-500 text-red-500"
                  : "group-hover:text-red-500"
              } ${isLiking ? "opacity-50" : ""}`}
              onClick={async () => {
                if (isLiking) return; // Prevent double clicks
                setIsLiking(true);
                const wasLiked = !!isliked;

                // Optimistic UI Update
                dispatch(toggleLikeOptimistic(id));

                try {
                  if (wasLiked && likeId) {
                    // Unlike: delete the like
                    await dispatch(DeleteLikeById(likeId)).unwrap();
                  } else if (!wasLiked) {
                    // Like: create new like
                    await dispatch(PostLike({ threadId: id })).unwrap();
                  }
                } catch (error) {
                  console.error("Failed to toggle like:", error);
                  // Roll-back Optimistic Update
                  dispatch(revertLikeOptimistic({ threadId: id, wasLiked }));
                } finally {
                  setIsLiking(false);
                }
              }}
            />
            <span
              className={`text-xs ${isliked ? "text-red-500" : "group-hover:text-red-500"}`}
            >
              {likes}
            </span>
          </div>

          <Link to={`/status/${id}`} className="no-underline">
            <div className="flex items-center gap-2 group cursor-pointer transition-colors duration-200 hover:text-blue-500">
              <MessageCircle className="w-4 h-4 group-hover:text-blue-500" />
              <span className="text-xs group-hover:text-blue-500">
                {reply} Replies
              </span>
            </div>
          </Link>
        </div>
      </div>
    </div>
  );
});
