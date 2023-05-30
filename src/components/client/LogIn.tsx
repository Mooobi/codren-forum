'use client';

import { signIn } from 'next-auth/react';

const Login = () => {
  return (
    <button
      onClick={() => {
        signIn();
      }}
      className="ml-4 flex h-8 w-24 items-center justify-center rounded-md bg-mooblue text-moowhite"
    >
      로그인
    </button>
  );
};

export default Login;
