import { connectDB } from '@/util/database';
import ListItems from './ListItems';
import { post } from '@/types/type';

export const dynamic = 'force-dynamic';

export default async function List() {
  const db = (await connectDB).db('forum');
  let posts = await db.collection<post>('post').find().toArray();

  let parsedPosts = posts.map((post) => ({ ...post, _id: post._id.toString() }));

  return <ListItems posts={parsedPosts} />;
}
