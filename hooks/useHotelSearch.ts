import { useLazyQuery } from "@apollo/client/react";
import { useSearchStore } from "@/store/searchStore";
import { SEARCH_HOTELS } from "@/lib/graphql/queries";
import { HotelEntity } from "@/types";

// Define response type
interface SearchHotelsResponse {
  searchHotels: HotelEntity[];
}

export const useHotelSearch = () => {
  const { city, country, setCity, setCountry, clearSearch } = useSearchStore();

  const [searchHotels, { data, loading, error }] =
    useLazyQuery<SearchHotelsResponse>(SEARCH_HOTELS);

  const search = async () => {
    await searchHotels({
      variables: {
        city: city || undefined,
        country: country || undefined,
      },
    });
  };

  const hotels: HotelEntity[] = data?.searchHotels || [];

  return {
    hotels,
    loading,
    error,
    city,
    country,
    setCity,
    setCountry,
    search,
    clearSearch,
  };
};