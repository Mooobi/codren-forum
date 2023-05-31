import tw from 'tailwind-styled-components';

const Card = (props: any) => {
  const Card = tw.div`
  ml-4 flex h-8 w-24 items-center justify-center rounded-md 
  `;
  return <Card className={props.className}>{props.children}</Card>;
};

export default Card;
