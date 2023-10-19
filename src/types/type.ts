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
  liker: string[];
};

export type comment = {
  _id: string;
  parent: string;
  author: string;
  content: string;
  createdAt: Date;
  updatedAt: Date;
};
