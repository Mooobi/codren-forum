'use client';

import { authOptions } from '@/pages/api/auth/[...nextauth]';
import { getServerSession } from 'next-auth';
import { signIn, signOut } from 'next-auth/react';
import tw from 'tailwind-styled-components';
import { connectDB } from '../../../util/database';

const Sign = ({ session }: any) => {
  const Button = tw.button`
  ml-4 flex h-8 w-24 items-center justify-center rounded-md text-moowhite
  `;

  return (
    <Button
      onClick={() => {
        !session ? signIn() : signOut();
      }}
      className={!session ? 'bg-mooblue' : 'bg-moored'}
    >
      {!session ? '로그인' : '로그아웃'}
    </Button>
  );
};

export default Sign;
