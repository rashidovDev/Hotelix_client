"use client";

import { ChangeEvent, useEffect, useState } from "react";
import { useMutation, useQuery } from "@apollo/client/react";
import Button from "@/components/ui/Button";
import { GET_ME } from "@/lib/graphql/queries";
import { UPDATE_AVATAR } from "@/lib/graphql/mutations";
import { useAuthStore } from "@/store/authStore";
import { UserEntity } from "@/types";

interface MeQueryResponse {
  me: UserEntity;
}

interface UpdateAvatarResponse {
  updateAvatar: UserEntity;
}

interface UpdateAvatarVariables {
  avatarUrl: string;
}

async function uploadToCloudinary(file: File): Promise<string> {
  const cloudName = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME;
  const uploadPreset = process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET;

  if (!cloudName || !uploadPreset) {
    throw new Error(
      "Cloudinary is not configured. Add NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME and NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET."
    );
  }

  const formData = new FormData();
  formData.append("file", file);
  formData.append("upload_preset", uploadPreset);
  formData.append("folder", "hotelix/avatars");

  const response = await fetch(
    `https://api.cloudinary.com/v1_1/${cloudName}/image/upload`,
    {
      method: "POST",
      body: formData,
    }
  );

  if (!response.ok) {
    throw new Error("Cloudinary upload failed.");
  }

  const payload = await response.json();
  if (!payload?.secure_url) {
    throw new Error("Cloudinary did not return an image URL.");
  }

  return payload.secure_url as string;
}

export default function ProfilePage() {
  const { user, updateUser } = useAuthStore();
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [localPreviewUrl, setLocalPreviewUrl] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const { data, loading } = useQuery<MeQueryResponse>(GET_ME, {
    skip: !user,
    fetchPolicy: "network-only",
  });

  const [updateAvatar, { loading: avatarUpdating }] = useMutation<
    UpdateAvatarResponse,
    UpdateAvatarVariables
  >(UPDATE_AVATAR);

  const currentUser = data?.me ?? user;

  useEffect(() => {
    if (!selectedFile) {
      setLocalPreviewUrl("");
      return;
    }

    const url = URL.createObjectURL(selectedFile);
    setLocalPreviewUrl(url);

    return () => {
      URL.revokeObjectURL(url);
    };
  }, [selectedFile]);

  const previewUrl = localPreviewUrl || currentUser?.avatar || "";

  const handleSelectFile = (event: ChangeEvent<HTMLInputElement>) => {
    setError("");
    setSuccess("");

    const file = event.target.files?.[0] || null;
    if (!file) {
      setSelectedFile(null);
      return;
    }

    if (!file.type.startsWith("image/")) {
      setError("Please select an image file.");
      setSelectedFile(null);
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      setError("Image size must be less than 5MB.");
      setSelectedFile(null);
      return;
    }

    setSelectedFile(file);
  };

  const handleUploadAvatar = async () => {
    if (!selectedFile) {
      setError("Please choose an image first.");
      return;
    }

    setError("");
    setSuccess("");

    try {
      const avatarUrl = await uploadToCloudinary(selectedFile);
      const result = await updateAvatar({ variables: { avatarUrl } });

      if (result.data?.updateAvatar) {
        updateUser(result.data.updateAvatar);
      }

      setSelectedFile(null);
      setSuccess("Avatar updated successfully.");
    } catch (uploadError) {
      const message =
        uploadError instanceof Error
          ? uploadError.message
          : "Failed to update avatar.";
      setError(message);
    }
  };

  if (!user) {
    return <div className="text-gray-500">Please login to view your profile.</div>;
  }

  return (
    <div className="max-w-2xl mx-auto">
      <div className="bg-white rounded-2xl shadow-sm border p-6 md:p-8">
        <h1 className="text-2xl font-bold text-gray-800">Profile</h1>
        <p className="text-sm text-gray-500 mt-1">
          Upload a new avatar image. It will be stored on Cloudinary and linked to your account.
        </p>

        <div className="mt-6 flex flex-col md:flex-row gap-6 md:items-center">
          <div className="w-28 h-28 rounded-full bg-gray-100 overflow-hidden flex items-center justify-center">
            {previewUrl ? (
              <img src={previewUrl} alt="Avatar preview" className="w-full h-full object-cover" />
            ) : (
              <span className="text-2xl font-semibold text-gray-500">
                {currentUser?.firstName?.[0]}
                {currentUser?.lastName?.[0]}
              </span>
            )}
          </div>

          <div className="flex-1">
            <div className="text-sm text-gray-700 font-medium">
              {currentUser?.firstName} {currentUser?.lastName}
            </div>
            <div className="text-sm text-gray-500">{currentUser?.email}</div>

            <label
              htmlFor="avatar-file"
              className="mt-4 inline-flex items-center px-4 py-2 rounded-lg border border-gray-300 text-sm text-gray-700 hover:bg-gray-50 cursor-pointer"
            >
              Choose Image
            </label>
            <input
              id="avatar-file"
              type="file"
              accept="image/*"
              className="hidden"
              onChange={handleSelectFile}
            />
          </div>
        </div>

        {error && (
          <div className="mt-4 rounded-lg border border-red-200 bg-red-50 text-red-700 text-sm px-3 py-2">
            {error}
          </div>
        )}

        {success && (
          <div className="mt-4 rounded-lg border border-green-200 bg-green-50 text-green-700 text-sm px-3 py-2">
            {success}
          </div>
        )}

        <div className="mt-6 w-full md:w-56">
          <Button
            onClick={handleUploadAvatar}
            loading={avatarUpdating}
            disabled={!selectedFile || loading}
          >
            Save Avatar
          </Button>
        </div>
      </div>
    </div>
  );
}