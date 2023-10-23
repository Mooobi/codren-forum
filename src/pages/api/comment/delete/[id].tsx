import { connectDB } from '@/util/database';
import { ObjectId } from 'mongodb';
import { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'DELETE') {
    const db = (await connectDB).db('forum');

    await db.collection('comment').deleteOne({ _id: new ObjectId(req.query.id as string) });

    // const commentList = await db.collection('comment').find({ parent: req.body.parent }).toArray();

    // await db
    //   .collection('post')
    //   .findOneAndUpdate({ _id: req.body.parent }, { $set: { commentCount: commentList.length } });

    res.status(204).end();
  }
}
