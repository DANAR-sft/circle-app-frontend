import type { IMediaProfile } from "@/types/types";
import { X, ChevronLeft, ChevronRight } from "lucide-react";
import { useState } from "react";

export function MediaProfile({ image }: IMediaProfile) {
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

  return (
    <div className="flex flex-row border-b border-gray-200 dark:border-gray-700 p-4 hover:bg-white/5 transition duration-200 cursor-pointer text-black dark:text-gray-100 max-h-300">
      <div className="flex-1 w-full relative">
        {image && image.length > 0 && (
          <div className="mb-3 mt-3 w-full">
            {/* Unified 3x3 grid preview (max 9 images) */}
            <div className="grid grid-cols-3 gap-0.5 rounded-2xl overflow-hidden border border-gray-300 w-full">
              {(showAllImages ? image : image.slice(0, 9)).map((img, index) => (
                <div key={index} className="relative aspect-square">
                  <img
                    src={(img?.startsWith('http') ? img : (img?.startsWith('http') ? img : `http://localhost:4000/uploads/${img}`))}
                    alt={`Thread content ${index + 1}`}
                    className="w-full h-full object-cover cursor-pointer hover:opacity-90 transition-opacity"
                    onClick={() => openZoom(img, index)}
                  />

                  {/* Overlay for remaining images when not showing all */}
                  {!showAllImages && index === 8 && image.length > 9 && (
                    <div
                      onClick={() => setShowAllImages(true)}
                      className="absolute inset-0 bg-black/60 flex items-center justify-center cursor-pointer hover:bg-black/70 transition-colors"
                    >
                      <span className="text-white font-bold text-xl">
                        +{image.length - 9}
                      </span>
                    </div>
                  )}
                </div>
              ))}
            </div>

            {showAllImages && image.length > 9 && (
              <button
                onClick={() => setShowAllImages(false)}
                className="mt-2 text-sm text-blue-500 dark:text-blue-400 hover:underline"
              >
                Show less
              </button>
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
              src={(zoomImage?.startsWith('http') ? zoomImage : (zoomImage?.startsWith('http') ? zoomImage : `http://localhost:4000/uploads/${zoomImage}`))}
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
      </div>
    </div>
  );
}
