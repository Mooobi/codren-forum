import { connectDB } from '@/util/database';
import { ObjectId } from 'mongodb';
import PostDetails from './PostDetails';
import { comment, post } from '@/types/type';
import Comment from './Comment';
import { getServerSession } from 'next-auth';

export const dynamic = 'force-dynamic';

export default async function Detail({ params }: { params: ObjectId }) {
  const db = (await connectDB).db('forum');
  const post = await db.collection('post').findOne<post>({ _id: new ObjectId(params.id) });
  const comments = await db
    .collection('comment')
    .find<comment & { parent: ObjectId }>({ parent: new ObjectId(params.id) })
    .toArray();
  const session = await getServerSession();

  const parsedComments = comments.map((comment) => ({
    ...comment,
    _id: comment._id.toString(),
    parent: comment.parent.toString(),
  }));

  return (
    <>
      {post && (
        <>
          <PostDetails post={{ ...post, _id: post._id.toString() }} session={session} />
          <Comment _id={post._id.toString()} comments={parsedComments} session={session} />
        </>
      )}
    </>
  );
}
