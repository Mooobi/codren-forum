import Form from '@/components/Form';
import { post } from '@/types/type';
import { connectDB } from '@/util/database';
import { ObjectId } from 'mongodb';
import { getServerSession } from 'next-auth';
import { redirect } from 'next/navigation';

export default async function Edit({ params }: { params: ObjectId }) {
  const db = (await connectDB).db('forum');
  const post = await db.collection('post').findOne<post | null>({ _id: new ObjectId(params.id) });
  const session = await getServerSession();

  if (session?.user?.email !== post?.author) {
    redirect(`/detail/${params.id}`);
  }

  return <>{post && <Form post={{ ...post, _id: post._id.toString() }} />}</>;
}
