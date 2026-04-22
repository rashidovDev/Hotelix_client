"use client";

import { ChangeEvent, useEffect, useState } from "react";
import { useMutation, useQuery } from "@apollo/client/react";
import Button from "@/components/ui/Button";
import { GET_ME, GET_MY_BOOKINGS } from "@/lib/graphql/queries";
import { UPDATE_AVATAR, UPDATE_USER } from "@/lib/graphql/mutations";
import { useAuthStore } from "@/store/authStore";
import { UpdateUserInput, UserEntity } from "@/types";
import { format } from "date-fns";
import BookingCard from "@/components/dashboard/BookingCard";

interface MeQueryResponse {
  me: UserEntity;
}

interface UpdateAvatarResponse {
  updateAvatar: UserEntity;
}

interface UpdateAvatarVariables {
  avatarUrl: string;
}

interface UpdateUserResponse {
  updateUser: UserEntity;
}

interface UpdateUserVariables {
  id: string;
  input: UpdateUserInput;
}

interface Booking {
  id: string;
  checkIn: string;
  checkOut: string;
  totalPrice: number;
  status: "CONFIRMED" | "PENDING" | "CANCELLED";
  createdAt: string;
  room: {
    id: string;
    name: string;
    type: string;
    price: number;
    images?: string[];
    hotel: {
      id: string;
      name: string;
      city: string;
      images?: string[];
      rating?: number;
    };
  };
}

interface MyBookingsResponse {
  myBookings: Booking[];
}

async function uploadToCloudinary(file: File): Promise<string> {
  const cloudName = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME;
  const uploadPreset = process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET;

  if (!cloudName || !uploadPreset) {
    throw new Error(
      "Cloudinary is not configured. Add NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME and NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET."
    );
  }

  const tryUpload = async (preset: string): Promise<string> => {
    const formData = new FormData();
    formData.append("file", file);
    formData.append("upload_preset", preset);
    formData.append("folder", "hotelix/avatars");

    const response = await fetch(
      `https://api.cloudinary.com/v1_1/${cloudName}/image/upload`,
      {
        method: "POST",
        body: formData,
      }
    );

    const payload = await response.json().catch(() => ({}));

    if (!response.ok) {
      const details = payload?.error?.message || "";
      throw new Error(
        details ? `Cloudinary upload failed: ${details}` : "Cloudinary upload failed."
      );
    }

    if (!payload?.secure_url) {
      throw new Error("Cloudinary did not return an image URL.");
    }

    return payload.secure_url as string;
  };

  try {
    return await tryUpload(uploadPreset);
  } catch (error) {
    const message = error instanceof Error ? error.message : "";
    const lowerPreset = uploadPreset.toLowerCase();

    if (
      message.toLowerCase().includes("upload preset not found") &&
      lowerPreset !== uploadPreset
    ) {
      return tryUpload(lowerPreset);
    }

    throw error;
  }
}

export default function ProfilePage() {
  const { user, updateUser } = useAuthStore();
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [localPreviewUrl, setLocalPreviewUrl] = useState("");
  const [profileForm, setProfileForm] = useState({
    firstName: "",
    lastName: "",
    email: "",
  });
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const { data, loading } = useQuery<MeQueryResponse>(GET_ME, {
    skip: !user,
    fetchPolicy: "network-only",
  });

  const { data: bookingsData, loading: bookingsLoading } = useQuery<MyBookingsResponse>(
    GET_MY_BOOKINGS,
    {
      skip: !user,
      fetchPolicy: "network-only",
    }
  );

  const [updateAvatar, { loading: avatarUpdating }] = useMutation<
    UpdateAvatarResponse,
    UpdateAvatarVariables
  >(UPDATE_AVATAR);

  const [updateProfile, { loading: profileUpdating }] = useMutation<
    UpdateUserResponse,
    UpdateUserVariables
  >(UPDATE_USER);

  const currentUser = data?.me ?? user;

  useEffect(() => {
    if (!currentUser) return;
    setProfileForm({
      firstName: currentUser.firstName || "",
      lastName: currentUser.lastName || "",
      email: currentUser.email || "",
    });
  }, [currentUser]);

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
  const fullName = `${currentUser?.firstName || ""} ${currentUser?.lastName || ""}`.trim();

  const formatDateTime = (value?: string) => {
    if (!value) return "-";
    const date = new Date(value);
    if (Number.isNaN(date.getTime())) return value;
    return format(date, "PPP p");
  };

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
        updateUser({ ...(currentUser as UserEntity), ...result.data.updateAvatar });
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

  const handleProfileSave = async () => {
    if (!currentUser?.id) return;

    setError("");
    setSuccess("");

    if (!profileForm.firstName.trim() || !profileForm.lastName.trim() || !profileForm.email.trim()) {
      setError("First name, last name, and email are required.");
      return;
    }

    if (!/\S+@\S+\.\S+/.test(profileForm.email)) {
      setError("Please enter a valid email address.");
      return;
    }

    try {
      const result = await updateProfile({
        variables: {
          id: currentUser.id,
          input: {
            firstName: profileForm.firstName.trim(),
            lastName: profileForm.lastName.trim(),
            email: profileForm.email.trim(),
          },
        },
      });

      if (result.data?.updateUser) {
        updateUser({ ...(currentUser as UserEntity), ...result.data.updateUser });
      }

      setSuccess("Profile updated successfully.");
    } catch (updateError: any) {
      setError(updateError?.message || "Failed to update profile.");
    }
  };

  if (!user) {
    return <div className="text-gray-500">Please login to view your profile.</div>;
  }

  return (
    <div className="px-2 md:px-4">
      <div className="overflow-hidden rounded-3xl border border-gray-200 bg-white shadow-sm">
        <div className="bg-linear-to-r from-sky-50 via-cyan-50 to-blue-100 px-6 py-8 md:px-10">
          <h1 className="text-3xl font-bold text-gray-900">My Profile</h1>
          <p className="mt-2 text-sm text-gray-600">
            Manage your identity, avatar, and account details in one place.
          </p>
        </div>

        <div className="grid gap-8 p-6 md:grid-cols-3 md:p-10">
          <section className="md:col-span-2">
            <h2 className="text-lg font-semibold text-gray-900">Account Details</h2>
            <div className="mt-4 grid gap-4 sm:grid-cols-2">
              <div className="rounded-2xl border border-gray-200 bg-white p-4">
                <p className="text-xs uppercase tracking-wide text-gray-500">First Name</p>
                <input
                  value={profileForm.firstName}
                  onChange={(e) => setProfileForm((prev) => ({ ...prev, firstName: e.target.value }))}
                  className="mt-2 w-full rounded-xl border border-gray-300 px-3 py-2 text-sm text-gray-900 outline-none focus:border-blue-500"
                />
              </div>
              <div className="rounded-2xl border border-gray-200 bg-white p-4">
                <p className="text-xs uppercase tracking-wide text-gray-500">Last Name</p>
                <input
                  value={profileForm.lastName}
                  onChange={(e) => setProfileForm((prev) => ({ ...prev, lastName: e.target.value }))}
                  className="mt-2 w-full rounded-xl border border-gray-300 px-3 py-2 text-sm text-gray-900 outline-none focus:border-blue-500"
                />
              </div>
              <div className="rounded-2xl border border-gray-200 bg-white p-4 sm:col-span-2">
                <p className="text-xs uppercase tracking-wide text-gray-500">Email</p>
                <input
                  type="email"
                  value={profileForm.email}
                  onChange={(e) => setProfileForm((prev) => ({ ...prev, email: e.target.value }))}
                  className="mt-2 w-full rounded-xl border border-gray-300 px-3 py-2 text-sm text-gray-900 outline-none focus:border-blue-500"
                />
              </div>
              <div className="sm:col-span-2 md:w-56">
                <Button
                  onClick={handleProfileSave}
                  loading={profileUpdating}
                >
                  Save Profile
                </Button>
              </div>
            </div>

            <div className="mt-4 grid gap-4 sm:grid-cols-2">
              <div className="rounded-2xl border border-gray-200 bg-gray-50 p-4">
                <p className="text-xs uppercase tracking-wide text-gray-500">Full Name</p>
                <p className="mt-1 text-sm font-semibold text-gray-900">{fullName || "-"}</p>
              </div>
              <div className="rounded-2xl border border-gray-200 bg-gray-50 p-4">
                <p className="text-xs uppercase tracking-wide text-gray-500">Email</p>
                <p className="mt-1 text-sm font-semibold text-gray-900 break-all">{currentUser?.email || "-"}</p>
              </div>
              <div className="rounded-2xl border border-gray-200 bg-gray-50 p-4">
                <p className="text-xs uppercase tracking-wide text-gray-500">Role</p>
                <p className="mt-1 inline-flex rounded-full bg-blue-600 px-3 py-1 text-xs font-semibold text-white">
                  {currentUser?.role || "-"}
                </p>
              </div>
              <div className="rounded-2xl border border-gray-200 bg-gray-50 p-4">
                <p className="text-xs uppercase tracking-wide text-gray-500">User ID</p>
                <p className="mt-1 text-sm font-semibold text-gray-900 break-all">{currentUser?.id || "-"}</p>
              </div>
              <div className="rounded-2xl border border-gray-200 bg-gray-50 p-4">
                <p className="text-xs uppercase tracking-wide text-gray-500">Member Since</p>
                <p className="mt-1 text-sm font-semibold text-gray-900">
                  {formatDateTime(currentUser?.createdAt)}
                </p>
              </div>
              <div className="rounded-2xl border border-gray-200 bg-gray-50 p-4">
                <p className="text-xs uppercase tracking-wide text-gray-500">Last Updated</p>
                <p className="mt-1 text-sm font-semibold text-gray-900">
                  {formatDateTime(currentUser?.updatedAt)}
                </p>
              </div>
            </div>
          </section>

          <section className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
            <h2 className="text-lg font-semibold text-gray-900">Profile Photo</h2>
            <p className="mt-1 text-sm text-gray-500">Upload a JPG, PNG, or WEBP image up to 5MB.</p>

            <div className="mt-5 flex flex-col items-center gap-4">
              <div className="h-32 w-32 overflow-hidden rounded-full border-4 border-white bg-gray-100 shadow">
                {previewUrl ? (
                  <img src={previewUrl} alt="Avatar preview" className="h-full w-full object-cover" />
                ) : (
                  <div className="flex h-full w-full items-center justify-center text-3xl font-semibold text-gray-500">
                    {currentUser?.firstName?.[0]}
                    {currentUser?.lastName?.[0]}
                  </div>
                )}
              </div>

              <label
                htmlFor="avatar-file"
                className="inline-flex cursor-pointer items-center rounded-xl border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
              >
                Choose New Image
              </label>
              <input
                id="avatar-file"
                type="file"
                accept="image/*"
                className="hidden"
                onChange={handleSelectFile}
              />

              <div className="w-full">
                <Button
                  onClick={handleUploadAvatar}
                  loading={avatarUpdating}
                  disabled={!selectedFile || loading}
                >
                  Save Avatar
                </Button>
              </div>
            </div>
          </section>
        </div>

        {(error || success) && (
          <div className="border-t border-gray-100 px-6 pb-6 md:px-10">
            {error && (
              <div className="mt-4 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
                {error}
              </div>
            )}

            {success && (
              <div className="mt-4 rounded-xl border border-green-200 bg-green-50 px-4 py-3 text-sm text-green-700">
                {success}
              </div>
            )}
          </div>
        )}
      </div>

      {/* Bookings Section */}
      <div className="mt-8">
        <div className="mb-6">
          <h2 className="text-2xl font-bold text-gray-900">My Bookings</h2>
          <p className="mt-1 text-sm text-gray-600">
            View all your hotel reservations and booking details
          </p>
        </div>

        {bookingsLoading ? (
          <div className="space-y-4">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="h-64 animate-pulse rounded-2xl bg-gray-200" />
            ))}
          </div>
        ) : bookingsData?.myBookings && bookingsData.myBookings.length > 0 ? (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {bookingsData.myBookings.map((booking) => (
              <BookingCard key={booking.id} booking={booking} />
            ))}
          </div>
        ) : (
          <div className="rounded-2xl border-2 border-dashed border-gray-300 bg-gray-50 py-12 text-center">
            <p className="text-gray-600">You haven't made any bookings yet.</p>
            <p className="mt-1 text-sm text-gray-500">
              Start by exploring and booking your favorite hotels!
            </p>
          </div>
        )}
      </div>
    </div>
  );
}