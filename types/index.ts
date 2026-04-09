export type Maybe<T> = T | null;
export type InputMaybe<T> = Maybe<T>;
export type Exact<T extends { [key: string]: unknown }> = { [K in keyof T]: T[K] };
export type MakeOptional<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]?: Maybe<T[SubKey]> };
export type MakeMaybe<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]: Maybe<T[SubKey]> };
export type MakeEmpty<T extends { [key: string]: unknown }, K extends keyof T> = { [_ in K]?: never };
export type Incremental<T> = T | { [P in keyof T]?: P extends ' $fragmentName' | '__typename' ? T[P] : never };
/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
  ID: { input: string; output: string; }
  String: { input: string; output: string; }
  Boolean: { input: boolean; output: boolean; }
  Int: { input: number; output: number; }
  Float: { input: number; output: number; }
  DateTime: { input: string; output: string; }
  Upload: { input: File; output: File; }
};

export type AuthResponse = {
  __typename?: 'AuthResponse';
  accessToken: Scalars['String']['output'];
  user: UserEntity;
};

export type BookingEntity = {
  __typename?: 'BookingEntity';
  checkIn: Scalars['DateTime']['output'];
  checkOut: Scalars['DateTime']['output'];
  createdAt: Scalars['DateTime']['output'];
  id: Scalars['String']['output'];
  roomId: Scalars['String']['output'];
  status: BookingStatus;
  totalPrice: Scalars['Float']['output'];
  updatedAt: Scalars['DateTime']['output'];
  userId: Scalars['String']['output'];
};

/** Status of a booking */
export enum BookingStatus {
  Cancelled = 'CANCELLED',
  Confirmed = 'CONFIRMED',
  Pending = 'PENDING'
}

export type CreateBookingInput = {
  checkIn: Scalars['DateTime']['input'];
  checkOut: Scalars['DateTime']['input'];
  roomId: Scalars['String']['input'];
};

export type CreateHotelInput = {
  amenities?: InputMaybe<Array<Scalars['String']['input']>>;
  city: Scalars['String']['input'];
  country: Scalars['String']['input'];
  description?: InputMaybe<Scalars['String']['input']>;
  images?: InputMaybe<Array<Scalars['String']['input']>>;
  location: Scalars['String']['input'];
  name: Scalars['String']['input'];
};

export type CreateReviewInput = {
  comment: Scalars['String']['input'];
  hotelId: Scalars['String']['input'];
  rating: Scalars['Int']['input'];
};

export type CreateRoomInput = {
  capacity: Scalars['Int']['input'];
  description?: InputMaybe<Scalars['String']['input']>;
  hotelId: Scalars['String']['input'];
  images?: InputMaybe<Array<Scalars['String']['input']>>;
  name: Scalars['String']['input'];
  price: Scalars['Float']['input'];
  type: RoomType;
};

export type HotelEntity = {
  __typename?: 'HotelEntity';
  amenities: Array<Scalars['String']['output']>;
  city: Scalars['String']['output'];
  country: Scalars['String']['output'];
  createdAt: Scalars['DateTime']['output'];
  description?: Maybe<Scalars['String']['output']>;
  id: Scalars['String']['output'];
  images: Array<Scalars['String']['output']>;
  location: Scalars['String']['output'];
  name: Scalars['String']['output'];
  ownerId: Scalars['String']['output'];
  rating?: Maybe<Scalars['Float']['output']>;
  updatedAt: Scalars['DateTime']['output'];
};

export type LoginInput = {
  email: Scalars['String']['input'];
  password: Scalars['String']['input'];
};

export type Mutation = {
  __typename?: 'Mutation';
  cancelBooking: BookingEntity;
  createBooking: BookingEntity;
  createHotel: HotelEntity;
  createReview: ReviewEntity;
  createRoom: RoomEntity;
  login: AuthResponse;
  logout: Scalars['Boolean']['output'];
  refreshTokens: AuthResponse;
  register: AuthResponse;
  removeHotel: HotelEntity;
  removeReview: Scalars['Boolean']['output'];
  removeRoom: Scalars['Boolean']['output'];
  removeUser: Scalars['Boolean']['output'];
  updateAvatar: UserEntity;
  updateHotel: HotelEntity;
  updateRoom: RoomEntity;
  updateUser: UserEntity;
  uploadAvatar: Scalars['String']['output'];
  uploadImage: Scalars['String']['output'];
  uploadImages: Array<Scalars['String']['output']>;
};


export type MutationCancelBookingArgs = {
  id: Scalars['String']['input'];
};


export type MutationCreateBookingArgs = {
  input: CreateBookingInput;
};


export type MutationCreateHotelArgs = {
  input: CreateHotelInput;
};


export type MutationCreateReviewArgs = {
  input: CreateReviewInput;
};


export type MutationCreateRoomArgs = {
  input: CreateRoomInput;
};


export type MutationLoginArgs = {
  input: LoginInput;
};


export type MutationRegisterArgs = {
  input: RegisterInput;
};


export type MutationRemoveHotelArgs = {
  id: Scalars['String']['input'];
};


export type MutationRemoveReviewArgs = {
  id: Scalars['String']['input'];
};


export type MutationRemoveRoomArgs = {
  id: Scalars['String']['input'];
};


export type MutationRemoveUserArgs = {
  id: Scalars['String']['input'];
};


export type MutationUpdateHotelArgs = {
  id: Scalars['String']['input'];
  input: UpdateHotelInput;
};


export type MutationUpdateAvatarArgs = {
  avatarUrl: Scalars['String']['input'];
};


export type MutationUpdateRoomArgs = {
  id: Scalars['String']['input'];
  input: UpdateRoomInput;
};


export type MutationUpdateUserArgs = {
  id: Scalars['String']['input'];
  input: UpdateUserInput;
};


export type MutationUploadAvatarArgs = {
  file: Scalars['Upload']['input'];
};


export type MutationUploadImageArgs = {
  file: Scalars['Upload']['input'];
};


export type MutationUploadImagesArgs = {
  files: Array<Scalars['Upload']['input']>;
};

export type Query = {
  __typename?: 'Query';
  checkRoomAvailability: Scalars['Boolean']['output'];
  findAllHotels: Array<HotelEntity>;
  findAllUsers: Array<UserEntity>;
  findBooking: BookingEntity;
  findHotel: HotelEntity;
  findRoom: RoomEntity;
  findRoomsByHotel: Array<RoomEntity>;
  findUser: UserEntity;
  hotelReviews: Array<ReviewEntity>;
  me: UserEntity;
  myBookings: Array<BookingEntity>;
  myHotels: Array<HotelEntity>;
  myReviews: Array<ReviewEntity>;
  roomBookings: Array<BookingEntity>;
  searchHotels: Array<HotelEntity>;
};


export type QueryCheckRoomAvailabilityArgs = {
  checkIn: Scalars['DateTime']['input'];
  checkOut: Scalars['DateTime']['input'];
  roomId: Scalars['String']['input'];
};


export type QueryFindBookingArgs = {
  id: Scalars['String']['input'];
};


export type QueryFindHotelArgs = {
  id: Scalars['String']['input'];
};


export type QueryFindRoomArgs = {
  id: Scalars['String']['input'];
};


export type QueryFindRoomsByHotelArgs = {
  hotelId: Scalars['String']['input'];
};


export type QueryFindUserArgs = {
  id: Scalars['String']['input'];
};


export type QueryHotelReviewsArgs = {
  hotelId: Scalars['String']['input'];
};


export type QueryRoomBookingsArgs = {
  roomId: Scalars['String']['input'];
};


export type QuerySearchHotelsArgs = {
  city?: InputMaybe<Scalars['String']['input']>;
  country?: InputMaybe<Scalars['String']['input']>;
};

export type RegisterInput = {
  email: Scalars['String']['input'];
  firstName: Scalars['String']['input'];
  lastName: Scalars['String']['input'];
  password: Scalars['String']['input'];
};

export type ReviewEntity = {
  __typename?: 'ReviewEntity';
  comment: Scalars['String']['output'];
  createdAt: Scalars['DateTime']['output'];
  hotelId: Scalars['String']['output'];
  id: Scalars['String']['output'];
  rating: Scalars['Int']['output'];
  userId: Scalars['String']['output'];
};

/** User roles */
export enum Role {
  Admin = 'ADMIN',
  Guest = 'GUEST',
  Host = 'HOST'
}

export type RoomEntity = {
  __typename?: 'RoomEntity';
  capacity: Scalars['Int']['output'];
  createdAt: Scalars['DateTime']['output'];
  description?: Maybe<Scalars['String']['output']>;
  hotelId: Scalars['String']['output'];
  id: Scalars['String']['output'];
  images: Array<Scalars['String']['output']>;
  name: Scalars['String']['output'];
  price: Scalars['Float']['output'];
  type: RoomType;
  updatedAt: Scalars['DateTime']['output'];
};

/** Type of room */
export enum RoomType {
  Deluxe = 'DELUXE',
  Double = 'DOUBLE',
  Single = 'SINGLE',
  Suite = 'SUITE'
}

export type UpdateHotelInput = {
  amenities?: InputMaybe<Array<Scalars['String']['input']>>;
  city?: InputMaybe<Scalars['String']['input']>;
  country?: InputMaybe<Scalars['String']['input']>;
  description?: InputMaybe<Scalars['String']['input']>;
  images?: InputMaybe<Array<Scalars['String']['input']>>;
  location?: InputMaybe<Scalars['String']['input']>;
  name?: InputMaybe<Scalars['String']['input']>;
};

export type UpdateRoomInput = {
  capacity?: InputMaybe<Scalars['Int']['input']>;
  description?: InputMaybe<Scalars['String']['input']>;
  images?: InputMaybe<Array<Scalars['String']['input']>>;
  name?: InputMaybe<Scalars['String']['input']>;
  price?: InputMaybe<Scalars['Float']['input']>;
  type?: InputMaybe<RoomType>;
};

export type UpdateUserInput = {
  email?: InputMaybe<Scalars['String']['input']>;
  firstName?: InputMaybe<Scalars['String']['input']>;
  lastName?: InputMaybe<Scalars['String']['input']>;
};

export type UserEntity = {
  __typename?: 'UserEntity';
  avatar?: Maybe<Scalars['String']['output']>;
  createdAt: Scalars['DateTime']['output'];
  email: Scalars['String']['output'];
  firstName: Scalars['String']['output'];
  id: Scalars['String']['output'];
  lastName: Scalars['String']['output'];
  role: Role;
  updatedAt: Scalars['DateTime']['output'];
};
