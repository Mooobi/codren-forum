import { ObjectId } from 'mongodb';
import { connectDB } from '../../../../util/database';

const handler = async (req: any, res: any) => {
  console.log(req.body);
  if (req.method === 'POST') {
    let newData = {
      title: req.body.title,
      content: req.body.content,
      stack: req.body.stack,
      date: new Date().toLocaleString(),
    };
    const db = (await connectDB).db('forum');
    let result = await db
      .collection('post')
      .updateOne({ _id: new ObjectId(req.body._id) }, { $set: newData }); //$Inc 하면 증감
    console.log(result);
  }
  res.redirect(302, '/');
};

export default handler;
