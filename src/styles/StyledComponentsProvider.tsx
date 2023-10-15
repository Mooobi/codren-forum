'use client';

import { GlobalStyle } from '@/styles/GlobalStyle';
import { ReactNode } from 'react';

export default function StyledComponentsProvider({ children }: { children: ReactNode }) {
  return (
    <>
      <GlobalStyle />
      {children}
    </>
  );
}
