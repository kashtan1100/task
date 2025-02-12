export interface Post {
  id: number;
  userId: number;
  title: string;
  body: string;
}

export interface Comment {
  postId: number;
  comments: {
    id: number;
    name: string;
    email: string;
    body: string
  }[];
}