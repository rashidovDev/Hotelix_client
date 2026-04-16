"use client";

import { ChangeEvent, FormEvent, useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { useMutation, useQuery } from "@apollo/client/react";
import Button from "@/components/ui/Button";
import { GET_HOTEL } from "@/lib/graphql/queries";
import { UPDATE_HOTEL } from "@/lib/graphql/mutations";
import { useAuthStore } from "@/store/authStore";
import { HotelEntity, UpdateHotelInput } from "@/types";
import { routes } from "@/config/routes";

interface HotelQueryResponse {
  findHotel: HotelEntity;
}

interface HotelQueryVariables {
  id: string;
}

interface UpdateHotelMutationResponse {
  updateHotel: HotelEntity;
}

interface UpdateHotelMutationVariables {
  id: string;
  input: UpdateHotelInput;
}

const suggestedAmenities = [
  "Free Wi-Fi",
  "Swimming Pool",
  "Spa",
  "Fitness Center",
  "Conference Rooms",
  "Restaurant",
  "Airport Shuttle",
];

async function uploadHotelImageToCloudinary(file: File): Promise<string> {
  const cloudName = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME;
  const uploadPreset = process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET_HOTEL;

  if (!cloudName || !uploadPreset) {
    throw new Error(
      "Cloudinary is not configured. Add NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME and NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET_HOTEL."
    );
  }

  const tryUpload = async (preset: string) => {
    const formData = new FormData();
    formData.append("file", file);
    formData.append("upload_preset", preset);
    formData.append("folder", "hotelix/hotels");

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

export default function EditHotelPage() {
  const params = useParams<{ id: string }>();
  const hotelId = params?.id;
  const user = useAuthStore((state) => state.user);
  const router = useRouter();

  const [form, setForm] = useState({
    name: "",
    city: "",
    country: "",
    location: "",
    description: "",
  });
  const [amenityInput, setAmenityInput] = useState("");
  const [selectedAmenities, setSelectedAmenities] = useState<string[]>([]);
  const [existingImages, setExistingImages] = useState<string[]>([]);
  const [newImages, setNewImages] = useState<File[]>([]);
  const [newImagePreviews, setNewImagePreviews] = useState<string[]>([]);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [uploadingImages, setUploadingImages] = useState(false);

  const { data, loading } = useQuery<HotelQueryResponse, HotelQueryVariables>(GET_HOTEL, {
    variables: { id: hotelId },
    skip: !hotelId,
    fetchPolicy: "network-only",
  });

  const [updateHotel, { loading: updateLoading }] = useMutation<
    UpdateHotelMutationResponse,
    UpdateHotelMutationVariables
  >(UPDATE_HOTEL);

  const hotel = data?.findHotel;
  const isOwnerOrAdmin = useMemo(() => {
    if (!hotel || !user) return false;
    return user.role === "ADMIN" || hotel.ownerId === user.id;
  }, [hotel, user]);

  useEffect(() => {
    if (!hotel) return;

    setForm({
      name: hotel.name ?? "",
      city: hotel.city ?? "",
      country: hotel.country ?? "",
      location: hotel.location ?? "",
      description: hotel.description ?? "",
    });
    setSelectedAmenities(hotel.amenities ?? []);
    setExistingImages(hotel.images ?? []);
  }, [hotel]);

  useEffect(() => {
    if (!newImages.length) {
      setNewImagePreviews([]);
      return;
    }

    const previews = newImages.map((file) => URL.createObjectURL(file));
    setNewImagePreviews(previews);

    return () => {
      previews.forEach((url) => URL.revokeObjectURL(url));
    };
  }, [newImages]);

  const addAmenity = (amenity: string) => {
    const normalized = amenity.trim();
    if (!normalized) return;

    setSelectedAmenities((prev) => {
      if (prev.some((item) => item.toLowerCase() === normalized.toLowerCase())) {
        return prev;
      }
      return [...prev, normalized];
    });
    setAmenityInput("");
  };

  const removeAmenity = (amenity: string) => {
    setSelectedAmenities((prev) => prev.filter((item) => item !== amenity));
  };

  const removeExistingImage = (imageUrl: string) => {
    setExistingImages((prev) => prev.filter((item) => item !== imageUrl));
    setError("");
  };

  const onSelectNewImages = (event: ChangeEvent<HTMLInputElement>) => {
    setError("");
    const files = Array.from(event.target.files ?? []);

    if (!files.length) {
      setNewImages([]);
      return;
    }

    const total = existingImages.length + files.length;
    if (total > 5) {
      setError("A hotel can have up to 5 images total.");
      return;
    }

    const invalidFile = files.find((file) => !file.type.startsWith("image/"));
    if (invalidFile) {
      setError("Only image files are allowed.");
      return;
    }

    const tooBig = files.find((file) => file.size > 5 * 1024 * 1024);
    if (tooBig) {
      setError("Each image must be less than 5MB.");
      return;
    }

    setNewImages(files);
  };

  const onSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (!hotelId) {
      setError("Hotel id is missing.");
      return;
    }

    if (!isOwnerOrAdmin) {
      setError("You are not allowed to edit this hotel.");
      return;
    }

    if (!form.name || !form.city || !form.country || !form.location) {
      setError("Name, city, country and location are required.");
      return;
    }

    try {
      setUploadingImages(true);

      const uploadedUrls = await Promise.all(
        newImages.map((file) => uploadHotelImageToCloudinary(file))
      );
      const allImages = [...existingImages, ...uploadedUrls];

      if (allImages.length > 5) {
        setError("A hotel can have up to 5 images total.");
        return;
      }

      await updateHotel({
        variables: {
          id: hotelId,
          input: {
            name: form.name.trim(),
            city: form.city.trim(),
            country: form.country.trim(),
            location: form.location.trim(),
            description: form.description.trim() || undefined,
            amenities: selectedAmenities,
            images: allImages,
          },
        },
      });

      setSuccess("Hotel updated successfully. Redirecting...");
      router.push(routes.dashboardHotels);
      router.refresh();
    } catch (mutationError: any) {
      setError(mutationError?.message || "Failed to update hotel.");
    } finally {
      setUploadingImages(false);
    }
  };

  if (loading) {
    return <div className="text-sm text-slate-600">Loading hotel...</div>;
  }

  if (!hotel) {
    return <div className="text-sm text-slate-600">Hotel not found.</div>;
  }

  return (
    <div className="mx-auto w-full max-w-4xl space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Edit Hotel</h1>
          <p className="mt-1 text-sm text-slate-600">Update details, amenities, and images for this hotel.</p>
        </div>
        <div className="flex items-center gap-2">
          <Link
            href={routes.dashboardHotelRooms(hotelId!)}
            className="rounded-xl border border-sky-300 bg-sky-50 px-4 py-2 text-sm font-medium text-sky-700 hover:bg-sky-100"
          >
            Manage Rooms
          </Link>
          <Link
            href={routes.dashboardHotels}
            className="rounded-xl border border-slate-300 px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50"
          >
            Back to My Hotels
          </Link>
        </div>
      </div>

      <form
        onSubmit={onSubmit}
        className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm md:p-8"
      >
        <div className="grid gap-4 md:grid-cols-2">
          <input
            value={form.name}
            onChange={(e) => setForm((prev) => ({ ...prev, name: e.target.value }))}
            placeholder="Hotel name"
            className="rounded-xl border border-slate-300 bg-white px-4 py-3 text-sm text-slate-900 placeholder:text-slate-400 outline-none focus:border-sky-500"
          />
          <input
            value={form.city}
            onChange={(e) => setForm((prev) => ({ ...prev, city: e.target.value }))}
            placeholder="City"
            className="rounded-xl border border-slate-300 bg-white px-4 py-3 text-sm text-slate-900 placeholder:text-slate-400 outline-none focus:border-sky-500"
          />
          <input
            value={form.country}
            onChange={(e) => setForm((prev) => ({ ...prev, country: e.target.value }))}
            placeholder="Country"
            className="rounded-xl border border-slate-300 bg-white px-4 py-3 text-sm text-slate-900 placeholder:text-slate-400 outline-none focus:border-sky-500"
          />
          <input
            value={form.location}
            onChange={(e) => setForm((prev) => ({ ...prev, location: e.target.value }))}
            placeholder="Location / Address"
            className="rounded-xl border border-slate-300 bg-white px-4 py-3 text-sm text-slate-900 placeholder:text-slate-400 outline-none focus:border-sky-500"
          />
        </div>

        <textarea
          value={form.description}
          onChange={(e) => setForm((prev) => ({ ...prev, description: e.target.value }))}
          placeholder="Description (optional)"
          className="mt-4 min-h-24 w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-sm text-slate-900 placeholder:text-slate-400 outline-none focus:border-sky-500"
        />

        <div className="mt-4 rounded-2xl border border-slate-200 bg-slate-50 p-4">
          <p className="text-sm font-semibold text-slate-900">Amenities</p>
          <div className="mt-3 flex gap-2">
            <input
              value={amenityInput}
              onChange={(e) => setAmenityInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  e.preventDefault();
                  addAmenity(amenityInput);
                }
              }}
              placeholder="Type an amenity"
              className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-sm text-slate-900 placeholder:text-slate-400 outline-none focus:border-sky-500"
            />
            <button
              type="button"
              onClick={() => addAmenity(amenityInput)}
              className="rounded-xl bg-sky-600 px-4 py-3 text-sm font-medium text-white hover:bg-sky-700"
            >
              Add
            </button>
          </div>

          <div className="mt-3 flex flex-wrap gap-2">
            {suggestedAmenities.map((amenity) => (
              <button
                key={amenity}
                type="button"
                onClick={() => addAmenity(amenity)}
                className="rounded-full border border-slate-300 bg-white px-3 py-1.5 text-xs font-medium text-slate-700 hover:border-sky-300 hover:text-sky-700"
              >
                + {amenity}
              </button>
            ))}
          </div>

          {selectedAmenities.length > 0 && (
            <div className="mt-4 flex flex-wrap gap-2">
              {selectedAmenities.map((amenity) => (
                <span
                  key={amenity}
                  className="inline-flex items-center gap-2 rounded-full bg-sky-100 px-3 py-1 text-xs font-medium text-sky-800"
                >
                  {amenity}
                  <button
                    type="button"
                    onClick={() => removeAmenity(amenity)}
                    className="text-sky-800 hover:text-sky-950"
                  >
                    x
                  </button>
                </span>
              ))}
            </div>
          )}
        </div>

        <div className="mt-4 rounded-2xl border border-sky-100 bg-sky-50/60 p-4">
          <p className="text-sm font-semibold text-slate-900">Current Images</p>
          {existingImages.length === 0 ? (
            <p className="mt-2 text-xs text-slate-600">No images yet.</p>
          ) : (
            <div className="mt-3 grid grid-cols-2 gap-3 md:grid-cols-5">
              {existingImages.map((imageUrl) => (
                <div key={imageUrl} className="relative">
                  <img
                    src={imageUrl}
                    alt="Hotel image"
                    className="h-20 w-full rounded-lg border border-slate-200 bg-white object-cover shadow-sm"
                  />
                  <button
                    type="button"
                    onClick={() => removeExistingImage(imageUrl)}
                    className="absolute right-1 top-1 rounded-full bg-black/70 px-2 py-0.5 text-[10px] font-semibold text-white"
                  >
                    Remove
                  </button>
                </div>
              ))}
            </div>
          )}

          <p className="mt-4 text-sm font-semibold text-slate-900">Upload New Images</p>
          <p className="mt-1 text-xs text-slate-700">Total images (current + new) cannot exceed 5.</p>
          <input
            type="file"
            accept="image/*"
            multiple
            onChange={onSelectNewImages}
            className="mt-3 w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-700 file:mr-3 file:rounded-md file:border-0 file:bg-sky-600 file:px-3 file:py-1.5 file:text-white"
          />

          {newImagePreviews.length > 0 && (
            <div className="mt-4 grid grid-cols-2 gap-3 md:grid-cols-5">
              {newImagePreviews.map((preview, index) => (
                <img
                  key={`${preview}-${index}`}
                  src={preview}
                  alt={`New hotel preview ${index + 1}`}
                  className="h-20 w-full rounded-lg border border-slate-200 bg-white object-cover shadow-sm"
                />
              ))}
            </div>
          )}
        </div>

        {error && (
          <p className="mt-4 rounded-xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700">
            {error}
          </p>
        )}
        {success && (
          <p className="mt-4 rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-700">
            {success}
          </p>
        )}

        <div className="mt-5 w-full md:w-56">
          <Button type="submit" loading={updateLoading || uploadingImages}>
            Save Changes
          </Button>
        </div>
      </form>
    </div>
  );
}
