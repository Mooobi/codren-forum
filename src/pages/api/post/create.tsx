import { connectDB } from '@/util/database';
import { NextApiRequest, NextApiResponse } from 'next';
import { getServerSession } from 'next-auth';
import { authOptions } from '../auth/[...nextauth]';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'POST') {
    const db = (await connectDB).db('forum');

    const session = await getServerSession(req, res, authOptions);

    req.body = {
      ...req.body,
      createdAt: new Date(),
      updatedAt: new Date(),
      author: session?.user?.email,
      commentCount: 0,
      likeCount: 0,
      liker: [],
    };

    const result = await db.collection('post').insertOne(req.body);

    res.redirect(302, `/detail/${result.insertedId}`);
  }
}
