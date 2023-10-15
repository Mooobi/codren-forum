'use client';

import styled from 'styled-components';
import { CATEGORY_ALL } from '../../constants/constants';
import { Dispatch, SetStateAction } from 'react';

export default function Category({
  current,
  setCurrent,
}: {
  current: string;
  setCurrent: Dispatch<SetStateAction<string>>;
}) {
  const handleCategory = (category: string) => {
    setCurrent(category);
  };

  return (
    <Wrapper>
      {CATEGORY_ALL.map((category) => (
        <CategoryButton
          $isCurrent={current === category}
          key={category}
          onClick={() => handleCategory(category)}
          disabled={current === category}
        >
          {category}
        </CategoryButton>
      ))}
    </Wrapper>
  );
}

const Wrapper = styled.section`
  display: flex;
  justify-content: space-around;
  font-weight: 600;
`;

const CategoryButton = styled.button.attrs<{ $isCurrent: boolean }>((props) => ({
  style: {
    outline: props.$isCurrent ? '2px solid #7a5427' : 'none',
    outlineOffset: props.$isCurrent ? '-2px' : '0',
  },
}))`
  flex: 1;
  padding: 1rem;
  text-align: center;
  transition: background 0.3s;
  background: #eeeeee;

  &:hover {
    background: #dddddd;
  }

  &:active {
    background: #cccccc;
  }

  &:disabled {
    background: #eeeeee;
    cursor: default;
  }
`;
