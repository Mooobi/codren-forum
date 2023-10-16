'use client';
import { post } from '@/types/type';
import Link from 'next/link';
import styled from 'styled-components';
import { AiFillLike } from 'react-icons/ai';
import { calculateTimeDifference } from '@/util/calculateTimeDifference';
import Category from './Category';
import { useEffect, useState } from 'react';
import filterPosts from '@/util/filterList';
import SearchBar from './SearchBar';
import isUpdated from '@/util/isUpdated';
import { useRouter } from 'next/navigation';

export default function ListItems({ posts }: { posts: post[] }) {
  const [current, setCurrent] = useState('전체');
  const router = useRouter();
  const filteredPosts = filterPosts(posts, current);

  useEffect(() => {
    router.refresh();
  }, [router]);

  return (
    <Wrapper>
      <Category current={current} setCurrent={setCurrent} />
      <SearchBar />
      {filteredPosts?.map((post) => (
        <ListItem key={post._id.toString()}>
          <Link href={`/detail/${post._id.toString()}`} prefetch={false}>
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
              <AiFillLike />
              {post.likeCount}
            </Like>
          </Link>
        </ListItem>
      ))}
    </Wrapper>
  );
}

const Wrapper = styled.ul`
  display: flex;
  flex-direction: column;
  height: 100%;
  width: 75%;
  gap: 0.5rem;
  padding: 0.5rem;
`;

const ListItem = styled.li`
  > * {
    display: flex;
    justify-content: space-between;
    align-items: center;
    background: white;
    border-radius: 10px;
    padding: 20px;
    margin-bottom: 5px;
    box-shadow: rgb(224, 224, 224) 0px 0px 6px 0px;
    transition: 0.3s;

    &:hover {
      background: #f9f9f9;
    }

    &:active {
      background: #f3f3f3;
    }
  }
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
