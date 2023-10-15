import styled from 'styled-components';
import Button from '../../components/Button';
import Link from 'next/link';

export default function SearchBar() {
  return (
    <Wrapper>
      <input type='search' placeholder='원하는 키워드를 검색해보세요' />
      <Button background='#618856' color='white'>
        검색
      </Button>
      <Link href='/write'>
        <Button background='#686B3A' color='white'>
          글 작성
        </Button>
      </Link>
    </Wrapper>
  );
}

const Wrapper = styled.section`
  display: flex;
  justify-content: space-around;
  font-weight: 600;
  background: #eeeeee;
  padding: 1rem;
  gap: 1rem;

  > input {
    flex: 8;
    border: none;
    border-radius: 0.25rem;
    padding-left: 0.5rem;
  }

  > button,
  a {
    flex: 1;
  }

  > a {
    display: flex;
    width: 100%;

    > button {
      flex: 1;
    }
  }
`;
