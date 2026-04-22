import { useQuery } from "@apollo/client/react";
import { useMutation } from "@apollo/client/react";
import HotelCard, { HotelListItem } from "./HotelCard";
import { GET_HOTEL_SUBSCRIPTION_COUNT, IS_SUBSCRIBED } from "@/lib/graphql/queries";
import { SUBSCRIBE_TO_HOTEL } from "@/lib/graphql/mutations";
import { useAuthStore } from "@/store/authStore";

interface HotelCardWithSubscriptionProps {
  hotel: HotelListItem;
}

interface GetHotelSubscriptionCountResponse {
  getHotelSubscriptionCount: number;
}

interface IsSubscribedResponse {
  isSubscribed: boolean;
}

interface SubscribeToHotelResponse {
  subscribeToHotel: {
    id: string;
    userId: string;
    hotelId: string;
    createdAt: string;
  };
}

export default function HotelCardWithSubscription({ hotel }: HotelCardWithSubscriptionProps) {
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);

  const { data, refetch: refetchCount } = useQuery<GetHotelSubscriptionCountResponse>(GET_HOTEL_SUBSCRIPTION_COUNT, {
    variables: { hotelId: hotel.id },
  });

  const { data: subscriptionState, refetch: refetchSubscription } = useQuery<IsSubscribedResponse>(IS_SUBSCRIBED, {
    variables: { hotelId: hotel.id },
    skip: !isAuthenticated,
  });

  const [subscribeToHotel, { loading: followLoading }] =
    useMutation<SubscribeToHotelResponse>(SUBSCRIBE_TO_HOTEL);

  const handleFollow = async () => {
    await subscribeToHotel({
      variables: { hotelId: hotel.id },
    });
    await Promise.all([refetchCount(), refetchSubscription()]);
  };

  const isSubscribed = isAuthenticated ? (subscriptionState?.isSubscribed ?? false) : undefined;

  const hotelWithSubscriptionCount: HotelListItem = {
    ...hotel,
    subscriptionCount: data?.getHotelSubscriptionCount || 0,
  };

  return (
    <HotelCard
      hotel={hotelWithSubscriptionCount}
      isSubscribed={isSubscribed}
      onFollow={isAuthenticated && isSubscribed === false ? handleFollow : undefined}
      followLoading={followLoading}
    />
  );
}
