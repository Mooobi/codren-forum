import { connectDB } from '@/util/database';
import { NextApiRequest, NextApiResponse } from 'next';
import { getServerSession } from 'next-auth';
import { authOptions } from '../../auth/[...nextauth]';
import { ObjectId } from 'mongodb';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'POST') {
    const db = (await connectDB).db('forum');

    const session = await getServerSession(req, res, authOptions);

    req.body = {
      ...req.body,
      author: session?.user?.email,
      parent: new ObjectId(req.query.id as string),
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    await db.collection('comment').insertOne(req.body);

    res.redirect(302, `/detail/${req.query.id}`);
  }
}
