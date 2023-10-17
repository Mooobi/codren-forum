import { connectDB } from '@/util/database';
import { ObjectId } from 'mongodb';
import { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'DELETE') {
    const db = (await connectDB).db('forum');

    await db.collection('post').deleteOne({ _id: new ObjectId(req.query.id as string) });

    res.status(204).end();
  }
}
