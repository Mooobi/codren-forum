'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import Tab from '../UI/Tab';
import Card from '../UI/Card';

const LeftSide = (props: any) => {
  const path: any = usePathname();
  console.log(path);
  // const ID = props.params.id;
  return (
    <>
      {path === '/' && (
        <aside className="flex-col border-r p-4">
          <Link href="/write">
            <Card className="h-16 bg-mooblue text-moowhite">글쓰기</Card>
          </Link>
          <Tab>전체글</Tab>
          <Tab>프론트엔드</Tab>
          <Tab>백엔드</Tab>
          <Tab>좋아하는글</Tab>
        </aside>
      )}
      {(path === '/write' ||
        /^\/edit\/.+$/i.test(path) ||
        /^\/detail\/.+$/i.test(path)) && (
        <aside className="flex-col border-r p-4">
          <Link prefetch={false} href="/">
            <Card className="h-16 bg-moogray text-mooblack">목록 돌아가기</Card>
          </Link>
        </aside>
      )}
    </>
  );
};

export default LeftSide;
