import { ObjectId } from 'mongodb';
import { connectDB } from '../../../../util/database';
import { getServerSession } from 'next-auth';
import { authOptions } from '../auth/[...nextauth]';

const handler = async (req: any, res: any) => {
  let session: any = await getServerSession(req, res, authOptions);
  console.log(req.body);
  if (req.method === 'POST' && session) {
    try {
      const db = (await connectDB).db('forum');
      let item = await db
        .collection('post')
        .findOne({ _id: new ObjectId(req.body) });
      if (item.author === session.user.name) {
        let result = await db
          .collection('post')
          .deleteOne({ _id: new ObjectId(req.body) });
        if (result.deletedCount === 1) {
          res.status(200).json('삭제완료');
        }
      } else {
        res.status(500).json('삭제안됨');
      }
    } catch (error) {
      console.log(error);
    }
  }
};

export default handler;
