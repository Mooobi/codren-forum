import Link from 'next/link';
import Image from 'next/image';
import tw from 'tailwind-styled-components';
import Login from '../client/LogIn';
import Logout from '../client/LogOut';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/pages/api/auth/[...nextauth]';

const Header = async () => {
  const Card = tw.div`
  ml-4 flex h-8 w-24 items-center justify-center rounded-md 
  `;

  const session: any = await getServerSession(authOptions);
  // console.log(session);
  return (
    <header className="border-b-solid p-r-2 fixed top-0 flex w-full items-center justify-center border-b bg-white p-2 px-4">
      <div className="item flex w-[1440px] items-center justify-between px-48">
        <section className="flex items-center justify-between">
          <Link href="/">
            <Card className="h-16 w-48 bg-moogray text-2xl text-mooblack">
              CodrenForum
            </Card>
          </Link>
          <Link href="/about">
            <Card className="border border-moogray text-mooblack">어바웃</Card>
          </Link>
        </section>
        <section className="">
          <div className="flex">
            {session && (
              <Link href="/mypage">
                <Card className="flex h-16 border border-moogray py-2 text-mooblack">
                  {session.user.name}
                  {/* <img
                  src={session.user.image}
                  alt="profile"
                  className="ml-2 h-10 w-10 rounded-[50%] object-cover"
                /> */}
                  <Image
                    src={session.user.image}
                    alt="profile"
                    className="ml-2 h-10 w-10 rounded-[50%] object-cover"
                    width={40}
                    height={40}
                  />
                </Card>
              </Link>
            )}
            <div className="flex-col">
              {!session ? <Login /> : <Logout />}
              {session && (
                <Card className="bg-mooblue text-moowhite">후원하기</Card>
              )}
            </div>
          </div>
        </section>
      </div>
    </header>
  );
};

export default Header;
