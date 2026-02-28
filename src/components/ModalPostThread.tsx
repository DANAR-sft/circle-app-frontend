import type { ModalPostThreadProps } from "@/types/types";
import { useRef, useState } from "react";
import { useAppDispatch } from "@/app/hooks";
import { ImagePlus, X } from "lucide-react";
import { PostThread as PostThreadAction } from "@/hooks/threadSlice";
import { useAlert } from "@/context/AlertContext";

export function ModalPostThread({
  avatar,
  name,
  isOpen,
  onClose,
}: ModalPostThreadProps) {
  const textAreaRef = useRef<HTMLTextAreaElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [previewImages, setPreviewImages] = useState<string[]>([]);
  const dispatch = useAppDispatch();
  const { showSuccess, showError } = useAlert();

  async function handlePost() {
    const files = fileInputRef.current?.files;
    const content = textAreaRef.current?.value;

    if (!content || content.trim() === "") {
      showError("Please enter content for your thread");
      return;
    }

    try {
      await dispatch(
        PostThreadAction({ content, image: files ?? undefined }),
      ).unwrap();

      if (textAreaRef.current) textAreaRef.current.value = "";
      if (fileInputRef.current) fileInputRef.current.value = "";
      setPreviewImages([]);

      showSuccess("Thread posted successfully!");
      onClose();
    } catch (error) {
      console.error("Failed to post thread:", error);
      showError("Failed to post thread. Please try again later.");
    }
  }

  function previewImage(event: React.ChangeEvent<HTMLInputElement>) {
    const input = event.target;
    if (input.files && input.files.length > 0) {
      const previews: string[] = [];
      const maxFiles = Math.min(input.files.length);

      for (let i = 0; i < maxFiles; i++) {
        const reader = new FileReader();
        reader.onload = function (e) {
          previews.push(e.target?.result as string);
          if (previews.length === maxFiles) {
            setPreviewImages(previews);
          }
        };
        reader.readAsDataURL(input.files[i]);
      }
    }
  }

  function removeImage(index: number) {
    const newPreviews = previewImages.filter((_, i) => i !== index);
    setPreviewImages(newPreviews);

    if (newPreviews.length === 0 && fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  }

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 bg-black/50 z-40 flex items-center justify-center p-4"
      onClick={onClose}
    >
      <div
        className="relative w-[90%] md:w-[50%] border rounded-lg p-6 bg-white dark:bg-neutral-800"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="absolute top-1 right-1">
          <button
            onClick={onClose}
            className="p-1 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-full transition"
          >
            <X className="w-5 h-5 text-gray-400 dark:text-gray-300" />
          </button>
        </div>
        <div className="flex flex-col gap-4 w-full mt-4 items-center md:items-start">
          <div className="flex flex-col md:flex-row w-full justify-between gap-2 border-b">
            <img
              src={
                avatar
                  ? (avatar?.startsWith('http') ? avatar : `http://localhost:4000/uploads/${avatar}`)
                  : "https://ui-avatars.com/api/?name=" + name
              }
              alt={name}
              className="hidden md:block w-10 h-10 rounded-full object-cover bg-gray-600"
            />
            <span id="content" className="flex flex-col w-full">
              <textarea
                className="w-full p-2 resize-none border border-gray-200 dark:border-gray-700 rounded-md bg-white dark:bg-neutral-800 text-black dark:text-gray-100 placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none mb-10"
                placeholder="What's going on now?"
                ref={textAreaRef}
              />
            </span>
          </div>
          {previewImages.length > 0 && (
            <div className="grid grid-cols-4 sm:grid-cols-6 md:grid-cols-6 gap-2 w-full mb-2">
              {previewImages.map((src, index) => (
                <div
                  key={index}
                  className="relative w-full aspect-square rounded-lg overflow-hidden border border-gray-300 dark:border-gray-600"
                >
                  <img
                    src={src}
                    alt={`Preview ${index + 1}`}
                    className="w-full h-full object-cover"
                  />
                  <button
                    onClick={() => removeImage(index)}
                    className="absolute top-1 right-1 bg-black/60 hover:bg-black/80 text-white rounded-full p-1 transition-colors"
                  >
                    <X className="w-3 h-3 sm:w-4 sm:h-4" />
                  </button>
                  {previewImages.length > 1 && (
                    <div className="absolute bottom-1 left-1 bg-black/60 text-white text-[10px] sm:text-xs px-1.5 py-0.5 sm:px-2 sm:py-1 rounded">
                      {index + 1}/{previewImages.length}
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
          <div className="flex flex-row w-full justify-between gap-2">
            <span>
              <label htmlFor="upload-img" className="cursor-pointer">
                <ImagePlus className="w-8 h-8 md:w-10 md:h-10 text-green-600" />
              </label>
              <input
                ref={fileInputRef}
                type="file"
                id="upload-img"
                name="upload-img"
                className="hidden"
                multiple
                onChange={(e) => {
                  previewImage(e);
                }}
              />
            </span>
            <span>
              <button
                className="bg-green-600 text-white px-4 py-2 rounded-full hover:bg-green-700 font-light"
                onClick={() => handlePost()}
              >
                Post
              </button>
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
