export type User = {
  id: string;
  username: string;
  email?: string;
  bio?: string;
  followers?: number;
  following?: number;
  isFollowing?: boolean;
};