"use client";

import { useState } from "react";
import Input from "@/components/ui/Input";
import { ROOM_TYPES } from "@/config/constants";

interface Room {
  id: string;
  name: string;
  type: string;
  price: number;
  capacity: number;
  description?: string;
  images?: string[];
  hotelId: string;
}

interface RoomFormProps {
  hotelId: string;
  initialRoom?: Room | null;
  onSubmit: (data: any) => Promise<void>;
  isLoading?: boolean;
  onCancel?: () => void;
}

async function uploadRoomImageToCloudinary(file: File): Promise<string> {
  const cloudName = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME;
  const uploadPreset = process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET_HOTEL;

  if (!cloudName || !uploadPreset) {
    throw new Error(
      "Cloudinary is not configured. Add NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME and NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET_HOTEL."
    );
  }

  const tryUpload = async (preset: string): Promise<string> => {
    const formData = new FormData();
    formData.append("file", file);
    formData.append("upload_preset", preset);
    formData.append("folder", "hotelix/rooms");

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

export default function RoomForm({
  hotelId,
  initialRoom,
  onSubmit,
  isLoading = false,
  onCancel,
}: RoomFormProps) {
  const [formData, setFormData] = useState({
    name: initialRoom?.name || "",
    type: initialRoom?.type || "DOUBLE",
    price: initialRoom?.price || 0,
    capacity: initialRoom?.capacity || 2,
    description: initialRoom?.description || "",
    images: initialRoom?.images || [],
  });

  const [imageInput, setImageInput] = useState("");
  const [error, setError] = useState("");
  const [imageUploading, setImageUploading] = useState(false);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]:
        name === "price" || name === "capacity" ? Number(value) : value,
    }));
    setError("");
  };

  const handleAddImage = () => {
    if (imageInput.trim()) {
      setFormData((prev) => ({
        ...prev,
        images: [...prev.images, imageInput.trim()],
      }));
      setImageInput("");
    }
  };

  const handleRemoveImage = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      images: prev.images.filter((_, i) => i !== index),
    }));
  };

  const handleUploadImage = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];

    if (!file) return;

    setError("");

    if (!file.type.startsWith("image/")) {
      setError("Please select an image file.");
      event.target.value = "";
      return;
    }

    if (file.size > 10 * 1024 * 1024) {
      setError("Image size must be less than 10MB.");
      event.target.value = "";
      return;
    }

    try {
      setImageUploading(true);
      const imageUrl = await uploadRoomImageToCloudinary(file);
      setFormData((prev) => ({
        ...prev,
        images: [...prev.images, imageUrl],
      }));
    } catch (uploadError) {
      const message =
        uploadError instanceof Error
          ? uploadError.message
          : "Failed to upload image.";
      setError(message);
    } finally {
      setImageUploading(false);
      event.target.value = "";
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    // Validation
    if (!formData.name.trim()) {
      setError("Room name is required");
      return;
    }
    if (formData.price <= 0) {
      setError("Price must be greater than 0");
      return;
    }
    if (formData.capacity <= 0) {
      setError("Capacity must be at least 1");
      return;
    }

    try {
      await onSubmit({
        hotelId,
        ...formData,
      });
    } catch (err) {
      setError("Failed to save room");
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {error && (
        <div className="rounded-lg border border-red-200 bg-red-50 p-4 text-sm text-red-700">
          {error}
        </div>
      )}

      <div className="grid gap-6 md:grid-cols-2">
        {/* Room Name */}
        <div>
          <label className="block text-sm font-medium text-slate-700">
            Room Name <span className="text-red-500">*</span>
          </label>
          <Input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            placeholder="e.g., Comfort Room, Deluxe Suite"
            className="mt-1"
            disabled={isLoading}
            label=""
          />
        </div>

        {/* Room Type */}
        <div>
          <label className="block text-sm font-medium text-slate-700">
            Room Type <span className="text-red-500">*</span>
          </label>
          <select
            name="type"
            value={formData.type}
            onChange={handleChange}
            className="mt-1 block w-full rounded-lg border border-slate-300 bg-white px-4 py-2.5 text-slate-900 focus:border-sky-500 focus:outline-none focus:ring-1 focus:ring-sky-500"
            disabled={isLoading}
          >
            {ROOM_TYPES.map((type) => (
              <option key={type.value} value={type.value}>
                {type.label}
              </option>
            ))}
          </select>
        </div>

        {/* Price */}
        <div>
          <label className="block text-sm font-medium text-slate-700">
            Price per Night ($) <span className="text-red-500">*</span>
          </label>
          <Input
            type="number"
            name="price"
            value={formData.price}
            onChange={handleChange}
            placeholder="0.00"
            step="0.01"
            min="0"
            className="mt-1"
            disabled={isLoading}
            label=""
          />
        </div>

        {/* Capacity */}
        <div>
          <label className="block text-sm font-medium text-slate-700">
            Capacity (Guests) <span className="text-red-500">*</span>
          </label>
          <Input
            type="number"
            name="capacity"
            value={formData.capacity}
            onChange={handleChange}
            placeholder="2"
            min="1"
            className="mt-1"
            disabled={isLoading}
            label=""
          />
        </div>
      </div>

      {/* Description */}
      <div>
        <label className="block text-sm font-medium text-slate-700">
          Description
        </label>
        <textarea
          name="description"
          value={formData.description}
          onChange={handleChange}
          placeholder="Describe your room features and amenities..."
          rows={4}
          className="mt-1 block w-full rounded-lg border border-slate-300 px-4 py-2.5 text-slate-900 focus:border-sky-500 focus:outline-none focus:ring-1 focus:ring-sky-500"
          disabled={isLoading}
        />
      </div>

      {/* Images */}
      <div>
        <label className="block text-sm font-medium text-slate-700">
          Room Images
        </label>
        <div className="mt-3 flex gap-2">
          <Input
            type="url"
            value={imageInput}
            onChange={(e) => setImageInput(e.target.value)}
            placeholder="Enter image URL"
            disabled={isLoading || imageUploading}
            label=""
          />
          <button
            type="button"
            onClick={handleAddImage}
            disabled={isLoading || imageUploading || !imageInput.trim()}
            className="rounded-lg border border-slate-300 px-4 py-2.5 text-sm font-medium text-slate-700 hover:bg-slate-50 disabled:opacity-50"
          >
            Add
          </button>
        </div>

        <div className="mt-3">
          <label className="mb-1 block text-xs font-medium uppercase tracking-wide text-slate-500">
            Or Upload Image
          </label>
          <input
            type="file"
            accept="image/*"
            onChange={handleUploadImage}
            disabled={isLoading || imageUploading}
            className="block w-full cursor-pointer rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-700 file:mr-3 file:rounded-md file:border-0 file:bg-sky-50 file:px-3 file:py-1.5 file:text-sm file:font-medium file:text-sky-700 hover:file:bg-sky-100 disabled:cursor-not-allowed disabled:opacity-50"
          />
          {imageUploading && (
            <p className="mt-2 text-sm text-slate-600">Uploading image...</p>
          )}
        </div>

        {formData.images.length > 0 && (
          <div className="mt-4 grid gap-2">
            {formData.images.map((image, index) => (
              <div
                key={index}
                className="flex items-center justify-between rounded-lg border border-slate-200 bg-slate-50 p-3"
              >
                <div className="flex items-center gap-3 overflow-hidden">
                  <img
                    src={image}
                    alt={`Room image ${index + 1}`}
                    className="h-12 w-12 rounded object-cover"
                  />
                  <span className="truncate text-sm text-slate-600">{image}</span>
                </div>
                <button
                  type="button"
                  onClick={() => handleRemoveImage(index)}
                  disabled={isLoading}
                  className="text-red-600 hover:text-red-700 disabled:opacity-50"
                >
                  ✕
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Actions */}
      <div className="flex gap-3 pt-4">
        <button
          type="submit"
          disabled={isLoading || imageUploading}
          className="flex-1 rounded-lg bg-sky-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-sky-700 disabled:opacity-50"
        >
          {isLoading
            ? "Saving..."
            : imageUploading
            ? "Uploading image..."
            : initialRoom
            ? "Update Room"
            : "Create Room"}
        </button>
        {onCancel && (
          <button
            type="button"
            onClick={onCancel}
            disabled={isLoading}
            className="rounded-lg border border-slate-300 px-4 py-2.5 text-sm font-medium text-slate-700 hover:bg-slate-50 disabled:opacity-50"
          >
            Cancel
          </button>
        )}
      </div>
    </form>
  );
}
