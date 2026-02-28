import { useRef, useState } from "react";
import { ImagePlus, X } from "lucide-react";
import { Button } from "./ui/button";
import { useAppDispatch } from "@/app/hooks";
import { PostReplyAction } from "@/hooks/replySlice";
import { useAlert } from "@/context/AlertContext";
import type { IPostReplyProps } from "@/types/types";

export function PostReply({
  fullname,
  photo_profile,
  threadId,
  onReplySuccess,
}: IPostReplyProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [previewImages, setPreviewImages] = useState<string[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const dispatch = useAppDispatch();
  const { showSuccess, showError } = useAlert();

  async function handleReply() {
    const content = inputRef.current?.value;
    const files = fileInputRef.current?.files;

    if (!content || content.trim() === "") {
      showError("Please enter a reply");
      return;
    }

    setIsSubmitting(true);

    try {
      await dispatch(
        PostReplyAction({
          threadId,
          content,
          image: files && files.length > 0 ? files[0] : undefined,
        }),
      ).unwrap();

      // Clear input setelah submit
      if (inputRef.current) inputRef.current.value = "";
      if (fileInputRef.current) fileInputRef.current.value = "";
      setPreviewImages([]);

      showSuccess("Reply posted successfully!");

      // Callback untuk refresh replies
      if (onReplySuccess) {
        onReplySuccess();
      }
    } catch (error) {
      console.error("Failed to post reply:", error);
      showError("Failed to post reply. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  }

  function handleImageClick() {
    fileInputRef.current?.click();
  }

  function previewImage(event: React.ChangeEvent<HTMLInputElement>) {
    const input = event.target;
    if (input.files && input.files.length > 0) {
      const previews: string[] = [];
      const maxFiles = Math.min(input.files.length, 4);

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

  return (
    <div className="border-b border-gray-700 py-4">
      {/* Input area */}
      <div className="flex items-center gap-3">
        {/* Profile picture */}
        <img
          src={
            photo_profile
              ? (photo_profile?.startsWith('http') ? photo_profile : `http://localhost:4000/uploads/${photo_profile}`)
              : "https://ui-avatars.com/api/?name=" + fullname
          }
          alt="profile"
          className="w-10 h-10 rounded-full object-cover shrink-0"
        />

        {/* Input field */}
        <div className="flex-1 flex items-center gap-2 bg-transparent">
          <input
            ref={inputRef}
            type="text"
            placeholder="Type your reply!"
            className="flex-1 bg-transparent text-black dark:text-white placeholder-gray-400 dark:placeholder-gray-500 outline-none text-sm"
          />

          {/* Image upload button */}
          <button type="button" onClick={handleImageClick} className="p-2">
            <ImagePlus className="w-5 h-5 text-gray-400 hover:text-green-500" />
          </button>

          {/* Hidden file input */}
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={previewImage}
            className="hidden"
          />

          {/* Reply button */}
          <Button
            onClick={handleReply}
            disabled={isSubmitting}
            className="bg-green-500 hover:bg-green-600 text-white px-4 py-1 rounded-full text-sm font-medium"
          >
            {isSubmitting ? "..." : "Reply"}
          </Button>
        </div>
      </div>

      {/* Image previews */}
      {previewImages.length > 0 && (
        <div className="flex gap-2 mt-3 ml-13">
          {previewImages.map((preview, index) => (
            <div key={index} className="relative">
              <img
                src={preview}
                alt={`Preview ${index + 1}`}
                className="w-16 h-16 object-cover rounded-lg"
              />
              <button
                type="button"
                onClick={() => removeImage(index)}
                className="absolute -top-2 -right-2 bg-red-500 rounded-full p-1 hover:bg-red-600"
              >
                <X className="w-3 h-3 text-white" />
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
