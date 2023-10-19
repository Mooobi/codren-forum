import { connectDB } from '@/util/database';
import { ObjectId } from 'mongodb';
import { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'POST') {
    const db = (await connectDB).db('forum');

    const origin = await db
      .collection('comment')
      .findOne({ _id: new ObjectId(req.query.id as string) });

    req.body = { ...origin, updatedAt: new Date(), content: req.body.content };

    await db
      .collection('comment')
      .updateOne({ _id: new ObjectId(req.query.id as string) }, { $set: req.body });

    res.redirect(302, `/detail/${req.body.parent}`);
  }
}
