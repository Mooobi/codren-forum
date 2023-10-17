'use client';
import styled from 'styled-components';
import Button from './Button';
import { CATEGORY } from '../constants/constants';
import { post } from '@/types/type';
import axios from 'axios';
import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function Form({ post }: { post?: post }) {
  const router = useRouter();
  const [editedData, setEditedData] = useState(post);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
    key: string,
  ) => {
    setEditedData((prevPost) => prevPost && { ...prevPost, [key]: e.target.value });
  };

  const handleEdit = async (e: React.MouseEvent) => {
    e.preventDefault();
    const result = await axios.patch('/api/post/edit', editedData);
    if (result.status === 200) {
      router.push(`/detail/${post?._id}`);
    }
  };

  return (
    <Container>
      <Wrapper method={post ? '' : 'POST'} action={post ? '' : '/api/post/create'}>
        <InputSection>
          <h4>Title</h4>
          <input
            name='title'
            type='text'
            placeholder='글 제목을 입력해주세요'
            required
            defaultValue={post?.title}
            onChange={(e) => post && handleChange(e, 'title')}
          />
        </InputSection>
        <InputSection>
          <h4>Category</h4>
          <CategorySection>
            {CATEGORY.map((category, idx) => (
              <label htmlFor={category} key={idx}>
                {category}
                <input
                  name='category'
                  value={category}
                  type='radio'
                  required
                  defaultChecked={post?.category === category}
                  onChange={(e) => post && handleChange(e, 'category')}
                />
              </label>
            ))}
          </CategorySection>
        </InputSection>
        <InputSection>
          <h4>Content</h4>
          <textarea
            name='content'
            placeholder='글 내용을 입력해주세요'
            required
            defaultValue={post?.content}
            onChange={(e) => post && handleChange(e, 'content')}
          />
        </InputSection>
        <Button
          background='#7A5427'
          color='white'
          type='submit'
          onClick={(e) => post && handleEdit(e)}
        >
          {post ? '수정' : '등록'}
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
