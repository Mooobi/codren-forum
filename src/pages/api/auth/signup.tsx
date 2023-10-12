import { connectDB } from '@/util/database';
import { NextApiRequest, NextApiResponse } from 'next';
import bcrypt from 'bcrypt';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'POST') {
    let hash = await bcrypt.hash(req.body.password, 10);

    req.body.password = hash;

    const db = (await connectDB).db('forum');
    await db.collection('user_cred').insertOne(req.body);
    res.redirect(302, '/');
  }
}
