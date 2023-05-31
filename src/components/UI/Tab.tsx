'use client';

import tw from 'tailwind-styled-components';

const Tab = (props: any) => {
  const Tab = tw.div`
  m-4 ml-4 p-2 flex h-12 w-24 items-center justify-center rounded-md border border-moogray text-mooblack
  `;

  return <Tab>{props.children}</Tab>;
};

export default Tab;
