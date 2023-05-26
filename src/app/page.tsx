import Tab from '@/components/Tab';
import Link from 'next/link';
import tw from 'tailwind-styled-components';

const Home = () => {
  const Card = tw.div`
  ml-4 flex h-8 w-24 items-center justify-center rounded-md m-4
  `;
  return (
    <main className="flex">
      <nav className="flex-col border-r p-4">
        <Link href="/write">
          <Card className="h-16 bg-mooblue text-moowhite">글쓰기</Card>
        </Link>
        <Tab>전체글</Tab>
        <Tab>프론트엔드</Tab>
        <Tab>백엔드</Tab>
        <Tab>좋아하는 글</Tab>
      </nav>
      <section className=""></section>
      <aside>배너</aside>
    </main>
  );
};

export default Home;
