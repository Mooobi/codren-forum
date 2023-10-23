'use client';
import Button from '@/components/Button';
import useModal from '@/hooks/useModal';
import { comment } from '@/types/type';
import { calculateTimeDifference } from '@/util/calculateTimeDifference';
import isUpdated from '@/util/isUpdated';
import axios from 'axios';
import { Session } from 'next-auth';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import styled from 'styled-components';

export default function Comment({
  _id,
  comments,
  session,
}: {
  _id: string | null;
  comments: comment[];
  session: Session | null;
}) {
  const router = useRouter();
  const [isEditing, setIsEditing] = useState('');
  const [deleteTarget, setDeleteTarget] = useState<comment | null>(null);
  const { Modal, openModal } = useModal();

  const handleDelete = async (comment: comment) => {
    if (comment.author === session?.user?.email) {
      const result = await axios.delete(`/api/comment/delete/${comment._id}`);
      if (result.status === 204) {
        router.refresh();
      }
    }
  };

  return (
    <Container>
      <CommentList>
        {comments.map((comment) => (
          <CommentListItem key={comment._id}>
            <Author>{comment.author}</Author>
            {isEditing !== comment._id ? (
              <>
                <div>{comment.content}</div>
                <Info>
                  {session?.user?.email === comment.author && (
                    <Edit>
                      <button onClick={() => setIsEditing(comment._id)}>수정</button>
                      <button
                        onClick={() => {
                          setDeleteTarget(comment);
                          openModal();
                        }}
                      >
                        삭제
                      </button>
                    </Edit>
                  )}
                  <div>
                    {isUpdated(comment.createdAt, comment.updatedAt) ? (
                      <div>{calculateTimeDifference(comment.updatedAt)} (수정됨)</div>
                    ) : (
                      <div>{calculateTimeDifference(comment.createdAt)}</div>
                    )}
                  </div>
                </Info>
              </>
            ) : (
              <EditForm method='POST' action={`/api/comment/edit/${comment._id}`}>
                <EditInput name='content' defaultValue={comment.content} required />
                <div>
                  <Button type='submit' background='#618856' color='white'>
                    수정
                  </Button>
                  <Button onClick={() => setIsEditing('')} background='#444444' color='white'>
                    취소
                  </Button>
                </div>
              </EditForm>
            )}
          </CommentListItem>
        ))}
      </CommentList>
      <CommentInputSection method='POST' action={`/api/comment/create/${_id}`}>
        <CommentInput name='content' placeholder='댓글을 입력해 보세요' required />
        <Button type='submit' background='#7A5427' color='white'>
          등록
        </Button>
      </CommentInputSection>
      <Modal
        message='정말 댓글을 삭제하시겠습니까?'
        buttonName='삭제'
        clickHandler={() => handleDelete(deleteTarget as comment)}
        background='#618856'
        color='white'
      />
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
  background: #eeeeee;
  padding: 2rem;
  height: 100%;
`;

const CommentList = styled.ul`
  display: flex;
  flex-direction: column;
  gap: 1rem;
  width: 100%;
`;

const CommentListItem = styled.li`
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  background: white;
  width: 100%;
  border-radius: 0.5rem;
  padding: 1rem;
  gap: 1rem;
`;

const Author = styled.section`
  font-weight: 600;
`;

const Info = styled.section`
  display: flex;
  justify-content: end;
  gap: 1.25rem;
  color: #777777;
`;

const Edit = styled.section`
  display: flex;
  gap: 0.25rem;
`;

const EditForm = styled.form`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: end;
  gap: 1rem;

  > div {
    display: flex;
    gap: 1rem;
  }
`;

const EditInput = styled.textarea`
  width: 100%;
  border: none;
  background: #f8f8f8;
  resize: none;
  font-family: -apple-system, BlinkMacSystemFont, Segoe UI, Helvetica, Arial, sans-serif,
    Apple Color Emoji, Segoe UI Emoji, Segoe UI;
  min-height: 5rem;
  padding: 0.5rem;
  border-radius: 0.25rem;
  font-size: 1rem;
`;

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
  font-size: 1rem;
  font-family: -apple-system, BlinkMacSystemFont, Segoe UI, Helvetica, Arial, sans-serif,
    Apple Color Emoji, Segoe UI Emoji, Segoe UI;
  border-radius: 0.25rem;
`;
