import { connectDB } from '@/util/database';
import NextAuth, { Session, User } from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import GithubProvider from 'next-auth/providers/github';
import bcrypt from 'bcrypt';
import { JWT } from 'next-auth/jwt';

export const authOptions = {
  providers: [
    GithubProvider({
      clientId: process.env.GITHUB_ID as string,
      clientSecret: process.env.GITHUB_SECRET as string,
    }),
    CredentialsProvider({
      // 로그인페이지 폼 자동생성
      name: 'credentials',
      credentials: {
        email: { label: 'email', type: 'text' },
        password: { label: 'password', type: 'password' },
      },

      // 로그인요청시 실행되는코드
      //직접 DB에서 아이디,비번 비교하고
      //아이디,비번 맞으면 return 결과, 틀리면 return null 해야함
      async authorize(credentials, req) {
        let db = (await connectDB).db('forum');
        let user = await db.collection<User>('user_cred').findOne({ email: credentials?.email });
        if (!user) {
          console.log('등록되지 않은 이메일입니다.');
          return null;
        }
        const pwcheck = await bcrypt.compare(credentials?.password as string, user.password);
        if (!pwcheck) {
          console.log('올바르지 않은 비밀번호입니다.');
          return null;
        }
        return user;
      },
    }),
  ],

  // jwt 설정 + jwt 만료일설정
  session: {
    jwt: true,
    maxAge: 30 * 24 * 60 * 60,
  },

  callbacks: {
    // jwt 만들 때 실행되는 코드
    // user 변수는 DB의 유저정보담겨있고 token.user에 유저정보 저장
    jwt: async ({ token, user }: { token: JWT; user: User }) => {
      if (user) {
        token.user = {};
        token.user.name = user.name;
        token.user.email = user.email;
      }
      return token;
    },
    // 유저 세션이 조회될 때 마다 실행되는 코드
    session: async ({ session, token }: { session: Session; token: JWT }) => {
      session.user = token.user;
      return session;
    },
  },

  secret: process.env.JWT_SECRET as string,
};
export default NextAuth(authOptions);
