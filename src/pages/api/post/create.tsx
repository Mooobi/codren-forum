import { getServerSession } from 'next-auth';
import { connectDB } from '../../../../util/database';
import { authOptions } from '../auth/[...nextauth]';

const handler = async (req: any, res: any) => {
  let session: any = await getServerSession(req, res, authOptions);

  if (session) {
    req.body.author = session.user.email;
  }

  if (req.method === 'POST') {
    if (req.body.title === '' || req.body.content === '') {
      return res.status(500).json('글을 입력해주세요');
    } else if (req.body.stack === '') {
      return res.status(500).json('카테고리를 선택해주세요');
    }
    try {
      req.body.date = new Date().toLocaleString();
      const db = (await connectDB).db('forum');
      await db.collection('post').insertOne(req.body);
      return res.redirect(302, '/');
    } catch (err) {
      return res.status(500).json('error');
    }
  }
};

export default handler;
