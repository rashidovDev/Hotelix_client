import { useMutation, useQuery } from "@apollo/client/react";
import { IS_SUBSCRIBED, GET_MY_SUBSCRIPTIONS } from "@/lib/graphql/queries";
import { SUBSCRIBE_TO_HOTEL, UNSUBSCRIBE_FROM_HOTEL } from "@/lib/graphql/mutations";

interface IsSubscribedResponse {
  isSubscribed: boolean;
}

interface MySubscriptionsResponse {
  mySubscriptions: Array<{
    id: string;
    userId: string;
    hotelId: string;
    createdAt: string;
  }>;
}

interface SubscribeResponse {
  subscribeToHotel: {
    id: string;
    userId: string;
    hotelId: string;
    createdAt: string;
  };
}

interface UnsubscribeResponse {
  unsubscribeFromHotel: boolean;
}

export const useHotelSubscription = (hotelId?: string) => {
  const { data: subscriptionData, loading: checkLoading, refetch: refetchSubscription } =
    useQuery<IsSubscribedResponse>(IS_SUBSCRIBED, {
      variables: { hotelId: hotelId || "" },
      skip: !hotelId,
    });

  const { data: mySubscriptionsData, loading: subscriptionsLoading } =
    useQuery<MySubscriptionsResponse>(GET_MY_SUBSCRIPTIONS);

  const [subscribe, { loading: subscribeLoading }] =
    useMutation<SubscribeResponse>(SUBSCRIBE_TO_HOTEL);

  const [unsubscribe, { loading: unsubscribeLoading }] =
    useMutation<UnsubscribeResponse>(UNSUBSCRIBE_FROM_HOTEL);

  const isSubscribed = subscriptionData?.isSubscribed ?? false;
  const mySubscriptions = mySubscriptionsData?.mySubscriptions ?? [];

  const toggleSubscription = async () => {
    try {
      if (isSubscribed && hotelId) {
        await unsubscribe({
          variables: { hotelId },
        });
      } else if (hotelId) {
        await subscribe({
          variables: { hotelId },
        });
      }
      await refetchSubscription();
    } catch (error) {
      console.error("Subscription error:", error);
      throw error;
    }
  };

  return {
    isSubscribed,
    mySubscriptions,
    toggleSubscription,
    loading: checkLoading || subscribeLoading || unsubscribeLoading,
    subscriptionsLoading,
  };
};
