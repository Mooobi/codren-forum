'use client';

import { signOut } from 'next-auth/react';

const Login = () => {
  return (
    <button
      onClick={() => {
        signOut();
      }}
      className="ml-4 flex h-8 w-24 items-center justify-center rounded-md bg-moored text-moowhite"
    >
      로그아웃
    </button>
  );
};

export default Login;
