import { ObjectId } from 'mongodb';
import { connectDB } from '../../../../util/database';
import LeftSide from '@/components/client/LeftSide';
import RightSide from '@/components/server/RightSide';

const Detail = async (props: any) => {
  const db = (await connectDB).db('forum');
  let result = await db
    .collection('post')
    .findOne({ _id: new ObjectId(props.params.id) });
  // console.log(result);

  return (
    <main className="mt-20 flex h-[85vh] items-center justify-center">
      <div className="flex h-full max-w-[1440px] justify-between">
        <LeftSide />
        <section className="m-2 w-[736px] flex-col items-center justify-center">
          <div className="flex w-[736px] flex-col items-center justify-center">
            <label>글제목</label>
            <div className="mb-2 mt-2 w-full border border-moogray p-2">
              {result.title}
            </div>
            <label>카테고리</label>
            <div className="mb-2 mt-2 w-full border border-moogray p-2">
              {result.stack}
            </div>
            <label>글내용</label>
            <div className="mb-2 mt-2 w-full border border-moogray p-2">
              {result.content}
            </div>
          </div>
        </section>
        <RightSide />
      </div>
    </main>
  );
};

export default Detail;
