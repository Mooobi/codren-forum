'use client';
// import type { Metadata } from 'next';
import { Inter } from 'next/font/google';

import Header from './components/Header';
import StyledComponentsRegistry from '../styles/registry';
import { GlobalStyle, PageWrapper } from '../styles/GlobalStyle';
import { NextAuthProvider } from './sessionProvider';
import styled from 'styled-components';

const inter = Inter({ subsets: ['latin'] });

// export const metadata: Metadata = {
//   title: 'Codren Forum',
//   description: 'community for junior developers',
// };

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang='en'>
      <body className={inter.className}>
        <NextAuthProvider>
          <StyledComponentsRegistry>
            <GlobalStyle />
            <Header />
            <PageWrapper>{children}</PageWrapper>
          </StyledComponentsRegistry>
        </NextAuthProvider>
      </body>
    </html>
  );
}
