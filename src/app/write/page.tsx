import Form from '@/components/client/Form';
import { authOptions } from '@/pages/api/auth/[...nextauth]';
import { getServerSession } from 'next-auth';
import Link from 'next/link';
import tw from 'tailwind-styled-components';

const Write = async () => {
  let session: any = await getServerSession(authOptions);

  if (!session) {
    return (
      <div className="mt-20 flex h-[85vh] items-center justify-center">
        로그인하세요
      </div>
    );
  } else if (!session.user.email) {
    return (
      <div className="mt-20 flex h-[85vh] items-center justify-center">
        글을 작성하려면 회원 정보에서 email을 입력해주세요
      </div>
    );
  }

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
          <Form />
        </section>
        <section className="flex w-32 items-center justify-center border-l border-moogray">
          배너
        </section>
      </div>
    </main>
  );
};

export default Write;
