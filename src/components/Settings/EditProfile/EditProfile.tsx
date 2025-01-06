/* eslint-disable */
"use client";

import { api } from "~/trpc/react";
import { useSession } from "next-auth/react";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { UploadButton } from "~/utils/uploadthing";

export default function EditProfile() {
  const { data: session } = useSession();
  const { data: user, isLoading } = api.userpost.getUserById.useQuery({
    userId: session?.user.id ?? "",
  });

  const [image, setImage] = useState<string>("");
  const [background, setBackground] = useState<string>("");
  const [description, setDescription] = useState<string>("");

  const [originalImage, setOriginalImage] = useState<string>("");
  const [originalBackground, setOriginalBackground] = useState<string>("");
  const [originalDescription, setOriginalDescription] = useState<string>("");

  const [backgroundModified, setBackgroundModified] = useState<boolean>(false);
  const [imageModified, setImageModified] = useState<boolean>(false);
  const [descriptionModified, setDescriptionModified] = useState<boolean>(false);

  const { mutate: updateProfile, isLoading: isUpdating }: any =
    api.userpost.updateProfile.useMutation();

  const router = useRouter();

  const { refetch } = api.userpost.getUserByUsername.useQuery(
    { username: session?.user.name ?? "" },
    { enabled: false }
  );

  useEffect(() => {
    if (user) {
      setImage(user.image ?? "");
      setBackground(user.background ?? "");
      setDescription(user.description ?? "");

      setOriginalImage(user.image ?? "");
      setOriginalBackground(user.background ?? "");
      setOriginalDescription(user.description ?? "");
    }
  }, [user]);

  if (isLoading) return <p>Loading...</p>;

  const handleSubmit = async () => {
    try {
      await updateProfile({ image, background, description });
      await refetch();
      router.push(`/settings/${session?.user.name}`);
    } catch (error) {
      console.error("Failed to update profile:", error);
    }
  };

  const handleCancel = () => {
    setImage(originalImage);
    setBackground(originalBackground);
    setDescription(originalDescription);
    setBackgroundModified(false);
    setImageModified(false);
    setDescriptionModified(false);
  };

  const handleBackgroundUpload = (files: any) => {
    if (files.length > 0) {
      setBackground(files[0].url);
      setBackgroundModified(true);
    }
  };

  const handleProfileImageUpload = (files: any) => {
    if (files.length > 0) {
      setImage(files[0].url);
      setImageModified(true);
    }
  };

  const handleDescriptionChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setDescription(e.target.value);
    setDescriptionModified(true);
  };

  return (
    <div className="flex flex-col items-center px-4 py-8 sm:px-6 lg:px-8">
      <div className="w-full max-w-4xl">
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-gray-800">Edit Profile</h2>
        </div>

        <div className="relative mb-6">
          <div
            className={`relative h-48 w-full rounded-lg overflow-hidden ${background ? "" : "bg-gray-300"
              }`}
          >
            {background ? (
              <img
                src={background}
                alt="Background"
                className="h-full w-full object-cover bg-gray-300"
              />
            ) : (
              <div className="flex h-full items-center justify-center text-gray-500">
                Upload background
              </div>
            )}
            <div className="absolute inset-0">
              <UploadButton
                // eslint-disable-next-line
                endpoint="imageUploader"
                onClientUploadComplete={handleBackgroundUpload}
                onUploadError={(error) => alert(error.message)}
                className="h-full w-full"
              />
            </div>
          </div>
        </div>

        <div className="flex items-center">
          <div
            className={`relative h-20 w-20 rounded-full border-4 border-white overflow-hidden ${image ? "" : "bg-gray-200"
              }`}
          >
            {image ? (
              <img
                src={image}
                alt="Profile"
                className="h-full w-full object-cover"
              />
            ) : (
              <div className="flex h-full items-center justify-center text-gray-500">
                Upload avatar
              </div>
            )}
            <UploadButton
              // eslint-disable-next-line
              endpoint="imageUploader"
              onClientUploadComplete={handleProfileImageUpload}
              onUploadError={(error) => alert(error.message)}
              className="absolute top-4 left-4 h-full w-full text-sm cursor-pointer"
            />
          </div>
        </div>

        <div className="">
          <label
            htmlFor="description"
            className="block text-sm font-medium text-gray-700"
          >
            Description
          </label>
          <textarea
            id="description"
            value={description}
            onChange={handleDescriptionChange}
            className="mt-1 w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm resize-none"
            rows={4}
            placeholder="Write something about yourself..."
          />
        </div>

        <div className="flex justify-end mt-6 space-x-4">
          {(backgroundModified || imageModified || descriptionModified) && (
            <button
              onClick={handleCancel}
              className="px-6 py-2 text-gray-500 font-medium rounded-lg border border-gray-300 hover:bg-gray-100"
            >
              Cancel
            </button>
          )}

          <button
            onClick={handleSubmit}
            className={`px-6 py-2 text-white font-medium rounded-lg ${isUpdating
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
