'use client';

import tw from 'tailwind-styled-components';

const Tab = (props: any) => {
  const Card = tw.div`
  m-4 ml-4 p-2 flex h-12 w-24 items-center justify-center rounded-md border border-moogray text-mooblack
  `;
  return <Card>{props.children}</Card>;
};

export default Tab;
