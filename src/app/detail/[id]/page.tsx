import { connectDB } from '@/util/database';
import { ObjectId } from 'mongodb';
import PostDetails from './PostDetails';
import { post } from '@/types/type';
import Comment from './Comment';
import { getServerSession } from 'next-auth';

export const dynamic = 'force-dynamic';

export default async function Detail({ params }: { params: ObjectId }) {
  const db = (await connectDB).db('forum');
  const post = await db.collection('post').findOne<post | null>({ _id: new ObjectId(params.id) });
  const session = await getServerSession();

  return (
    <>
      {post && (
        <>
          <PostDetails post={{ ...post, _id: post._id.toString() }} session={session} />
          <Comment _id={post._id.toString()} />
        </>
      )}
    </>
  );
}
