import Tab from '@/components/client/Tab';
import Link from 'next/link';
import tw from 'tailwind-styled-components';
import { connectDB } from '../../util/database';
import ListItem from '@/components/client/ListItem';

const Home = async () => {
  const db = (await connectDB).db('forum');
  let result = await db.collection('post').find().toArray();

  result = result.map((item: any) => {
    item._id = item._id.toString();
    return item;
  });

  const Card = tw.div`
    ml-4 flex h-8 w-24 items-center justify-center rounded-md m-4
  `;

  return (
    <main className="mt-20 flex h-[85vh] items-center justify-center">
      <div className="flex h-full max-w-[1440px] justify-between">
        <nav className="flex-col border-r p-4">
          <Link href="/write">
            <Card className="h-16 bg-mooblue text-moowhite">글쓰기</Card>
          </Link>
          <Tab>전체글</Tab>
          <Tab>프론트엔드</Tab>
          <Tab>백엔드</Tab>
          <Tab>좋아하는글</Tab>
        </nav>
        <section className="m-2 flex-col items-center justify-center">
          <ListItem result={result} />
        </section>
        <aside className="flex w-32 items-center justify-center border-l border-moogray">
          배너
        </aside>
      </div>
    </main>
  );
};

export default Home;
