'use client';

import tw from 'tailwind-styled-components';

const Tab = (props: any) => {
  const Card = tw.div`
  m-4 ml-4 flex h-16 w-24 flex-col items-center justify-center rounded-md border border-moogray text-mooblack
  `;
  return <Card>{props.children}</Card>;
};

export default Tab;
