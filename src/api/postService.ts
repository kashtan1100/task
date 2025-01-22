// src/api/postService.ts
import type { Post, Comment } from "@/types/postTypes";
export const fetchPostsPhoto  = async <T>(resource: "posts" | "photos"): Promise<T[]> => {
  const response = await fetch(`https://jsonplaceholder.typicode.com/${resource}`);
  if (!response.ok) {
    throw new Error(`Failed to fetch ${resource}`);
  }
  return response.json();
};

export const fetchUsers = async (): Promise<{ id: number; name: string }[]> => {
  const response = await fetch("https://jsonplaceholder.typicode.com/users");
  if (!response.ok) {
    throw new Error("Failed to fetch users");
  }
  return response.json();
};

export const fetchComments = async (postId: number): Promise<Comment['comments']> => {
  const response = await fetch(`https://jsonplaceholder.typicode.com/posts/${postId}/comments`);
  if (!response.ok) {
    throw new Error(`Failed to fetch comments for post ${postId}`);
  }
  return response.json();
};