"use client";

import { useMemo, useState } from "react";
import { useParams } from "next/navigation";
import { useMutation, useQuery } from "@apollo/client/react";
import { Heart } from "lucide-react";
import BookingModal from "@/components/booking/BookingModal";
import FloatingChatWidget from "@/components/chat/FloatingChatWidget";
import GalleryGrid from "@/components/hotels/details/GalleryGrid";
import HotelHeader from "@/components/hotels/details/HotelHeader";
import OverviewSection from "@/components/hotels/details/OverviewSection";
import ReviewsSection, { ReviewItem } from "@/components/hotels/details/ReviewsSection";
import RoomCard, { RoomItem } from "@/components/hotels/details/RoomCard";
import Tabs from "@/components/hotels/details/Tabs";
import Navbar from "@/components/layout/Navbar";
import Breadcrumb from "@/components/ui/Breadcrumb";
import { routes } from "@/config/routes";
import { CREATE_REVIEW } from "@/lib/graphql/mutations";
import { GET_HOTEL, GET_HOTEL_REVIEWS, GET_ROOMS_BY_HOTEL, GET_USER } from "@/lib/graphql/queries";
import { HotelEntity, ReviewEntity, RoomEntity, UserEntity } from "@/types";
import { useAuthStore } from "@/store/authStore";
import { useHotelSubscription } from "@/hooks/useHotelSubscription";

const tabItems = ["Overview", "Rooms", "Amenities", "Policies"] as const;
type HotelTab = (typeof tabItems)[number];

interface GetHotelResponse {
  findHotel: HotelEntity;
}

interface GetUserResponse {
  findUser: UserEntity;
}

interface GetRoomsResponse {
  findRoomsByHotel: RoomEntity[];
}

interface GetHotelReviewsResponse {
  hotelReviews: ReviewEntity[];
}

interface CreateReviewResponse {
  createReview: ReviewEntity;
}

interface RoomDisplayItem {
  room?: RoomEntity;
  item: RoomItem;
}

const constantRoomCard: RoomItem = {
  id: "constant-roomcard-1",
  name: "Comfort Room",
  image:
    "https://images.unsplash.com/photo-1631049307264-da0ec9d70304?auto=format&fit=crop&w=1200&q=80",
  size: "24 m2",
  capacity: "2 people",
  bedType: "DOUBLE",
  policy: "Free cancellation within 24 hours",
  price: 129,
};

const constantHotelReviews: ReviewItem[] = [
  {
    id: "constant-review-1",
    author: "Ariana",
    avatar:
      "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=240&q=80",
    description:
      "Great overall stay with clean rooms and helpful staff. Would book again.",
    score: 9.2,
    date: "Jan 2026",
  },
  // {
  //   id: "constant-review-2",
  //   author: "Traveler Review",
  //   avatar:
  //     "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=240&q=80",
  //   description:
  //     "Convenient location, smooth check-in, and good value for the price.",
  //   score: 8.8,
  //   date: "Feb 2026",
  // },
];

function mapRoomToRoomItem(room: RoomEntity): RoomItem {
  return {
    id: room.id,
    name: room.name,
    image: room.images?.[0] || "/hotel.jpg",
    size: "N/A",
    capacity: `${room.capacity} people`,
    bedType: room.type,
    policy: room.description || "Non-refundable",
    price: room.price,
  };
}

export default function HotelDetailsPage() {
  const params = useParams();
  const hotelId = params.id as string;
  const [activeTab, setActiveTab] = useState<HotelTab>("Rooms");
  const [selectedRoom, setSelectedRoom] = useState<RoomEntity | null>(null);
  const [isBookingModalOpen, setIsBookingModalOpen] = useState(false);
  const [reviewRating, setReviewRating] = useState(5);
  const [reviewComment, setReviewComment] = useState("");
  const [reviewSubmitError, setReviewSubmitError] = useState("");
  const { isAuthenticated } = useAuthStore();

  const { isSubscribed, toggleSubscription, loading: subscriptionLoading } =
    useHotelSubscription(hotelId);

  // Fetch hotel details
  const { data: hotelData, loading: hotelLoading } = useQuery<GetHotelResponse>(
    GET_HOTEL,
    {
      variables: { id: hotelId },
      skip: !hotelId,
    }
  );

  // Fetch rooms for this hotel
  const { data: roomsData, loading: roomsLoading } = useQuery<GetRoomsResponse>(
    GET_ROOMS_BY_HOTEL,
    {
      variables: { hotelId },
      skip: !hotelId,
    }
  );

  const { data: reviewsData, loading: reviewsLoading, refetch: refetchReviews } =
    useQuery<GetHotelReviewsResponse>(GET_HOTEL_REVIEWS, {
      variables: { hotelId },
      skip: !hotelId,
    });

  const [createReview, { loading: createReviewLoading }] =
    useMutation<CreateReviewResponse>(CREATE_REVIEW);

  const hotel = hotelData?.findHotel;

  const { data: hostData, loading: hostLoading } = useQuery<GetUserResponse>(GET_USER, {
    variables: { id: hotel?.ownerId },
    skip: !hotel?.ownerId,
  });

  const host = hostData?.findUser;
  const rooms = useMemo<RoomDisplayItem[]>(() => {
    const hotelRooms =
      roomsData?.findRoomsByHotel?.map((room) => ({
        room,
        item: mapRoomToRoomItem(room),
      })) ?? [];

    return [...hotelRooms, { item: constantRoomCard }];
  }, [roomsData]);

  const galleryImages = useMemo(
    () => hotel?.images || ["/hotel.jpg"],
    [hotel?.images]
  );

  const reviewItems = useMemo<ReviewItem[]>(() => {
    const reviews = reviewsData?.hotelReviews ?? [];

    const apiReviewItems = reviews.map((review) => ({
      id: review.id,
      author: review.user
        ? `${review.user.firstName} ${review.user.lastName}`.trim()
        : `Guest ${review.userId.slice(0, 6)}`,
      avatar: review.user?.avatar ?? undefined,
      description: review.comment,
      score: Number((review.rating * 2).toFixed(1)),
      date: new Date(review.createdAt).toLocaleDateString("en-US", {
        month: "short",
        year: "numeric",
      }),
    }));

    return [...apiReviewItems, ...constantHotelReviews];
  }, [reviewsData]);

  const averageReviewScore = useMemo(() => {
    if (reviewItems.length === 0) return 0;

    const total = reviewItems.reduce((sum, review) => sum + review.score, 0);
    return total / reviewItems.length;
  }, [reviewItems]);

  const openBookingModal = (room: RoomEntity) => {
    setSelectedRoom(room);
    setIsBookingModalOpen(true);
  };

  const closeBookingModal = () => {
    setIsBookingModalOpen(false);
  };

  const handleReviewSubmit = async () => {
    if (!isAuthenticated) {
      setReviewSubmitError("Please sign in to submit a review.");
      return;
    }

    if (!reviewComment.trim()) {
      setReviewSubmitError("Please write a comment before submitting.");
      return;
    }

    try {
      setReviewSubmitError("");
      await createReview({
        variables: {
          input: {
            hotelId,
            rating: reviewRating,
            comment: reviewComment.trim(),
          },
        },
      });

      setReviewComment("");
      setReviewRating(5);
      await refetchReviews();
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : "Could not submit review. Please try again.";
      setReviewSubmitError(
        message
      );
    }
  };

  const renderTabContent = () => {
    if (activeTab === "Overview") return <OverviewSection />;

    if (activeTab === "Rooms") {
      return (
        <section className="space-y-4">
          <h2 className="text-xl font-semibold text-slate-900">Rooms</h2>
          {roomsLoading ? (
            <p className="text-sm text-slate-600">Loading rooms...</p>
          ) : rooms.length === 0 ? (
            <div className="rounded-2xl border border-dashed border-slate-300 bg-slate-50 p-8 text-center">
              <p className="text-sm text-slate-600">No rooms available for this hotel</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
              {rooms.map(({ room, item }) => (
                <RoomCard
                  key={item.id}
                  room={item}
                  onBookNow={() => {
                    if (room) openBookingModal(room);
                  }}
                />
              ))}
            </div>
          )}
        </section>
      );
    }

    if (activeTab === "Amenities") {
      return (
        <section className="space-y-3 rounded-2xl border border-slate-200 bg-white p-5">
          <h2 className="text-xl font-semibold text-slate-900">Amenities</h2>
          {hotel?.amenities && hotel.amenities.length > 0 ? (
            <ul className="grid grid-cols-2 gap-2 text-sm text-slate-600 md:grid-cols-3">
              {hotel.amenities.map((amenity: string) => (
                <li key={amenity} className="flex items-center gap-2">
                  <span>✓</span> {amenity}
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-sm text-slate-600">No amenities listed</p>
          )}
        </section>
      );
    }

    return (
      <section className="space-y-3 rounded-2xl border border-slate-200 bg-white p-5 text-sm text-slate-600">
        <h2 className="text-xl font-semibold text-slate-900">Policies</h2>
        <p>Check-in: from 15:00</p>
        <p>Check-out: until 11:00</p>
        <p>Cancellation: Non-refundable options available</p>
      </section>
    );
  };

  if (hotelLoading) {
    return (
      <main className="min-h-screen bg-white">
        <Navbar />
        <div className="mx-auto w-full max-w-6xl px-4 py-8">
          <p className="text-sm text-slate-600">Loading hotel details...</p>
        </div>
      </main>
    );
  }

  if (!hotel) {
    return (
      <main className="min-h-screen bg-white">
        <Navbar />
        <div className="mx-auto w-full max-w-6xl px-4 py-8">
          <p className="text-sm text-slate-600">Hotel not found.</p>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-white">
      <div
        className="relative min-h-[34vh] overflow-hidden"
        style={{
          backgroundImage: `url('${galleryImages[0]}')`,
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      >
        <div className="absolute inset-0 bg-slate-950/35" />

        <div className="relative z-10">
          <Navbar />

          <div className="mx-auto w-full px-4 pb-10 pt-8 sm:px-6 lg:w-[80%] lg:px-0">
            <h1 className="text-3xl font-bold tracking-tight text-white drop-shadow sm:text-4xl">
              {hotel.name}
            </h1>
            <p className="mt-2 text-sm text-sky-50 sm:text-base">
              {hotel.location}, {hotel.city}, {hotel.country}
            </p>
          </div>
        </div>
      </div>

      <div className="mx-auto flex w-full flex-col gap-6 px-4 py-6 sm:px-6 lg:w-[80%] lg:px-0">
        <Breadcrumb
          items={[
            { label: "Home", href: routes.home },
            { label: "Search results", href: routes.hotels },
            { label: hotel.name },
          ]}
          className="mb-0"
        />

        <div className="flex items-start justify-between gap-4">
          <HotelHeader
            name={hotel.name}
            subtitle={hotel.description || `Located in ${hotel.city}, ${hotel.country}`}
            score={averageReviewScore > 0 ? averageReviewScore : hotel.rating ? Number(hotel.rating) * 2 : 8.5}
            reviewsCount={`${reviewItems.length} review${reviewItems.length === 1 ? "" : "s"}`}
          />

          {isAuthenticated && (
            <button
              type="button"
              onClick={() => toggleSubscription()}
              disabled={subscriptionLoading}
              className={`mt-2 flex items-center gap-2 rounded-xl px-4 py-3 text-sm font-semibold transition ${
                isSubscribed
                  ? "bg-blue-600 text-white hover:bg-blue-700"
                  : "border border-slate-200 text-slate-700 hover:bg-slate-50"
              } disabled:opacity-60`}
            >
              <Heart
                className={`h-4 w-4 ${isSubscribed ? "fill-current" : ""}`}
              />
              {subscriptionLoading ? "..." : isSubscribed ? "Subscribed" : "Subscribe"}
            </button>
          )}
        </div>

        <GalleryGrid images={galleryImages} hotelName={hotel.name} />

        <section className="grid grid-cols-1 gap-6 lg:grid-cols-10">
          <div className="space-y-6 lg:col-span-8">
            <Tabs tabs={[...tabItems]} activeTab={activeTab} onChange={(tab) => setActiveTab(tab as HotelTab)} />
            {renderTabContent()}
          </div>

          <aside className="rounded-2xl mt-10 border border-slate-200 bg-white p-5 lg:col-span-2 lg:self-start">
            <h2 className="text-xl font-semibold text-slate-900">Host profile</h2>

            {hostLoading ? (
              <p className="mt-3 text-sm text-slate-600">Loading host profile...</p>
            ) : host ? (
              <div className="mt-4  h-min  space-y-4">
                <div className=" gap-4">
                  <div className="w-full flex items-center justify-center">

                  {host.avatar ? (
                    <img
                      src={host.avatar}
                      alt={`${host.firstName} ${host.lastName}`}
                      className="h-42 w-42 rounded-full object-cover"
                    />
                  ) : (
                    <div className="flex h-14 w-14 items-center justify-center rounded-full bg-slate-100 text-base font-semibold text-slate-700">
                      {host.firstName[0]}
                      {host.lastName[0]}
                    </div>
                  )}
                  </div>

                  <div>
                    <p className="text-base font-semibold text-slate-900">
                      {host.firstName} {host.lastName}
                    </p>
                    <p className="text-sm text-slate-600">{host.email}</p>
                  </div>
                </div>

                <div className="rounded-xl bg-slate-50 px-4 py-2 text-sm text-slate-600">
                  Host since {new Date(host.createdAt).getFullYear()}
                </div>
                <button className=" w-full text-center p-2  rounded-lg bg-blue-500 hover:bg-blue-700">Send Message</button>
              </div>
            ) : (
              <p className="mt-3 text-sm text-slate-600">Host information is unavailable.</p>
            )}
          </aside>
        </section>

        <ReviewsSection
          reviews={reviewItems}
          averageScore={averageReviewScore}
          isLoading={reviewsLoading}
          totalReviews={reviewItems.length}
          isAuthenticated={isAuthenticated}
          reviewComment={reviewComment}
          reviewRating={reviewRating}
          submitLoading={createReviewLoading}
          submitError={reviewSubmitError}
          onReviewCommentChange={setReviewComment}
          onReviewRatingChange={setReviewRating}
          onReviewSubmit={handleReviewSubmit}
        />
      </div>

      <BookingModal
        open={isBookingModalOpen}
        room={selectedRoom}
        hotel={hotel}
        onClose={closeBookingModal}
      />

      <FloatingChatWidget />
    </main>
  );
}
