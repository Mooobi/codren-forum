'use client';
import Button from '@/components/Button';
import styled from 'styled-components';

export default function Comment({ _id }: { _id: string | null }) {
  return (
    <Container>
      <CommentList></CommentList>
      <CommentInputSection method='POST' action={`/api/comment/create/${_id}`}>
        <CommentInput name='content' placeholder='댓글을 입력해 보세요' required />
        <Button type='submit' background='#7A5427' color='white'>
          등록
        </Button>
      </CommentInputSection>
    </Container>
  );
}

const Container = styled.section`
  display: flex;
  flex-direction: column;
  justify-content: start;
  align-items: center;
  gap: 1.5rem;
  width: 75%;
  background: #f8f8f8;
  padding: 2rem;
  border-radius: 0.5rem;
  height: 100%;
  margin-top: 2rem;
`;

const CommentList = styled.section``;

const CommentInputSection = styled.form`
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  align-items: end;
  background: white;
  width: 100%;
  border-radius: 0.5rem;
  padding: 1rem;
  gap: 1rem;
`;

const CommentInput = styled.textarea`
  padding: 1rem;
  flex: 1;
  border: none;
  background: #f8f8f8;
  min-height: 10rem;
  width: 100%;
  resize: none;
  font-family: -apple-system, BlinkMacSystemFont, Segoe UI, Helvetica, Arial, sans-serif,
    Apple Color Emoji, Segoe UI Emoji, Segoe UI;
`;
