'use client';
import styled from 'styled-components';
import Button from '../../components/Button';
import { CATEGORY } from '../../constants/constants';

export default function Form() {
  return (
    <Container>
      <Wrapper method='POST' action='/api/post/create'>
        <InputSection>
          <h4>Title</h4>
          <input name='title' type='text' placeholder='글 제목을 입력해주세요' required />
        </InputSection>
        <InputSection>
          <h4>Category</h4>
          <CategorySection>
            {CATEGORY.map((category, idx) => (
              <label htmlFor={category} key={idx}>
                {category}
                <input name='category' value={category} type='radio' required />
              </label>
            ))}
          </CategorySection>
        </InputSection>
        <InputSection>
          <h4>Content</h4>
          <textarea name='content' placeholder='글 내용을 입력해주세요' required />
        </InputSection>
        <Button background='#7A5427' color='white' type='submit'>
          등록
        </Button>
      </Wrapper>
    </Container>
  );
}

const Container = styled.section`
  display: flex;
  flex-direction: column;
  justify-content: start;
  align-items: center;
  height: 100%;
  width: 75%;
  background: #f8f8f8;
  padding: 2rem;
  border-radius: 0.5rem;
`;

const Wrapper = styled.form`
  display: flex;
  flex-direction: column;
  justify-content: space-around;
  align-items: start;
  flex: 1;
  width: 75%;
  height: 100%;
`;

const InputSection = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1rem;
  width: 100%;

  > h4 {
    font-size: 1.25rem;
    font-weight: 600;
  }

  > input,
  textarea {
    font-size: 1rem;
    padding: 0.5rem;
    border: none;
    width: 100%;
    border-radius: 0.5rem;

    &::placeholder {
      color: #bbbbbb;
    }
  }

  > textarea {
    font-family: -apple-system, BlinkMacSystemFont, Segoe UI, Helvetica, Arial, sans-serif,
      Apple Color Emoji, Segoe UI Emoji, Segoe UI;
    height: 20rem;
    resize: none;
  }
`;

const CategorySection = styled.div`
  display: flex;
  align-items: center;
  gap: 1rem;
  background: white;
  padding: 0.5rem;
  border-radius: 0.5rem;

  > label {
    display: flex;
    align-items: center;
    gap: 0.25rem;

    > input {
      margin: 0;
    }
  }
`;
