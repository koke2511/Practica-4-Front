import axios from "axios";
import { getToken } from "./auth";
import { Post, Comment, User } from "@/types";

export const api = axios.create({
  baseURL: "https://backend-p4-klvc.onrender.com/api",
  timeout: 8000,
  headers: {
    "x-nombre": "Jorge Ferrero",
  },
});

api.interceptors.request.use((config) => {
  const token = getToken();

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  config.headers["x-nombre"] = "Jorge Ferrero";

  return config;
});

const normalizeUser = (user: any): User => {
  return {
    id: String(user?._id || user?.id || ""),
    username: user?.username || user?.name || "unknown",
    email: user?.email,
    bio: user?.bio || "",
    followers: user?.followers || user?.followersCount || 0,
    following: user?.following || user?.followingCount || 0,
    isFollowing: user?.isFollowing || false,
  };
};

const normalizeComment = (comment: any): Comment => {
  return {
    id: String(comment?._id || comment?.id || ""),
    content: comment?.contenido || comment?.content || "",
    author: normalizeUser(comment?.autor || comment?.author || comment?.user),
    createdAt:
      comment?.fecha ||
      comment?.createdAt ||
      comment?.created_at ||
      new Date().toISOString(),
  };
};

const normalizePost = (post: any): Post => {
  return {
    id: String(post?._id || post?.id || ""),
    content: post?.contenido || post?.content || "",
    author: normalizeUser(post?.autor || post?.author || post?.user),
    createdAt:
      post?.createdAt ||
      post?.updatedAt ||
      post?.fecha ||
      new Date().toISOString(),
    likes: Array.isArray(post?.likes) ? post.likes.length : post?.likes || 0,
    retweets: Array.isArray(post?.retweets)
      ? post.retweets.length
      : post?.retweets || 0,
    comments: Array.isArray(post?.comentarios)
      ? post.comentarios.map((comment: any) => normalizeComment(comment))
      : [],
    liked: false,
    retweeted: false,
  };
};

export const login = async (email: string, password: string) => {
  const response = await api.post("/auth/login", {
    email,
    password,
  });

  return response.data;
};

export const register = async (
  username: string,
  email: string,
  password: string
) => {
  const response = await api.post("/auth/register", {
    username,
    email,
    password,
  });

  return response.data;
};

export const getPosts = async (page: number) => {
  const response = await api.get(`/home?page=${page}&limit=10`);

  const posts = response.data.posts.map((post: any) => normalizePost(post));

  return {
    posts,
    totalPages: response.data.totalPaginas || 1,
    currentPage: response.data.pagina || page,
    totalPosts: response.data.totalPosts || posts.length,
  };
};

export const createPost = async (content: string) => {
  const response = await api.post("/posts", {
    contenido: content,
  });

  return normalizePost(response.data);
};

export const getPostById = async (id: string) => {
  const response = await api.get(`/posts/${id}`);

  return normalizePost(response.data);
};

export const likePost = async (id: string) => {
  const response = await api.post(`/posts/${id}/like`);

  return normalizePost(response.data);
};

export const retweetPost = async (id: string) => {
  const response = await api.post(`/posts/${id}/retweet`);

  return normalizePost(response.data);
};

export const createComment = async (id: string, content: string) => {
  const response = await api.post(`/posts/${id}/comment`, {
    contenido: content,
  });

  return normalizePost(response.data);
};

export const getComments = async (id: string) => {
  const post = await getPostById(id);

  return post.comments;
};

export const getProfile = async (username: string) => {
  const response = await api.get(`/users/${username}`);

  return normalizeUser(response.data.user || response.data);
};

export const getMyProfile = async () => {
  const response = await api.get("/users/me");

  return normalizeUser(response.data.user || response.data);
};

export const followUser = async (id: string) => {
  const response = await api.post(`/users/${id}/follow`);

  return normalizeUser(response.data.user || response.data);
};

export const unfollowUser = async (id: string) => {
  const response = await api.delete(`/users/${id}/follow`);

  return normalizeUser(response.data.user || response.data);
};

export const getUserPosts = async (username: string, page: number) => {
  const response = await api.get(`/users/${username}/posts?page=${page}&limit=10`);

  const posts = response.data.posts.map((post: any) => normalizePost(post));

  return {
    posts,
    totalPages: response.data.totalPaginas || 1,
  };
};