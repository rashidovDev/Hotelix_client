import { gql } from "@apollo/client";

// ── Auth ──
export const LOGIN = gql`
  mutation Login($input: LoginInput!) {
    login(input: $input) {
      accessToken
      refreshToken
    }
  }
`;

export const REGISTER = gql`
  mutation Register($input: RegisterInput!) {
    register(input: $input) {
      accessToken
      refreshToken
    }
  }
`;

// ── Hotels ──
export const CREATE_HOTEL = gql`
  mutation CreateHotel($input: CreateHotelInput!) {
    createHotel(input: $input) {
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

export const UPDATE_HOTEL = gql`
  mutation UpdateHotel($id: String!, $input: UpdateHotelInput!) {
    updateHotel(id: $id, input: $input) {
      id
      name
      city
      country
      location
      description
      images
      amenities
    }
  }
`;

export const REMOVE_HOTEL = gql`
  mutation RemoveHotel($id: String!) {
    removeHotel(id: $id) {
      id
      name
    }
  }
`;

// ── Rooms ──
export const CREATE_ROOM = gql`
  mutation CreateRoom($input: CreateRoomInput!) {
    createRoom(input: $input) {
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

export const UPDATE_ROOM = gql`
  mutation UpdateRoom($id: String!, $input: UpdateRoomInput!) {
    updateRoom(id: $id, input: $input) {
      id
      name
      type
      price
      capacity
      description
    }
  }
`;

export const REMOVE_ROOM = gql`
  mutation RemoveRoom($id: String!) {
    removeRoom(id: $id)
  }
`;

// ── Bookings ──
export const CREATE_BOOKING = gql`
  mutation CreateBooking($input: CreateBookingInput!) {
    createBooking(input: $input) {
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

export const CANCEL_BOOKING = gql`
  mutation CancelBooking($id: String!) {
    cancelBooking(id: $id) {
      id
      status
    }
  }
`;

// ── Reviews ──
export const CREATE_REVIEW = gql`
  mutation CreateReview($input: CreateReviewInput!) {
    createReview(input: $input) {
      id
      rating
      comment
      hotelId
      userId
      createdAt
    }
  }
`;

export const REMOVE_REVIEW = gql`
  mutation RemoveReview($id: String!) {
    removeReview(id: $id)
  }
`;

// ── Users ──
export const UPDATE_USER = gql`
  mutation UpdateUser($id: String!, $input: UpdateUserInput!) {
    updateUser(id: $id, input: $input) {
      id
      firstName
      lastName
      email
    }
  }
`;

export const REMOVE_USER = gql`
  mutation RemoveUser($id: String!) {
    removeUser(id: $id)
  }
`;