export interface TripMemberUser {
  id: string;
  name: string;
  email: string;
  avatar: string | null;
}

export interface TripMember {
  id: string;
  userId: string;
  role: "OWNER" | "MEMBER";
  joinedAt: string;
  user: TripMemberUser;
}

export interface Trip {
  id: string;
  title: string;
  description: string | null;

  startDate: string | null;
  endDate: string | null;

  ownerId: string;
  owner: TripMemberUser;

  members: TripMember[];

  createdAt: string;
  updatedAt: string;
}

export interface PaginatedTrips {
  trips: Trip[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}
