export interface Trip {
  id: string;
  title: string;
  description: string | null;

  startDate: string | null;
  endDate: string | null;

  ownerId: string;

  createdAt: string;
  updatedAt: string;
}
