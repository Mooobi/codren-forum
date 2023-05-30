import NextAuth from 'next-auth/next';
import KakaoProvider from 'next-auth/providers/kakao';

export const authOptions: any = {
  providers: [
    KakaoProvider({
      clientId: process.env.KAKAO_CLIENT_ID!,
      clientSecret: process.env.KAKAO_CLIENT_PASSWORD!,
    }),
  ],
  secret: '1234',
};

export default NextAuth(authOptions);
