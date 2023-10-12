import { JWT } from 'next-auth/jwt';

declare module 'next-auth/jwt' {
  interface JWT {
    user?: {
      name?: string | undefined | null;
      email?: string | undefined | null;
    };
  }
}

declare module 'next-auth' {
  interface User {
    name: string;
    email: string;
    password: string;
  }
}
