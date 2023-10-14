import { post } from '@/types/type';

export default function filterPosts(posts: post[], category: string) {
  if (category === '전체') return posts;
  return posts.filter((post) => post.category === category);
}
