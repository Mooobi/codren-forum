'use client';

import { ReactNode } from 'react';
import { PageWrapper } from './GlobalStyle';

export default function PageProvider({ children }: { children: ReactNode }) {
  return <PageWrapper>{children}</PageWrapper>;
}
