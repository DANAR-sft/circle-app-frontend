import { useState, useRef, type FormEvent, useEffect } from "react";
import { useAppDispatch, useAppSelector } from "@/app/hooks";
import { UpdateProfile, GetProfile } from "@/hooks/profileSlice";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { X, Camera } from "lucide-react";
import { useAlert } from "@/context/AlertContext";
import type { FormUpdateProfileProps } from "@/types/types";

export function ModalUpdateProfile({
  isOpen,
  onClose,
}: FormUpdateProfileProps) {
  const dispatch = useAppDispatch();
  const { showSuccess, showError } = useAlert();
  const profileState = useAppSelector((state) => state.profile.profile);

  const [formData, setFormData] = useState({
    fullname: "",
    username: "",
    bio: "",
  });

  const [photoPreview, setPhotoPreview] = useState<string | null>(null);
  const [photoFile, setPhotoFile] = useState<File | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isOpen && profileState) {
      setFormData({
        fullname: profileState.fullname || "",
        username: profileState.username || "",
        bio: profileState.bio || "",
      });

      setPhotoPreview(
        profileState.avatar
          ? (profileState.avatar?.startsWith('http') ? profileState.avatar : (profileState.avatar?.startsWith('http') ? profileState.avatar : `http://localhost:4000/uploads/${profileState.avatar}`))
          : "https://ui-avatars.com/api/?name=" + profileState.fullname,
      );
    }
  }, [isOpen, profileState]);

  const handlePhotoClick = () => {
    fileInputRef.current?.click();
  };

  const handlePhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setPhotoFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setPhotoPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    try {
      const updateData: any = {
        fullname: formData.fullname,
        username: formData.username,
        bio: formData.bio,
        avatar: photoFile,
      };
      console.log("Update Data:", updateData);

      await dispatch(UpdateProfile(updateData)).unwrap();
      await dispatch(GetProfile());
      showSuccess("Profile updated successfully!");
      onClose();
      window.location.reload();
    } catch (error) {
      showError("Failed to update profile");
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
      <div className="bg-white dark:bg-neutral-800 rounded-2xl w-full max-w-md overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700">
          <h2 className="text-lg font-semibold text-black dark:text-gray-100">
            Edit profile
          </h2>
          <button
            onClick={onClose}
            className="p-1 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-full transition"
          >
            <X className="w-5 h-5 text-gray-400 dark:text-gray-300" />
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          {/* Cover & Profile Picture */}
          <div className="relative">
            {/* Cover Image */}
            <div
              className="h-32"
              style={{
                backgroundImage: profileState.avatar
                  ? `url(${profileState.avatar?.startsWith('http') ? profileState.avatar : (profileState.avatar?.startsWith('http') ? profileState.avatar : `http://localhost:4000/uploads/${profileState.avatar}`)})`
                  : undefined,
                backgroundSize: "cover",
                backgroundPosition: "center",
              }}
            />

            {/* Profile Picture */}
            <div className="absolute bottom-0 left-4 translate-y-1/2">
              <div className="relative">
                <img
                  src={
                    photoPreview ||
                    `https://ui-avatars.com/api/?name=${formData.fullname}`
                  }
                  alt="Profile"
                  className="w-20 h-20 rounded-full border-4 border-gray-100 dark:border-gray-800 object-cover "
                />
                <button
                  type="button"
                  onClick={handlePhotoClick}
                  className="absolute bottom-0 right-0 p-1.5 bg-green-500 rounded-full hover:bg-green-600 transition"
                >
                  <Camera className="w-4 h-4 text-white" />
                </button>
                <input
                  ref={fileInputRef}
                  name="avatar"
                  type="file"
                  accept="image/*"
                  onChange={handlePhotoChange}
                  className="hidden"
                />
              </div>
            </div>
          </div>

          {/* Form Fields */}
          <div className="p-4 mt-12 space-y-4">
            {/* Name */}
            <div>
              <label className="block text-xs text-gray-400 mb-1.5">Name</label>
              <Input
                type="text"
                name="fullname"
                value={formData.fullname}
                onChange={handleInputChange}
                className="bg-transparent border-gray-700 dark:border-gray-600 text-black dark:text-gray-100 placeholder:text-gray-500 dark:placeholder:text-gray-400"
                placeholder={formData.fullname ? "" : "Enter your name"}
              />
            </div>

            {/* Username */}
            <div>
              <label className="block text-xs text-gray-400 mb-1.5">
                Username
              </label>
              <Input
                type="text"
                name="username"
                value={formData.username}
                onChange={handleInputChange}
                className="bg-transparent border-gray-700 text-black dark:text-white placeholder:text-gray-500 "
                placeholder={formData.username ? "" : "Enter your username"}
              />
            </div>

            {/* Bio */}
            <div>
              <label className="block text-xs text-gray-400 mb-1.5">Bio</label>
              <textarea
                name="bio"
                value={formData.bio}
                onChange={handleInputChange}
                rows={4}
                className="w-full px-3 py-2 bg-transparent border border-gray-700 dark:border-gray-600 rounded-md text-black dark:text-gray-100 placeholder:text-gray-500 dark:placeholder:text-gray-400 resize-none"
                placeholder={formData.bio ? "" : "Tell us about yourself"}
              />
            </div>
          </div>

          {/* Footer */}
          <div className="p-4 border-t border-gray-200 dark:border-gray-700 flex justify-end">
            <Button
              type="submit"
              className="bg-green-500 hover:bg-green-600 text-white px-6 rounded-full font-semibold"
            >
              Save
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
