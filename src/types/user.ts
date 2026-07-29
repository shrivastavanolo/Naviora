export interface User {
  id: string;
  name: string;
  email: string;
  avatar: string | null;
  bio: string | null;
  emailVerified: string | null;
  provider: string;
  createdAt: string;
}
