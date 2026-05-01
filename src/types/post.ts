import { User } from "./user";

export type Comment = {
  id: string;
  content: string;
  author: User;
  createdAt: string;
};

export type Post = {
  id: string;
  content: string;
  author: User;
  createdAt: string;
  likes: number;
  retweets: number;
  comments: Comment[];
  liked?: boolean;
  retweeted?: boolean;
};