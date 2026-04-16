"use client";

import { useState, useMemo } from "react";
import { useParams, useRouter } from "next/navigation";
import { useMutation, useQuery } from "@apollo/client/react";
import Link from "next/link";
import Navbar from "@/components/layout/Navbar";
import { GET_HOTEL, GET_ROOMS_BY_HOTEL } from "@/lib/graphql/queries";
import { CREATE_ROOM, REMOVE_ROOM } from "@/lib/graphql/mutations";
import { useAuthStore } from "@/store/authStore";
import { routes } from "@/config/routes";
import RoomForm from "@/components/dashboard/RoomForm";
import RoomsList from "@/components/dashboard/RoomsList";
import { HotelEntity } from "@/types";
import { Trash2, Plus } from "lucide-react";

interface GetHotelResponse {
  findHotel: HotelEntity;
}

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

interface GetRoomsResponse {
  findRoomsByHotel: Room[];
}

interface CreateRoomInput {
  hotelId: string;
  name: string;
  type: string;
  price: number;
  capacity: number;
  description?: string;
  images?: string[];
}

export default function RoomsManagementPage() {
  const params = useParams();
  const router = useRouter();
  const hotelId = params.id as string;
  const user = useAuthStore((state) => state.user);
  
  const [showForm, setShowForm] = useState(false);
  const [editingRoom, setEditingRoom] = useState<Room | null>(null);

  // Fetch hotel details
  const { data: hotelData, loading: hotelLoading } = useQuery<GetHotelResponse>(
    GET_HOTEL,
    {
      variables: { id: hotelId },
      skip: !hotelId,
    }
  );

  // Fetch rooms for this hotel
  const { data: roomsData, loading: roomsLoading, refetch: refetchRooms } = useQuery<GetRoomsResponse>(
    GET_ROOMS_BY_HOTEL,
    {
      variables: { hotelId },
      skip: !hotelId,
    }
  );

  // Create room mutation
  const [createRoom, { loading: createLoading }] = useMutation(CREATE_ROOM, {
    onCompleted: () => {
      setShowForm(false);
      setEditingRoom(null);
      refetchRooms();
    },
  });

  // Remove room mutation
  const [removeRoom, { loading: removeLoading }] = useMutation(REMOVE_ROOM, {
    onCompleted: () => {
      refetchRooms();
    },
  });

  const hotel = hotelData?.findHotel;
  const rooms = useMemo(() => roomsData?.findRoomsByHotel ?? [], [roomsData]);

  const handleCreateRoom = async (formData: CreateRoomInput) => {
    try {
      await createRoom({
        variables: {
          input: {
            ...formData,
            hotelId,
          },
        },
      });
    } catch (error) {
      console.error("Failed to create room:", error);
    }
  };

  const handleDeleteRoom = async (roomId: string) => {
    if (confirm("Are you sure you want to delete this room?")) {
      try {
        await removeRoom({
          variables: { id: roomId },
        });
      } catch (error) {
        console.error("Failed to delete room:", error);
      }
    }
  };

  const isOwner = hotel?.ownerId === user?.id;

  return (
    <main className="min-h-screen bg-slate-50">
      <div className="mx-auto w-full max-w-10xl space-y-8 px-4 py-8 sm:px-6 lg:px-0">
        {/* Header */}
        <div className="flex items-center justify-between rounded-3xl border border-sky-100 bg-linear-to-r from-white via-sky-50 to-cyan-50 px-6 py-6 shadow-sm">
          <div>
            <div className="flex items-center gap-4">
              <Link
                href={routes.dashboardHotelEdit(hotelId)}
                className="rounded-lg border border-slate-300 px-3 py-1.5 text-sm font-medium text-slate-700 hover:bg-slate-50"
              >
                ← Back
              </Link>
              <div>
                <h1 className="text-3xl font-bold tracking-tight text-slate-900">
                  {hotelLoading ? "Loading..." : hotel?.name}
                </h1>
                <p className="mt-1 text-sm text-slate-600">Manage rooms for your hotel</p>
              </div>
            </div>
          </div>
          {isOwner && (
            <button
              onClick={() => {
                setEditingRoom(null);
                setShowForm(!showForm);
              }}
              className="flex items-center gap-2 rounded-xl bg-sky-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-sky-700"
            >
              <Plus className="h-4 w-4" />
              Add Room
            </button>
          )}
        </div>

        {/* Form */}
        {showForm && isOwner && (
          <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
            <h2 className="mb-4 text-xl font-semibold text-slate-900">
              {editingRoom ? "Edit Room" : "Add New Room"}
            </h2>
            <RoomForm
              hotelId={hotelId}
              initialRoom={editingRoom}
              onSubmit={handleCreateRoom}
              isLoading={createLoading}
              onCancel={() => {
                setShowForm(false);
                setEditingRoom(null);
              }}
            />
          </div>
        )}

        {/* Rooms List */}
        <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
          <h2 className="text-xl font-semibold text-slate-900">Rooms ({rooms.length})</h2>

          {roomsLoading ? (
            <p className="mt-4 text-sm text-slate-600">Loading rooms...</p>
          ) : rooms.length === 0 ? (
            <div className="mt-6 rounded-2xl border border-dashed border-slate-300 bg-slate-50 p-8 text-center">
              <p className="mb-4 text-sm text-slate-600">No rooms yet</p>
              {isOwner && (
                <button
                  onClick={() => {
                    setEditingRoom(null);
                    setShowForm(true);
                  }}
                  className="inline-flex items-center gap-2 rounded-lg bg-sky-600 px-4 py-2 text-sm font-semibold text-white hover:bg-sky-700"
                >
                  <Plus className="h-4 w-4" />
                  Add First Room
                </button>
              )}
            </div>
          ) : (
            <RoomsList
              rooms={rooms}
              isOwner={isOwner}
              onDelete={handleDeleteRoom}
              onEdit={(room) => {
                setEditingRoom(room);
                setShowForm(true);
              }}
              isLoading={removeLoading}
            />
          )}
        </section>
      </div>
    </main>
  );
}
