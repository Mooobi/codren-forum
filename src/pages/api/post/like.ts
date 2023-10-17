import { connectDB } from '@/util/database';
import { ObjectId } from 'mongodb';
import { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'PATCH') {
    const db = (await connectDB).db('forum');

    const _id = req.body._id;

    delete req.body._id;

    await db.collection('post').updateOne({ _id: new ObjectId(_id) }, { $set: req.body });
    res.status(200).json('like');
  }
}
