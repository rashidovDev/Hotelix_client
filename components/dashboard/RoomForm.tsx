"use client";

import { useState } from "react";
import Input from "@/components/ui/Input";
import Button from "@/components/ui/Button";
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
            disabled={isLoading}
          />
          <button
            type="button"
            onClick={handleAddImage}
            disabled={isLoading || !imageInput.trim()}
            className="rounded-lg border border-slate-300 px-4 py-2.5 text-sm font-medium text-slate-700 hover:bg-slate-50 disabled:opacity-50"
          >
            Add
          </button>
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
          disabled={isLoading}
          className="flex-1 rounded-lg bg-sky-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-sky-700 disabled:opacity-50"
        >
          {isLoading ? "Saving..." : initialRoom ? "Update Room" : "Create Room"}
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
