import Header from '@/components/server/Header';
import './globals.css';
import { Inter } from 'next/font/google';
import Footer from '@/components/server/Footer';

const inter = Inter({ subsets: ['latin'] });

export const metadata = {
  title: 'Codren Forum',
  description: 'Made by MooSaeng Park',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="h-screen">
      <body
        className={`flex-col items-center justify-center text-sm font-black ${inter.className}`}
      >
        {/* @ts-expect-error Async Server Component */}
        <Header />
        {children}
        <Footer />
      </body>
    </html>
  );
}
