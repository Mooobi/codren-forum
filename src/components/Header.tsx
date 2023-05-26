import Link from 'next/link';
import Image from 'next/image';
import tw from 'tailwind-styled-components';

const Header = () => {
  const Card = tw.div`
  ml-4 flex h-8 w-24 items-center justify-center rounded-md 
  
  `;

  return (
    <header className="border-b-solid p-r-2 flex items-center justify-between border-b p-2 px-4 font-black">
      <section className="flex items-center justify-between">
        <Link href="/">
          <Image
            src="/logo.png"
            alt="logo"
            width={64}
            height={64}
            className="rounded-md"
          />
        </Link>
        <Link href="/about">
          <Card className="border border-moogray text-mooblack">어바웃</Card>
        </Link>
      </section>
      <section className="">
        <Link href="/login">
          <Card className="bg-mooblue text-moowhite">로그인</Card>
        </Link>
        <div className="flex">
          <Link href="/mypage">
            <Card className="h-16 flex-col border border-moogray text-mooblack">
              내 정보
              <Image src="" alt="" width={30} height={30} />
            </Card>
          </Link>
          <div className="flex-col">
            <Link href="/">
              <Card className="bg-moored text-moowhite">로그아웃</Card>
            </Link>
            <Card className="bg-mooblue text-moowhite">후원하기</Card>
          </div>
        </div>
      </section>
    </header>
  );
};

export default Header;
