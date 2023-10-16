'use client';
import { post } from '@/types/type';
import { calculateTimeDifference } from '@/util/calculateTimeDifference';
import isUpdated from '@/util/isUpdated';
import styled from 'styled-components';
import { AiFillLike } from 'react-icons/ai';
import { useEffect, useState } from 'react';
import { Session } from 'next-auth';
import axios from 'axios';
import Link from 'next/link';

export default function PostDetails({ post, session }: { post: post; session: Session | null }) {
  const [like, setLike] = useState(post.likeCount);
  const [didLike, setDidLike] = useState(false);

  useEffect(() => {
    if (session?.user?.email) {
      post.liker.includes(session?.user?.email) ? setDidLike(true) : setDidLike(false);
    }
  }, [post.liker, session?.user?.email]);

  const handleLikeCount = async () => {
    if (session?.user?.email) {
      if (didLike && post.likeCount !== 0) {
        const result = await axios.patch('/api/post/like', {
          ...post,
          likeCount: post.likeCount - 1,
          liker: post.liker.filter((user) => user !== session?.user?.email),
        });
        if (result.status === 200) {
          setLike((like) => like - 1);
          setDidLike(false);
        }
      } else {
        const result = await axios.patch('/api/post/like', {
          ...post,
          likeCount: post.likeCount + 1,
          liker: [...post.liker, session?.user?.email],
        });
        if (result.status === 200) {
          setLike((like) => like + 1);
          setDidLike(true);
        }
      }
    }
  };

  const handleDelete = () => {};

  return (
    <Container>
      <Wrapper>
        <TitleSection>
          <CategorySection>{post.category}</CategorySection>
          <MainSection>
            <Title>
              <div>{post.title}</div>
              <div>[{post.commentCount}]</div>
            </Title>
            <Info>
              <div>{post.author}</div>
              {isUpdated(post.createdAt, post.updatedAt) ? (
                <div>{calculateTimeDifference(post.updatedAt)} (수정됨)</div>
              ) : (
                <div>{calculateTimeDifference(post.createdAt)}</div>
              )}
            </Info>
          </MainSection>
          <Like>
            <button onClick={handleLikeCount}>
              <AiFillLike fill={didLike ? '#4771b8' : '#444444'} />
            </button>
            {like}
          </Like>
        </TitleSection>
        <ContentSection>
          <Content>{post.content}</Content>
          <EditSection>
            <Link href={`/edit/${post._id}`}>수정</Link>
            <button onClick={handleDelete}>삭제</button>
          </EditSection>
        </ContentSection>
      </Wrapper>
    </Container>
  );
}

const Container = styled.section`
  display: flex;
  flex-direction: column;
  justify-content: start;
  align-items: center;
  width: 75%;
  background: #f8f8f8;
  padding: 2rem;
  border-radius: 0.5rem;
`;

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: start;
  align-items: start;
  gap: 1.5rem;
  width: 100%;
  height: 100%;
`;

const TitleSection = styled.section`
  display: flex;
  justify-content: space-between;
  align-items: center;
  background: white;
  width: 100%;
  background: white;
  border-radius: 10px;
  padding: 20px;
  margin-bottom: 5px;
`;

const CategorySection = styled.div`
  border-right: 2px solid #777777;
  padding: 1rem 1rem 1rem 0;
  font-size: 1.125rem;
  font-weight: 600;
  color: #7a5427;
`;

const MainSection = styled.div`
  display: flex;
  flex-direction: column;
  align-items: start;
  flex: 1;
  gap: 0.5rem;
  padding: 0 1rem;
`;

const Title = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  > :first-child {
    font-size: 1.25rem;
  }
`;

const Info = styled.div`
  display: flex;
  gap: 0.5rem;

  > :nth-child(2) {
    color: #777777;
  }
`;

const Like = styled.div`
  display: flex;
  align-items: center;
  font-size: 1.5rem;
  gap: 0.5rem;
`;

const ContentSection = styled.section`
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  background: white;
  width: 100%;
  background: white;
  border-radius: 10px;
  padding: 20px;
  margin-bottom: 5px;
  min-height: 20rem;
  gap: 2rem;
`;

const Content = styled.div``;

const EditSection = styled.div`
  display: flex;
  justify-content: end;
  align-items: center;
  color: #777777;
  text-align: end;
  gap: 1rem;
`;