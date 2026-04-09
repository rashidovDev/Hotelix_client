import { gql } from "@apollo/client";




// ── Hotels ──
export const GET_ALL_HOTELS = gql`
  query FindAllHotels {
    findAllHotels {
      id
      name
      city
      country
      location
      description
      images
      amenities
      rating
      ownerId
      createdAt
    }
  }
`;

export const GET_HOTEL = gql`
  query FindHotel($id: String!) {
    findHotel(id: $id) {
      id
      name
      city
      country
      location
      description
      images
      amenities
      rating
      ownerId
      createdAt
    }
  }
`;

export const SEARCH_HOTELS = gql`
  query SearchHotels($city: String, $country: String) {
    searchHotels(city: $city, country: $country) {
      id
      name
      city
      country
      location
      description
      images
      amenities
      rating
    }
  }
`;

export const GET_MY_HOTELS = gql`
  query MyHotels {
    myHotels {
      id
      name
      city
      country
      rating
      images
    }
  }
`;

// ── Rooms ──
export const GET_ROOMS_BY_HOTEL = gql`
  query FindRoomsByHotel($hotelId: String!) {
    findRoomsByHotel(hotelId: $hotelId) {
      id
      name
      type
      price
      capacity
      description
      images
      hotelId
    }
  }
`;

export const GET_ROOM = gql`
  query FindRoom($id: String!) {
    findRoom(id: $id) {
      id
      name
      type
      price
      capacity
      description
      images
      hotelId
    }
  }
`;

export const CHECK_ROOM_AVAILABILITY = gql`
  query CheckRoomAvailability(
    $roomId: String!
    $checkIn: DateTime!
    $checkOut: DateTime!
  ) {
    checkRoomAvailability(
      roomId: $roomId
      checkIn: $checkIn
      checkOut: $checkOut
    )
  }
`;

// ── Bookings ──
export const GET_MY_BOOKINGS = gql`
  query MyBookings {
    myBookings {
      id
      roomId
      userId
      checkIn
      checkOut
      totalPrice
      status
      createdAt
    }
  }
`;

export const GET_BOOKING = gql`
  query FindBooking($id: String!) {
    findBooking(id: $id) {
      id
      roomId
      userId
      checkIn
      checkOut
      totalPrice
      status
      createdAt
    }
  }
`;

// ── Reviews ──
export const GET_HOTEL_REVIEWS = gql`
  query HotelReviews($hotelId: String!) {
    hotelReviews(hotelId: $hotelId) {
      id
      rating
      comment
      userId
      hotelId
      createdAt
    }
  }
`;

export const GET_MY_REVIEWS = gql`
  query MyReviews {
    myReviews {
      id
      rating
      comment
      hotelId
      createdAt
    }
  }
`;

// ── Users ──

export const GET_ME = gql`
  query Me {
    me {
      id
      firstName
      lastName
      email
      role
      avatar
      createdAt
    }
  }
`;


export const GET_USER = gql`
  query FindUser($id: String!) {
    findUser(id: $id) {
      id
      firstName
      lastName
      email
      role
      avatar
      createdAt
    }
  }
`;

export const GET_ALL_USERS = gql`
  query FindAllUsers {
    findAllUsers {
      id
      firstName
      lastName
      email
      role
      avatar
      createdAt
    }
  }
`;