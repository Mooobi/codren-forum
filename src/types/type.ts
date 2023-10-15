export type post = {
  _id: string;
  category: string;
  title: string;
  content: string;
  createdAt: Date;
  updatedAt: Date;
  author: string;
  commentCount: number;
  likeCount: number;
};