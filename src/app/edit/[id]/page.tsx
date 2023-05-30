import { ObjectId } from 'mongodb';
import { connectDB } from '../../../../util/database';
import tw from 'tailwind-styled-components';
import Link from 'next/link';
import Form from '@/components/client/Form';

const Edit = async (props: any) => {
  const db = (await connectDB).db('forum');
  let result = await db
    .collection('post')
    .findOne({ _id: new ObjectId(props.params.id) });

  const Card = tw.div`
  ml-4 flex h-8 w-24 items-center justify-center rounded-md m-4
  `;
  return (
    <main className="mt-20 flex h-[85vh] items-center justify-center">
      <div className="flex h-full max-w-[1440px] justify-between">
        <nav className="flex-col border-r p-4">
          <Link prefetch={false} href="/">
            <Card className="h-16 bg-moogray text-mooblack">목록 돌아가기</Card>
          </Link>
        </nav>
        <section className="m-2 w-[736px] flex-col items-center justify-center">
          <Form result={result} />
        </section>
        <section className="flex w-32 items-center justify-center border-l border-moogray">
          배너
        </section>
      </div>
    </main>
  );
};

export default Edit;
