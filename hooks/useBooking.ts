import { useMutation, useLazyQuery } from "@apollo/client/react";
import { useBookingStore } from "@/store/bookingStore";
import { CREATE_BOOKING, CANCEL_BOOKING } from "@/lib/graphql/mutations";
import { CHECK_ROOM_AVAILABILITY } from "@/lib/graphql/queries";
import { BookingEntity } from "@/types";
import { useRouter } from "next/navigation";

// Define response types
interface CreateBookingResponse {
  createBooking: BookingEntity;
}

interface CancelBookingResponse {
  cancelBooking: BookingEntity;
}

interface CheckAvailabilityResponse {
  checkRoomAvailability: boolean;
}

export const useBooking = () => {
  const {
    selectedRoom,
    checkIn,
    checkOut,
    totalPrice,
    setCheckIn,
    setCheckOut,
    setSelectedRoom,
    calculateTotalPrice,
    clearBooking,
  } = useBookingStore();

  const router = useRouter();

  const [createBookingMutation, { loading: bookingLoading }] =
    useMutation<CreateBookingResponse>(CREATE_BOOKING);

  const [cancelBookingMutation, { loading: cancelLoading }] =
    useMutation<CancelBookingResponse>(CANCEL_BOOKING);

  const [checkAvailability, { data: availabilityData, loading: checkingAvailability }] =
    useLazyQuery<CheckAvailabilityResponse>(CHECK_ROOM_AVAILABILITY);

  const isAvailable: boolean = availabilityData?.checkRoomAvailability ?? true;

  const checkRoomAvailability = async () => {
    if (!selectedRoom || !checkIn || !checkOut) return;
    await checkAvailability({
      variables: {
        roomId: selectedRoom.id,
        checkIn,
        checkOut,
      },
    });
  };

  const createBooking = async () => {
    if (!selectedRoom || !checkIn || !checkOut) return;
    try {
      const { data } = await createBookingMutation({
        variables: {
          input: {
            roomId: selectedRoom.id,
            checkIn,
            checkOut,
          },
        },
      });
      if (data?.createBooking) {
        clearBooking();
        router.push("/dashboard");
      }
    } catch (error) {
      throw error;
    }
  };

  const cancelBooking = async (id: string) => {
    try {
      await cancelBookingMutation({ variables: { id } });
    } catch (error) {
      throw error;
    }
  };

  return {
    selectedRoom,
    checkIn,
    checkOut,
    totalPrice,
    isAvailable,
    bookingLoading,
    cancelLoading,
    checkingAvailability,
    setCheckIn,
    setCheckOut,
    setSelectedRoom,
    calculateTotalPrice,
    checkRoomAvailability,
    createBooking,
    cancelBooking,
    clearBooking,
  };
};