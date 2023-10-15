import type { Metadata } from 'next';
import { Inter } from 'next/font/google';

import StyledComponentsRegistry from '../styles/registry';
import { NextAuthProvider } from '../util/sessionProvider';
import Header from '../components/Header';
import StyledComponentsProvider from '../styles/StyledComponentsProvider';
import PageProvider from '@/styles/PageProvider';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'Codren Forum',
  description: 'community for junior developers',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang='en'>
      <body className={inter.className}>
        <NextAuthProvider>
          <StyledComponentsRegistry>
            <StyledComponentsProvider>
              <Header />
              <PageProvider>{children}</PageProvider>
            </StyledComponentsProvider>
          </StyledComponentsRegistry>
        </NextAuthProvider>
      </body>
    </html>
  );
}
