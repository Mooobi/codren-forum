import { ObjectId } from 'mongodb';
import { connectDB } from '../../../../util/database';
import Link from 'next/link';
import tw from 'tailwind-styled-components';

const Detail = async (props: any) => {
  const db = (await connectDB).db('forum');
  let result = await db
    .collection('post')
    .findOne({ _id: new ObjectId(props.params.id) });
  // console.log(result);
  const Card = tw.div`
    ml-4 flex h-8 w-24 items-center justify-center rounded-md m-4
    `;
  return (
    <main className="mt-20 flex h-[82vh] max-w-[1440px] justify-between">
      <nav className="flex-col border-r p-4">
        <Link prefetch={false} href="/">
          <Card className="h-16 bg-moogray text-mooblack">목록 돌아가기</Card>
        </Link>
      </nav>
      <section className="m-2 flex-col items-center justify-center">
        <div className="flex flex-col items-center justify-center">
          <label>글제목</label>
          <div className="mb-2 mt-2 w-[40vw] border border-moogray p-2">
            {result.title}
          </div>
          <label>카테고리</label>
          <div className="mb-2 mt-2 w-[40vw] border border-moogray p-2">
            {result.stack}
          </div>
          <label>글내용</label>
          <div className="mt-2 w-[40vw] border border-moogray p-2">
            {result.content}
          </div>
        </div>
      </section>
      <section className="flex w-32 items-center justify-center border-l border-moogray">
        배너
      </section>
    </main>
  );
};

export default Detail;
