"use client";

import { api } from "~/trpc/react";
import { useSession } from "next-auth/react";
import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation"; 

export default function EditProfile() {
  const { data: session } = useSession();
  const { data: user, isLoading } = api.userpost.getUserById.useQuery({
    userId: session?.user.id || "",
  });

  const [image, setImage] = useState<string>("");
  const [background, setBackground] = useState<string>("");
  const [description, setDescription] = useState<string>("");

  const profileImageRef = useRef<HTMLInputElement>(null);
  const backgroundImageRef = useRef<HTMLInputElement>(null);

  const { mutate: updateProfile, isLoading: isUpdating } =
    api.userpost.updateProfile.useMutation();

  const router = useRouter();

  useEffect(() => {
    if (user) {
      setImage(user.image || "");
      setBackground(user.background || "");
      setDescription(user.description || "");
    }
  }, [user]);

  if (isLoading) return <p>Loading...</p>;

  const handleProfileImageClick = () => {
    profileImageRef.current?.click();
  };

  const handleBackgroundImageClick = () => {
    backgroundImageRef.current?.click();
  };

  const handleSubmit = async () => {
    await updateProfile({ image, background, description });
    router.push(`/settings/${session?.user.name}`);
  };

  return (
    <div className="flex flex-col items-center px-4 py-8 sm:px-6 lg:px-8">
      <div className="w-full max-w-4xl">
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-gray-800">Edit Profile</h2>
        </div>

        <div className="relative mb-6">
          <div
            className="relative h-48 w-full rounded-lg bg-gray-200 overflow-hidden cursor-pointer"
            onClick={handleBackgroundImageClick}
          >
            {background ? (
              <img
                src={background}
                alt="Background"
                className="h-full w-full object-cover"
              />
            ) : (
              <div className="flex h-full items-center justify-center text-gray-500">
                Click to upload background
              </div>
            )}
            <input
              ref={backgroundImageRef}
              type="file"
              className="hidden"
              onChange={(e) => {
                const file = e.target.files?.[0];
                if (file) {
                  const reader = new FileReader();
                  reader.onload = () => {
                    const uploadedBackground = reader.result as string;
                    setBackground(uploadedBackground);
                  };
                  reader.readAsDataURL(file);
                }
              }}
            />
          </div>

          <div
            className="absolute -bottom-10 left-6 flex items-center cursor-pointer"
            onClick={handleProfileImageClick}
          >
            <div className="relative h-20 w-20 rounded-full bg-gray-200 border-4 border-white overflow-hidden">
              {image ? (
                <img
                  src={image}
                  alt="Profile"
                  className="h-full w-full object-cover"
                />
              ) : (
                <div className="flex h-full items-center justify-center text-gray-500">
                  Click to upload avatar
                </div>
              )}
              <input
                ref={profileImageRef}
                type="file"
                className="hidden"
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  if (file) {
                    const reader = new FileReader();
                    reader.onload = () => {
                      const uploadedImage = reader.result as string;
                      setImage(uploadedImage);
                    };
                    reader.readAsDataURL(file);
                  }
                }}
              />
            </div>
          </div>
        </div>

        <div className="mt-16">
          <label
            htmlFor="description "
            className="block text-sm font-medium text-gray-700"
          >
            Description
          </label>
          <textarea
            id="description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="mt-1 w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm resize-none"
            rows={4}
            placeholder="Write something about yourself..."
          />
        </div>

        <div className="flex justify-end">
          <button
            onClick={handleSubmit}
            className={`px-6 py-2 text-white font-medium rounded-lg ${
              isUpdating
                ? "bg-blue-300 cursor-not-allowed"
                : "bg-blue-500 hover:bg-blue-600"
            }`}
            disabled={isUpdating}
          >
            {isUpdating ? "Saving..." : "Save"}
          </button>
        </div>
      </div>
    </div>
  );
}
