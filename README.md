# Codren Forum

<details>

<summary>

#### 2023. 10. 18.

</summary>

오늘은 디테일 페이지의 comment 부분을 만들어보겠습니다.

comment는 댓글을 입력하는 input 부분과 댓글목록을 보여주는 list 부분으로 나눌 수 있습니다.

먼저 input 부분을 만들어 보겠습니다.

```ts
<CommentInputSection method='POST' action={`/api/comment/create/${_id}`}>
  <CommentInput name='content' placeholder='댓글을 입력해 보세요' required />
  <Button type='submit' background='#7A5427' color='white'>
    등록
  </Button>
</CommentInputSection>
```

form 요소를 베이스로 한 styled-component를 만들어주고 내부에 input과 버튼으로 간단하게 구현하였습니다.

page 컴포넌트에서 props로 받아온 글의 `_id`를 쿼리스트링으로 하여 서버에 전달하고 서버측에서는 아래와 같이 추가적인 정보를 body에 넣어 db에 저장합니다.

```ts
export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'POST') {
    const db = (await connectDB).db('forum');

    const session = await getServerSession(req, res, authOptions);

    req.body = {
      ...req.body,
      author: session?.user?.email,
      parent: new ObjectId(req.query.id as string), // 댓글이 달린 게시물의 id 저장
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    await db.collection('comment').insertOne(req.body);

    res.redirect(302, `/detail/${req.query.id}`);
  }
}
```

다른 할 일이 있는 관계로 오늘은 여기까지 하겠습니다.

![](/assets/image/image-15.png)

</details>

<details>

<summary>

#### 2023. 10. 17.

</summary>

디테일 페이지의 수정, 삭제 기능을 마저 해보도록 하겠습니다.

아래와 같이 ContentSecion 아래에 EditSecion을 만들고 수정, 삭제 버튼을 추가해주었습니다.

```ts
<ContentSection>
  <Content>{post.content}</Content>
  {session?.user?.email === post.author && (
    <EditSection>
      <Link href={`/edit/${post._id}`}>수정</Link>
      <button onClick={handleDelete}>삭제</button>
    </EditSection>
  )}
</ContentSection>
```

수정 버튼 클릭 시 수정 페이지로 연결되고, 버튼 클릭 시에는 삭제 확인 모달을 보여주고 모달 내의 삭제버튼 클릭 시 삭제되도록 구현해보겠습니다.

page 컴포넌트에서 아래와 같이 접근 조건을 설정해줍니다.

```ts
export default async function Edit({ params }: { params: ObjectId }) {
  // params의 id로 글 정보 받아오기
  const db = (await connectDB).db('forum');
  const post = await db.collection('post').findOne<post | null>({ _id: new ObjectId(params.id) });
  const session = await getServerSession();

  if (session?.user?.email !== post?.author) {
    // 현재 유저 정보 받아서 글 정보의 글쓴이와 다르면 디테일 페이지로 리다이렉트
    redirect(`/detail/${params.id}`);
  }

  return <></>; // 같으면 글 정보 채워진 화면 보여주기
}
```

내부는 write 페이지에서 사용한 Form 컴포넌트를 재사용할 수 있도록 수정해서 사용하도록 하겠습니다.

아래와 같이 Form 컴포넌트에 post가 props로 선택적으로 들어올 수 있게 만들고

```ts
export default function Form({ post }: { post?: post }) {
```

각 input에 defaultValue를 설정하여 post가 있다면 defaultValue 값으로 들어오도록 만들어주었습니다.

```ts
<input
  ...
  defaultValue={post?.title}
/>
<input
  ...
  defaultChecked={post?.category === category}
/>
<textarea
  ...
  defaultValue={post?.content}
/>
```

그리고 post 여부에 따라 버튼의 text를 등록, 수정으로 나타나게 만들고 form 요소의 method와 endpoint가 변경되게 만들어 주었습니다.

```ts
<Wrapper //form
  method={post ? 'PATCH' : 'POST'}
  action={post ? 'api/post/edit' : '/api/post/create'}
>
...
<Button background='#7A5427' color='white' type='submit'>
  {post ? '수정' : '등록'}
</Button>
```

이제 서버쪽 핸들러를 아래와 같이 간단하게 설정해놓고

```ts
import { NextApiRequest, NextApiResponse } from 'next';

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'PATCH') {
    console.log(req.body);
  }
}
```

수정 버튼을 클릭해보니 에러가 발생하였습니다.

![](/assets/image/image-13.png)

GET 요청이 실패했다고 뜹니다. form 요소는 기본적으로 method에서 GET, POST 두가지만 지원을하는데 깜빡했습니다.

PATCH 요청은 onClick으로 작동하도록 만들어보겠습니다.

버튼에서 post가 있을 경우에만 이벤트 핸들러 함수가 실행되도록 만들어놓습니다.

```ts
<Button background='#7A5427' color='white' type='submit' onClick={(e) => post && handleEdit(e)}>
  {post ? '수정' : '등록'}
</Button>
```

form 요소의 기본 작동으로 전송할 때는 데이터를 따로 상태로 만들 필요가 없었지만 onClick 이벤트로 전송하려면 onChange 이벤트를 사용하여 상태로 저장하고 변경된 수정 버튼 클릭 시에 해당 상태를 서버로 전송하도록 만들어야합니다.

따라서 아래와 같이 editedData를 상태로 만들고 handleChange 함수를 만들어 해당 input의 데이터가 변경될 때마다 상태를 변경해주겠습니다.

```ts
const [editedData, setEditedData] = useState(post);

const handleChange = (
  e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  key: string,
) => {
  setEditedData((prevPost) => prevPost && { ...prevPost, [key]: e.target.value });
};
...
<input
  ...
  defaultValue={post?.title}
  onChange={(e) => post && handleChange(e, 'title')}
/>
<input
  ...
  defaultChecked={post?.category}
  onChange={(e) => post && handleChange(e, 'category')}
/>
<input
  ...
  defaultValue={post?.content}
  onChange={(e) => post && handleChange(e, 'content')}
/>
```

그리고 수정 버튼 클릭 시 작동하는 handleEdit 함수를 아래와 같이 만들어 주었습니다.

```ts
const router = useRouter();
const handleEdit = async (e: React.MouseEvent) => {
  e.preventDefault();
  const result = await axios.patch('/api/post/edit', editedData);
  if (result.status === 200) {
    router.replace(`/detail/${post?._id}`);
  }
};
```

next.js의 `useRouter()` 를 사용하여 detail 페이지로 이동해줍니다. 그리고 지난번 좋아요 기능이 list 페이지에서 업데이트 되게 만들었던 것과 같이 detail 페이지에서도 수정된 내용이 업데이트 되도록 아래와 같이 refresh를 사용해줍니다.

```ts
const router = useRouter();

useEffect(() => {
  router.refresh();
}, [router]);
```

서버측 핸들러에서는 아래와 같이 작동하도록 하였습니다.

```ts
export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'PATCH') {
    const db = (await connectDB).db('forum');

    req.body.updatedAt = new Date(); // 업데이트 날짜 수정

    const _id = req.body._id;

    delete req.body._id;

    await db.collection('post').updateOne({ _id: new ObjectId(_id) }, { $set: req.body });

    res.status(200).json('success');
  }
}
```

이제 수정 작업은 마쳤습니다. 다음으로 삭제인데, 먼저 삭제 버튼 클릭 시에 띄워줄 모달을 하나 만들어 보겠습니다.

먼저 useModal 훅을 만들어 모달 관련 기능을 넣어주겠습니다.

```ts
import { ReactNode, useState } from 'react';

export default function useModal() {
  const [isModalOpen, setIsModalOpen] = useState(false); // 모달 열림 여부

  const openModal = () => {
    // 모달 열기
    setIsModalOpen(true);
  };

  const closeModal = () => {
    // 모달 닫기
    setIsModalOpen(false);
  };

  const Modal = ({
    message,
    buttonName,
    children,
    clickHandler,
  }: {
    message: string;
    buttonName: string;
    clickHandler: () => void;
    children?: ReactNode;
  }) => {
    if (!isModalOpen) {
      return null;
    }
    return (
      <Backdrop onClick={closeModal}>
        <ModalBox>
          <Message>{message}</Message>
          {children}
          <Button onClick={clickHandler}>{buttonName}</Button>
          <Button onClick={closeModal}>취소</Button>
        </ModalBox>
      </Backdrop>
    );
  };

  return { isModalOpen, openModal, closeModal, Modal };
}
```

useModal에서 반환하는 Modal 컴포넌트는 추후 다른 곳에서도 사용할 수 있도록 message, butttonName, clickHandler 등의 속성을 받도록 해주었습니다.

그리고 PostDetails에서 호출하여 사용해주었습니다.

```ts
const { Modal, openModal } = useModal();
...
return (
  ...
  <Modal
    message='정말 글을 삭제하시겠습니까?'
    buttonName='삭제'
    clickHandler={handleDelete}
    background='#618856'
    color='white'
  />
)
```

모달에서 삭제 버튼을 클릭 시에 실행되는 handleDelete는 아래와 같이 쿼리 스트링을 설정해서 서버에서 요청을 보냅니다.

```ts
const handleDelete = async (id: string) => {
  if (post.author === session?.user?.email) {
    const result = await axios.delete(`/api/post/delete/${id}`);
    if (result.status === 204) {
      router.replace('/list');
    }
  }
};
```

서버측에서는 아래와 같이 폴더구조를 만들고

![](/assets/image/image-14.png)

```ts
import { connectDB } from '@/util/database';
import { ObjectId } from 'mongodb';
import { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'DELETE') {
    const db = (await connectDB).db('forum');

    await db.collection('post').deleteOne({ _id: new ObjectId(req.query.id as string) });

    res.status(204).end();
  }
}
```

위와 같이 삭제를 하고 204를 응답 코드로 설정하고 응답 본문을 끝내는 end() 메서드를 붙여주었습니다.

이제 정상적으로 삭제가 된 뒤 list 페이지로 리다이렉트 되는 것이 확인되었습니다.

내일은 댓글 CRUD를 되는데까지 해보도록 하겠습니다.

</details>

<details>

<summary>

#### 2023. 10. 16.

</summary>

오늘은 디테일 페이지를 만들어 보겠습니다.

크게 PostDetails 컴포넌트와 Comment 컴포넌트로 구분하여 페이지를 구성하겠습니다.

```ts
import { connectDB } from '@/util/database';
import { ObjectId } from 'mongodb';
import PostDetails from './PostDetails';
import { post } from '@/types/type';
import Comment from './Comment';

export default async function Detail({ params }: { params: ObjectId }) {
  const db = (await connectDB).db('forum');
  const post = await db.collection('post').findOne<post | null>({ _id: new ObjectId(params.id) });

  return (
    <>
      {post && (
        <>
          <PostDetails post={{ ...post, _id: post._id.toString() }} />
          <Comment _id={post._id.toString()} />
        </>
      )}
    </>
  );
}
```

페이지 컴포넌트에서는 next.js의 동적 라우팅을 사용해서

![](/assets/image/image-11.png)

위와 같은 폴더 구조로 생성하였습니다. 이렇게 되면 페이지 컴포넌트에 props로 아래와 같은 정보들이 들어오는데

```ts
{ params: { id: '652a47ab3119847be9e5c07d' }, searchParams: {} }
```

그 중에 `params`를 이용해서 현재 글의 id를 추출했습니다.

PostDetails 컴포넌트에서 해당 글의 상세 내용을 아래와 같이 화면에 렌더링하도록 만들어주었습니다.

![](/assets/image/image-12.png)

여기서 상단 제목의 like 아이콘 클릭 시 좋아요 기능을 추가하고, 내가 쓴 글일 경우에 수정, 삭제 버튼을 보이도록 해주겠습니다.

먼저 detail 페이지에서 좋아요 버튼을 눌렀을 떄 실시간으로 좋아요 숫자가 바뀌어야 합니다. 따라서 상태를 만들어 화면에는 상태를 보여주도록 하고,

아이콘 클릭 시에 좋아요 상태 변경과 서버로 patch 요청을 동시에 보내도록 만들어 보겠습니다.

```ts
const [like, setLike] = useState(post.likeCount); // 좋아요 상태
const [didLike, setDidLike] = useState(false); // 현재 로그인한 유저가 해당 글을 좋아요 했는지 여부

useEffect(() => {
  // 화면이 마운트 되면 글 데이터의 liker에 현재 유저의 email이 포함되었는지 여부에 따라 didLike 상태 변경
  if (session?.user?.email) {
    post.liker.includes(session?.user?.email) ? setDidLike(true) : setDidLike(false);
  }
}, [post.liker, session?.user?.email]);

const handleLikeCount = async () => {
  // 좋아요 버튼 클릭했을 때
  if (session?.user?.email) {
    if (didLike) {
      // 이미 좋아요한 글이라면
      const result = await axios.patch('/api/post/like', {
        // 글 db에 좋아요 숫자 감소, liker 배열에서 해당 유저 제거하여 patch 요청
        ...post,
        likeCount: post.likeCount - 1,
        liker: post.liker.filter((user) => user !== session?.user?.email),
      });
      if (result.status === 200) {
        // 제대로 응답이 왔을 경우
        setLike((like) => like - 1); // 화면에 좋아요 숫자 변경
        setDidLike(false); // didLike 상태 변경으로 좋아요 아이콘 색 변경
      }
    } else {
      // 위와 반대의 경우
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
```

위와 같이 설정하면 이제 아이콘을 눌렀을 때 좋아요 숫자가 증가하게 됩니다.

그런데 문제가 생겼습니다. list 페이지에서도 해당 글의 좋아요 숫자를 보여주는데 여기서는 받아온 데이터를 그대로 보여주기 때문에 새로고침을 해야만 업데이트가 됩니다.

따라서 list 페이지가 마운트될 때 listItem 컴포넌트 부분을 새로고침할 수 있도록 listItem 컴포넌트에 useRouter의 .refresh()를 사용해주도록 하겠습니다.

```ts
const router = useRouter();

useEffect(() => {
  router.refresh();
}, [router]);
```

이제 list 페이지에서도 변경된 좋아요 숫자가 적용되었습니다.

눈알이 빠질 것 같아서 수정, 삭제는 내일 하도록 하겠습니다.

</details>

<details>

<summary>

#### 2023. 10. 15.

</summary>

오늘은 글작성 페이지를 만들어 보겠습니다.

그 전에 글 작성을 버튼을 만들어야 합니다. 글 작성 버턴은 list 페이지에 검색 바 컴포넌트를 만들고 그 안에 함께 넣어 주겠습니다.

```ts
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
```

SearchBar 컴포넌트를 만들어서 listItem 컴포넌트 하위에 넣어주고 위와 같이 구성해주었습니다.

원래라면 list 페이지 컴포넌트 하단에 바로 넣어주어야하지만 페이지 컴포넌트는 async 함수로 만들어서 db에서 글 데이터를 받아와야 하기 때문에 서버 컴포넌트로 만들었고 styled-components를 사용할 수 없기 때문에 사실상 listItem 컴포넌트 아래에 넣게 되었습니다.

그리고 write 페이지 컴포넌트는 아래와 같이 구성했습니다.

```ts
'use client';
import { useSession } from 'next-auth/react';
import Form from './Form';
import { useRouter } from 'next/navigation';

export default function Write() {
  const { data: session } = useSession();
  const router = useRouter();

  if (!session) {
    router.push('/list');
  }

  return <Form />;
}
```

클라이언트 컴포넌트로 만들어 useSession으로 현재 로그인한 유저 정보를 가져오고 로그인 정보가 없다면 list 페이지로 리다이렉트 시켜주었습니다.

Form 컴포넌트는 signUp 컴포넌트에서 사용한 Form 컴포넌트와는 구성하는 HTML 요소도 다르고 로직도 조금 다르기 때문에 별도로 만들었습니다.

여기까지 진행하고 난 뒤에 write 페이지를 확인하니 새로고침할 때마다 list 페이지로 리다이렉트 되었습니다. 문제는 useSession이 렌더링이 되고 난 후 실행되어
session을 받아오기 전에 리다이렉트가 되어버린다는 것이였습니다. header 컴포넌트에서도 마찬가지로 새로고침 직후에는 signIn 버튼이 표시되고 session을 받아오고 난 뒤에 signOut 버튼으로 바뀌는 것을 확인했습니다. 이러한 렌더링 방식은 ux적으로 좋지 않기 때문에 session을 서버에서 미리 받아오게끔 설정할 필요가 있습니다.

먼저, 기본적으로는 서버 컴포넌트에서 미리 작업을 한 후 클라이언트 컴포넌트로 넘겨주어야 하기 때문에 레이아웃부터 server 컴포넌트로 다시 고치도록 하겠습니다.

```ts
'use client';
import { Inter } from 'next/font/google';

import Header from './components/Header';
import StyledComponentsRegistry from '../styles/registry';
import { GlobalStyle, PageWrapper } from '../styles/GlobalStyle';
import { NextAuthProvider } from './sessionProvider';
import styled from 'styled-components';

const inter = Inter({ subsets: ['latin'] });

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang='en'>
      <body className={inter.className}>
        <NextAuthProvider>
          <StyledComponentsRegistry>
            <GlobalStyle />
            <Header />
            <PageWrapper>{children}</PageWrapper>
          </StyledComponentsRegistry>
        </NextAuthProvider>
      </body>
    </html>
  );
}
```

레이아웃은 위와 같이 구성되어 있습니다. 자식요소들을 하나씩 없애면서 확인해보니 `GlobalStyle`과 `PageWrapper`가 서버 컴포넌트에서 사용할 수 없는 에러를 발생시키고 있었습니다.(이전의 styled-components를 서버 컴포넌트에서는 사용할 수 없는 이슈)

공식문서에서는 이럴 경우 해당 요소를 클라이언트 컴포넌트로 새로 감싼 후 적용하라고 되어있습니다.

따라서 GlobalStyle을 아래와 같이 `StyledComponentProvider`로 감싸주고 원래의 자리에 배치하였습니다.

```ts
'use client';

import { GlobalStyle } from '@/styles/GlobalStyle';
import { ReactNode } from 'react';

export default function StyledComponentsProvider({ children }: { children: ReactNode }) {
  return (
    <>
      <GlobalStyle />
      {children}
    </>
  );
}
```

또한 PageWrapper도 아래와 같이 `PageProvider`로 감싸주었습니다.

```ts
'use client';

import { ReactNode } from 'react';
import { PageWrapper } from './GlobalStyle';

export default function PageProvider({ children }: { children: ReactNode }) {
  return <PageWrapper>{children}</PageWrapper>;
}
```

이제 위 provider 들을 원래의 자리에 넣어주면 아래와 같이 레이아웃이 서버컴포넌트가 됩니다.

```ts
export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang='en'>
      <body className={inter.className}>
        <NextAuthProvider>
          <StyledComponentsRegistry>
            <StyledComponentsProvider>
              <Header />
              <PageProvider>{children}</PageProvider>
            </StyledComponentsProvider>
          </StyledComponentsRegistry>
        </NextAuthProvider>
      </body>
    </html>
  );
}
```

위와 같이 구현하고 나니 새로운 에러가 발생했습니다.

![](/assets/image/image-9.png)

첫 화면 로딩 시에 SSR로 렌더링 되고 이후 CSR로 렌더링 되면서 className이 달라져 발생하는 에러라고 합니다.

이를 해결해주기 위해 `next.config.js` 파일에 아래와 같이 컴파일러 설정을 해주면 해결됩니다.

```ts
/** @type {import('next').NextConfig} */
const nextConfig = {
  compiler: {
    styledComponents: true,
  },
};

module.exports = nextConfig;
```

이제 리렌더링이 되어도 에러가 발생하지 않습니다. 그러면 마저 문제를 해결하기 위해 Header 컴포넌트를 수정해주겠습니다.

기존의 Header 컴포넌트는 클라이언트 컴포넌트로 설정되어있기 때문에 서버 컴포넌트로 바꿔주고 `getServerSession`을 사용해서 유저 정보를 받아오겠습니다.

```ts
import { getServerSession } from 'next-auth';
import InnerHeader from './InnerHeader';

export default async function Header() {
  const session = await getServerSession();

  return <InnerHeader session={session} />;
}
```

그리고 InnerHeader 컴포넌트를 생성하고 Header 컴포넌트 아래애 넣어주고 styled-components가 적용되는 부분을 전부 옮겨주었습니다.

```ts
'use client';
import Link from 'next/link';
import styled from 'styled-components';
import SignButton from './SignButton';
import Button from './Button';
import { Session } from 'next-auth';

export default function InnerHeader({ session }: { session: Session | null }) {
  return (
    <Wrapper>
      <Container>
        <Link href='/list'>CodrenForum</Link>
      </Container>
      <Container>
        <Link href='/about'>About</Link>
        {session ? (
          <Link href='/mypage'>MyPage</Link>
        ) : (
          <Link href='/signup'>
            <Button background='#686B3A' color='white'>
              SignUp
            </Button>
          </Link>
        )}
        <SignButton session={session} />
      </Container>
    </Wrapper>
  );
}

const Wrapper = styled.header`
  ...
`;

const Container = styled.section`
  ...
`;
```

자 이제 로그인을 해보면! 터미널에 아래와 같은 에러가 발생하면서 로그인이 되지 않습니다.. 왜..? 잘 되다가 서버 컴포넌트로 바꾸니까..? 안되는지 모르겠지만

![](/assets/image/image-10.png)

해당 에러에서 안내한 페이지로 가니 개발환경에서는 `.env` 파일에 아래와 같이 `NEXTAUTH_URL`과 `NEXAUTH_SECRET`을 설정해주어야 한다고 합니다.

```ts
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=1234
```

설정하고 나니!! 로그인이 잘 됩니다. 그리고 `getServerSession`으로 유저 정보도 잘 받아와집니다. 또한, 로그인한 상태에서 새로고침을 해도 SignIn 버튼이 나타나지 않습니다!

울고 싶었는데 드디어 성공했습니다..!!

이제 글 작성 페이지에서도 마찬가지로 `getServerSession`을 적용하고 새로고침해보겠습니다.

```ts
import { getServerSession } from 'next-auth';
import Form from './Form';
import { redirect } from 'next/navigation';

export default function Write() {
  const session = getServerSession();

  if (!session) {
    redirect('/list');
  }

  return <Form />;
}
```

리다이렉트 되지 않고 페이지가 그대로 잘 유지 됩니다!

감격스럽네요.

write 페이지는 이제 제대로 완성 되었으니 submit 버튼 클릭 시에 서버에서 해줄 일만 추가해주면 되겠습니다.

`pages/api/post/create.tsx`파일을 생성해주고 아래와 같이 코드를 작성해주었습니다.

```ts
import { connectDB } from '@/util/database';
import { NextApiRequest, NextApiResponse } from 'next';
import { getServerSession } from 'next-auth';
import { authOptions } from '../auth/[...nextauth]';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'POST') {
    const db = (await connectDB).db('forum');

    const session = await getServerSession(req, res, authOptions);

    req.body = {
      ...req.body,
      createdAt: new Date(),
      updatedAt: new Date(),
      author: session?.user?.email,
      commentCount: 0,
      likeCount: 0,
    };

    const result = await db.collection('post').insertOne(req.body);

    res.redirect(302, `/detail/${result.insertedId}`);
  }
}
```

post 타입을 미리 지정해주었기 때문에 추가 정보를 넣는건 쉽습니다.

```ts
export type post = {
  _id: string;
  category: string;
  title: string;
  content: string;
  createdAt: Date;
  updatedAt: Date;
  author: string;
  commentCount: number;
  likeCount: number;
};
```

아직 detail 페이지를 만들지 않았지만 패스 파라미터로 응답으로 온 `_id`를 붙여줄 것이기 때문에 미리 리다이렉트 시켜주었습니다.

이제 글 등록 버튼을 눌러보니! 해당 url로 리다이렉트 되었습니다. (물론 현재는 404 not found가 나옵니다.)

그리고 list 페이지로 이동하여 새로운 글이 나타난 것을 확인하였습니다.

내일은 detail 페이지를 작업해보겠습니다.

</details>

<details>

<summary>

#### 2023. 10. 14.

</summary>

오늘은 list 페이지를 구현해보았습니다.

먼저 listItem 컴포넌트에서 모든 글들을 불러와서 렌더링했습니다.

```ts
{
  filteredPosts?.map((post) => (
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
  ));
}
```

그리고 list 페이지 컴포넌트에서 db의 데이터를 받아와 listItem 컴포넌트로 넘겨주었습니다.
listItem 컴포넌트는 클라이언트 컴포넌트이기 때문에 현재 `async function`을 사용할 수 없습니다.
따라서 페이지 컴포넌트를 서버 컴포넌트로 두고 클라이언트 컴포넌트에 props로 내려주는 방식을 사용했습니다.

```ts
import { connectDB } from '@/util/database';
import ListItems from './ListItems';
import { post } from '@/types/type';

export const dynamic = 'force-dynamic';

export default async function List() {
  const db = (await connectDB).db('forum');
  let posts = await db.collection<post>('post').find().toArray();

  let parsedPosts = posts.map((post) => ({ ...post, _id: post._id.toString() }));

  return <ListItems posts={parsedPosts} />;
}
```

또한, list 페이지는 서버 컴포넌트임에도 실시간으로 변경되어야 하기 때문에 dynamic option을 `force-dynamic`으로 설정하여 항상 동적으로 동작하게끔 해주었습니다.

카테고리에 따른 필터링도 구현했는데, 현재는 모든 글 데이터를 서버에서 받고, 프론트에서 카테고리에 따른 필터링 작업을 해주고 있습니다.

```ts
import { post } from '@/types/type';

export default function filterPosts(posts: post[], category: string) {
  if (category === '전체') return posts;
  return posts.filter((post) => post.category === category);
}
```

하지만 서버에서 해당 로직을 적용하고 애초에 db에서 필터링된 글만 받아오는게 서버의 역할에도 맞고, 성능면에서 더 유리하므로 추후에
글 데이터를 서버에 요청 시에 카테고리에 따라 쿼리스트링을 다르게 설정해서 필터링된 데이터를 받는 것으로 변경할 예정입니다.

Category 컴포넌트는 아래와 같이 구현하였습니다.

```ts
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
      {CATEGORY.map((category) => (
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
```

`CATEGORY`를 constants 파일에서 설정하고 해당 카테고리를 map 메서드를 사용하여 구현했고, 해당 카테고리를 클릭 시에 상태로 만들어놓은 `category`를 변경하여 listItem 컴포넌트에서 필터링도 동시에 되도록 하였습니다.

```ts
export const CATEGORY = ['전체', '개발질문', '채용정보', '프로젝트', '수다광장'];
```

</details>

<details>

<summary>

#### 2023. 10. 12.

</summary>

오늘은 기존의 컴포넌트들을 옮겨오면서 리팩토링해보겠습니다.

#### Header

```ts
const Header = async () => {
  const session: any = await getServerSession(authOptions);
  // console.log(session);

  return (
    <header>
      <div>
        <section>
          <Link href='/'>
            <Card>CodrenForum</Card>
          </Link>
          <Link href='/about'>
            <Card>어바웃</Card>
          </Link>
        </section>
        <section>
          <div>
            {session && (
              <Link href='/mypage'>
                <Card>
                  {session.user.name}
                  <Image src={session.user.image} alt='profile' width={40} height={40} />
                </Card>
              </Link>
            )}
            <div>
              <Sign session={session} />
              {session && <Card>후원하기</Card>}
            </div>
          </div>
        </section>
      </div>
    </header>
  );
};
```

기존의 Header 컴포넌트입니다. JSX 부분이 불필요하게 길어 보입니다.

아래는 새로 만든 Header 컴포넌트입니다.

```ts
export default function Header() {
  const { data: session } = useSession();

  return (
    <Wrapper>
      <Container>
        <Link href='/'>CodrenForum</Link>
      </Container>
      <Container>
        <Link href='/about'>About</Link>
        {session ? (
          <Link href='/mypage'>MyPage</Link>
        ) : (
          <Link href='/signup'>
            <Button background='#686B3A' color='white'>
              SignUp
            </Button>
          </Link>
        )}
        <SignButton session={session} />
      </Container>
    </Wrapper>
  );
}

... // styled component 부분
```

일단 한눈에 보기에도 코드 가독성이 좋아졌습니다. 재사용가능한 Button 컴포넌트를 만들어 배경색과 글자색을 props로 받을 수 있도록 하였고 기존에는 서버컴포넌트였기에 현재 유저 정보를 `getServerSession()` 으로 받아왔지만 현재는 클라이언트 컴포넌트라서 `useSession()`으로 받아왔습니다.`useSession()`을 사용하려면 `SessionProvider`로 감싸주어야 합니다.

자세한 설명은 아래 공식 문서를 참고하면 되겠습니다.

https://next-auth.js.org/getting-started/client#usesession

#### Button

저는 버튼 컴포넌트를 아래와 같이 만들었습니다.

```ts
import styled from 'styled-components';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  background?: string;
  color?: string;
}

export default function Button(props: ButtonProps) {
  return <SC_Button {...props}>{props.children}</SC_Button>;
}

const SC_Button = styled.button<ButtonProps>`
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 0.5rem;
  border-radius: 0.25rem;
  min-width: 4rem;
  background: ${(props) => props.background};
  color: ${(props) => props.color};
`;
```

그런데 화면에 아래의 경고 메시지가 나타났습니다.

![](/assets/image/image-7.png)

저 background 속성이 실제 DOM 트리에 속성으로 전달되는데 실제로 저 속성이 존재하지 않기 때문에 인식을 못합니다. 따라서 이를 방지해주기 위해 `shouldForwardProp`을 사용해주어 해당 경고를 해결했습니다.

```ts
const SC_Button = styled.button.withConfig({
  shouldForwardProp: (prop) => prop !== 'background',
})<ButtonProps>`
  ...
`;
```

#### SignIn & SignOut

Next-auth를 사용하여 로그인을 구현했었기 때문에 아래와 같이 설정했습니다.

먼저 `src/pages/api/auth/[...nextauth].tsx` 파일을 만들어주고 github Oauth 로그인과 일반 credential 로그인 설정을 해주었습니다.

```ts
import { connectDB } from '@/util/database';
import NextAuth, { Session, User } from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import GithubProvider from 'next-auth/providers/github';
import bcrypt from 'bcrypt';
import { JWT } from 'next-auth/jwt';

export const authOptions = {
  providers: [
    GithubProvider({
      clientId: process.env.GITHUB_ID as string,
      clientSecret: process.env.GITHUB_SECRET as string,
    }),
    CredentialsProvider({
      // 로그인페이지 폼 자동생성
      name: 'credentials',
      credentials: {
        email: { label: 'email', type: 'text' },
        password: { label: 'password', type: 'password' },
      },

      // 로그인요청시 실행되는코드
      //직접 DB에서 아이디,비번 비교하고
      //아이디,비번 맞으면 return 결과, 틀리면 return null 해야함
      async authorize(credentials, req) {
        let db = (await connectDB).db('forum');
        let user = await db.collection<User>('user_cred').findOne({ email: credentials?.email });
        if (!user) {
          console.log('등록되지 않은 이메일입니다.');
          return null;
        }
        const pwcheck = await bcrypt.compare(credentials?.password as string, user.password);
        if (!pwcheck) {
          console.log('올바르지 않은 비밀번호입니다.');
          return null;
        }
        return user;
      },
    }),
  ],

  // jwt 설정 + jwt 만료일설정
  session: {
    jwt: true,
    maxAge: 30 * 24 * 60 * 60,
  },

  callbacks: {
    // jwt 만들 때 실행되는 코드
    // user 변수는 DB의 유저정보담겨있고 token.user에 유저정보 저장
    jwt: async ({ token, user }: { token: JWT; user: User }) => {
      if (user) {
        token.user = {};
        token.user.name = user.name;
        token.user.email = user.email;
      }
      return token;
    },
    // 유저 세션이 조회될 때 마다 실행되는 코드
    session: async ({ session, token }: { session: Session; token: JWT }) => {
      session.user = token.user;
      return session;
    },
  },

  secret: process.env.JWT_SECRET as string,
};
export default NextAuth(authOptions);
```

그리고 `src/util/database.tsx`파일을 만들고 mongodb와 연결해주는 설정을 해주었습니다.

```ts
import { MongoClient } from 'mongodb';

const url = process.env.DB_URL as string;

let connectDB: Promise<MongoClient>;

declare global {
  namespace globalThis {
    var _mongo: Promise<MongoClient>;
  }
}

if (process.env.NODE_ENV === 'development') {
  if (!globalThis._mongo) {
    globalThis._mongo = new MongoClient(url).connect();
  }
  connectDB = globalThis._mongo;
} else {
  connectDB = new MongoClient(url).connect();
}

export { connectDB };
```

이제 SignButton 컴포넌트를 만들어주고 아래와 같이 현재 로그인된 유저 정보의 존재 여부에 따라 signin 버튼과 signout 버튼이 보여지게 만들었습니다.

```ts
import { Session } from 'next-auth';
import { signIn, signOut } from 'next-auth/react';
import Button from './Button';

export default function SignButton({ session }: { session: Session | null }) {
  return (
    <Button
      background='#618856'
      color='white'
      onClick={() => {
        session ? signOut() : signIn();
      }}
    >
      {session ? 'SignOut' : 'SignIn'}
    </Button>
  );
}
```

위 코드에서 signIn() 함수는 auth 설정에 따른 로그인 페이지를 만들어주는 함수입니다. 현재 저는 아래와 같이 github 로그인과 credential 로그인이 나오도록 만들어두었습니다.

![](/assets/image/image-8.png)

#### signUp

그러면 이제 signUp 페이지를 만들겠습니다.

기존에는 카카오 Oauth 로그인만 사용했기 때문에 별도의 회원가입 페이지가 없어도 상관이 없었습니다.

하지만 이번에는 credential 로그인도 구현했기 때문에 회원가입 페이지를 만들어야 합니다.

먼저 `signup/page.tsx`에는 아래와 같이 구성했습니다.

```ts
export default function SignUp() {
  const { data: session } = useSession();

  if (session) {
    redirect('/');
  }

  return (
    <Wrapper>
      <Container>
        <Form />
      </Container>
    </Wrapper>
  );
}
```

현재 로그인 여부를 `useSession()`으로 받아오고 로그인되어 있을 경우에는 메인 페이지로 리다이렉트 시켜주었습니다.

그리고 로그인 폼은 Form 컴포넌트에서 구현했습니다.

```ts
export default function Form() {
  const {
    name,
    setName,
    email,
    setEmail,
    password,
    setPassword,
    nameError,
    emailError,
    passwordError,
    isValid,
  } = useVaildation();

  return (
    <Wrapper method='POST' action='/api/auth/signup'>
      <h4>SignUp</h4>
      <input
        name='name'
        type='text'
        placeholder='name'
        value={name}
        onChange={(e) => setName(e.target.value)}
      />
      <div>{nameError && nameError}</div>
      <input
        name='email'
        type='text'
        placeholder='email'
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />
      <div>{emailError && emailError}</div>
      <input
        name='password'
        type='password'
        placeholder='password'
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />
      <div>{passwordError && passwordError}</div>
      <Button background='#7A5427' color='white' type='submit' disabled={!isValid}>
        signUp
      </Button>
    </Wrapper>
  );
}
```

Form 컴포넌트에서는 필요한 정보만 알 수 있게 로직은 `useValidation` 훅에서 모두 처리하고 그 결과만 받아옵니다.

서버에서는 `bcrypt`를 사용하여 비밀번호를 암호화하고 이를 db에 저장하도록 구현했습니다.

```ts
import { connectDB } from '@/util/database';
import { NextApiRequest, NextApiResponse } from 'next';
import bcrypt from 'bcrypt';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'POST') {
    let hash = await bcrypt.hash(req.body.password, 10);

    req.body.password = hash;

    const db = (await connectDB).db('forum');
    await db.collection('user_cred').insertOne(req.body);
    res.redirect(302, '/');
  }
}
```

</details>

<details>

<summary>

#### 2023. 10. 11.

</summary>

새로운 프로젝트를 생성하고 package 설치를 했습니다.

Header 컴포넌트를 만들고 styled-component를 적용하니 아래와 같은 에러가 발생했습니다.

![](/assets/image/image-3.png)

서버컴포넌트에서는 createContext를 사용하면 안된다고 하는데 styled-components의 작동 과정에서 createContext가 사용되나 봅니다.

저는 서버 컴포넌트에도 styled-component를 적용하고 싶으니 해결 방법을 따라 적용해보겠습니다.

다행히 next.js 공식 문서에 styled-components를 적용하는 방법이 나와있습니다.

`lib/registry.tsx` 경로에 파일을 만들고 아래 코드를 추가합니다.

```ts
'use client';

import React, { useState } from 'react';
import { useServerInsertedHTML } from 'next/navigation';
import { ServerStyleSheet, StyleSheetManager } from 'styled-components';

export default function StyledComponentsRegistry({ children }: { children: React.ReactNode }) {
  // Only create stylesheet once with lazy initial state
  // x-ref: https://reactjs.org/docs/hooks-reference.html#lazy-initial-state
  const [styledComponentsStyleSheet] = useState(() => new ServerStyleSheet());

  useServerInsertedHTML(() => {
    const styles = styledComponentsStyleSheet.getStyleElement();
    styledComponentsStyleSheet.instance.clearTag();
    return <>{styles}</>;
  });

  if (typeof window !== 'undefined') return <>{children}</>;

  return (
    <StyleSheetManager sheet={styledComponentsStyleSheet.instance}>{children}</StyleSheetManager>
  );
}
```

그리고 `layout.tsx` 파일에 `StlyedComponentsStyleSheet`를 import 하고 `children`을 감싸줍니다.

```ts
export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang='en'>
      <body className={inter.className}>
        <StyledComponentsRegistry>{children}</StyledComponentsRegistry>
      </body>
    </html>
  );
}
```

여전히 안됩니다. 위 코드를 추가하지 않아도 클라이언트 컴포넌트에는 styled-components 가 이미 잘 적용되는데 그럼 위 방법은 무엇인가.

정확히 단정짓지는 못하지만, 현재 next.js에서 styled-components 사용 시에(클라이언트 컴포넌트) css가 렌더링된 후 적용되는 지연 버그가 있는데 이를 해결하는 방법으로 추측됩니다.

그렇다면 어떻게 하면 서버컴포넌트에서 styled-components를 사용할 수 있을까?

결론은

- 서버컴포넌트와 클라이언트 컴포넌트 모두 ssr이다. 클라이언트 컴포넌트는 서버에서 한 번, 클라이언트에서 한 번 총 두 번 렌더링 된다.
- css-in-js는 ssr에서 사용 가능하다.
- 하지만 현재 서버컴포넌트에서는 css-in-js 를 사용할 수 없고 next.js 팀과 react 팀은 협의 중이다.

입니다...

아래는 공식문서의 안내문입니다.

![](/assets/image/image-6.png)

아래는 해당 이슈에 대한 어느 외국인들의 대화입니다.

https://github.com/styled-components/styled-components/issues/4025

이제 저는 선택을 해야합니다.

1. styled-components 사용하면서 스타일링하는 컴포넌트는 다 클라이언트 컴포넌트로 변경하기

2. 서버, 클라이언트 컴포넌트 신경쓰지 않고 tailwind 사용하기

3. 서버, 클라이언트 컴포넌트 신경쓰지 않고 css module 사용하기

4. 스타일링하지 않기

저는 1번으로 했습니다. 왜냐하면 서버컴포넌트는 서버쪽 메서드를 사용하는 용도로만 사용하고 나머지는 클라이언트 컴포넌트로 사용해도 큰 문제는 없어보입니다. 또 클라이언트 컴포넌트도 어찌됐든 ssr을 하고 있으니까요. 현재는 이렇게 사용하고 next.js 팀과 react 팀과의 원만한 협의로 css-in-js도 서버 컴포넌트에서 사용할 수 있는 날이 오길 기다리겠습니다.

오늘은 의도치않게 토끼굴에 빠져서 허우적대는 날이였습니다. 내일부터 본격적인 작업에 들어가보겠습니다.

</details>

<details>

<summary>

#### 2023. 10. 10. 재개

</summary>

다시 시작합니다.

4달 넘게 손놓고 있다보니 머릿속에 남아있던 next.js 문법들이 거의 휘발되어서 강의를 다시 정주행했습니다.

로컬환경에서 실행해보니 켜자마자 에러가 발생했습니다?

![](/assets/image/image.png)
일단 무시하고 전체적으로 정리를 좀 해야할 것 같습니다.

강의를 다시 들으면서 next.js 및 next-auth 문서를 보다보니 문법이 삭제되거나 변경된 게 좀 있었습니다. 기존의 모듈을 node_module을 삭제하고 package.json에 명시된 종속성들을 업데이트하고 다시 설치하였습니다.

이 과정에서 기존의 tailwind는 버리고 styled-components를 사용하기로 결정했습니다. 사실 tailwind의 장점이 간편하게 원하는 곳에 스타일링을 적용할 수 있다 정도인 것 같은데 저는 styled-components를 사용하면서도 큰 불편함을 느끼지 못했고, 무엇보다 tailwind 때문에 코드 가독성이 너~~~무 떨어집니다.

서버를 껐다가 다시 켜보니 이제 tailwind 관련 에러가 발생했습니다.

![](/assets/image/image-1.png)

각 파일에서 tailwind 관련 import를 전부 삭제하고 className도 전부 삭제하여 style을 초기화하겠습니다.

그냥 긴 className 속성들을 삭제하기만 했는데도 코드가 깨끗해진 느낌이 들어 마음이 편안합니다.

그런데 이제 아예 로컬환경에서 실행이 되질 않습니다.. 무한로딩에 어떠한 네트워크 요청도, 에러도 뜨지 않는 상태라 뭐가 잘못된건지 감도 잡히지 않습니다...(껐다 켜봄)

![](/assets/image/image-2.png)

이제 이 폴더는 오염되어 더이상 진행이 불가하다고 판단하고 새로운 next.js 프로젝트를 생성하여 내일부터는 기존 코드들을 옮겨가면서 리팩토링하는 과정을 거치겠습니다.

</details>

---

맥북 로직보드가 고장나서 커밋하지 않고 작업하던게 다 증발해버렸습니다.. 심신이 안정된 후 재개하겠습니다.

<details>

<summary>

#### 2023. 5. 31. 프로젝트 7일차

</summary>

#### 로그인 상태에 따른 CRUD 조건부 렌더링 구현

- 로그인 시 email 제공 동의를 하지 않은 유저의 경우, mypage에서 email을 입력하면 유저 db에 email을 추가하도록 구현하였습니다.

- 로그인했을 때, db에 email이 있을 경우에만 글 작성이 가능하게끔 구현하였습니다.

- 로그인했을 경우에만 글 내용을 볼 수 있도록 구현했습니다.

- 수정, 삭제 버튼을 db의 email과 현재 로그인한 유저의 email의 일치 여부에 따라 조건부 렌더링하는 로직을 구현하는 도중, 문제가 발생했습니다. ListItem에서 db를 받아오려고 하면 dns 모듈과 fs 모듈이 없다는 에러가 뜹니다. 다른 페이지에서는 잘 받아오는데 왜 여기서만 못받아올까 생각해보니 ListItem은 클라이언트 컴포넌트로 사용하는 게 다른 컴포넌트들과의 차이점이였습니다. 따라서 onClick을 사용하는 Delete 컴포넌트만 빼주어 클라이언트 컴포넌트로 만들고, ListItem 컴포넌트는 서버 컴포넌트로 변경해주니 에러가 사라지고 정상적으로 작동했습니다.

- 메인페이지에서 내가 작성한 글이면 수정, 삭제 버튼이 함께 나타나도록 구현하였습니다.

- 마이페이지에서 내가 작성할 글 목록을 수정, 삭제 버튼과 함께 나타나도록 구현하였습니다.

#### 더미데이터 생성 버튼 구현

- 기능 작동 확인을 위해 더미데이터를 생성하여 db에 저장하는 더미데이터 생성 버튼을 만들었습니다.

```TS
//DummyCreater.tsx
const DummyCreater = () => {
  const data = {
    title: `제주삼다수는 화산암반수입니다. ${Math.floor(Math.random() * 100)}`,
    email: 'antod2981@nate.com',
    date: new Date().toLocaleString(),
    author: '박무생',
    ...
  };

  return (
    <button
      onClick={() => {
        axios.post('api/post/dummy', data);
      }}
    >
      버튼
    </button>
  );
};
```

```TS
//dummy.tsx
const handler = async (req: any, res: any) => {
  try {
    const db = (await connectDB).db('forum');
    await db.collection('post').insertOne(req.body);
    return res.redirect(302, '/');
  } catch (err) {
    return res.status(500).json('error');
  }
};
```

</details>

<details>

<summary>

#### 2023. 5. 30. 프로젝트 6일차

</summary>

#### 로그인 상태에 따른 CRUD 조건부 렌더링 구현

- 글 작성 시, 로그인 되어 있지 않으면 로그인하라는 문구가 나타나고, 로그인 되어 있으면 글 작성이 가능토록 해야합니다. 여기서 문제가 발생하는데 카카오 OAuth로 받아올 수 있는 유저 정보 중에 필수 항목으로 체크할 수 있는게 닉네임과 프로필 사진밖에 없습니다. 닉네임은 보통 이름으로 짓는데, 이는 고유한 ID로서 사용할 수가 없습니다. 고유한 ID로 사용 가능한 것은 email인데 email은 선택적으로 받아올 수 있습니다. 즉, 유저가 동의하지 않으면 받아올 수 없습니다. 따라서 글 작성 시 로그인이 되어있지만 email 동의를 체크하지 않았다면, 회원 정보에 email을 기입하도록 해서 강제적으로 유저 식별이 가능토록 해야 합니다.

- 먼저, 회원 정보 수정을 위한 마이페이지를 만들기 전에 양 사이드를 컴포넌트화하여 각 페이지에서 재사용하도록 만들었습니다.

- 왼쪽 사이드 컴포넌트에서 아래와 같이 usePathname을 사용하여 현재 경로에 따른 조건부 렌더링을 해주었습니다.

```TS
const LeftSide = () => {
...
  const path = usePathname();

  return (
    <>
      {path === '/' && (
        ...
      )}
      {(path === '/edit' || path === '/write') && (
        ...
      )}
    </>
  );
};
```

- write 페이지에서는 왼쪽 사이드가 제대로 렌더링 되는데 edit, detail 페이지에서는 렌더링이 되지 않아 확인해보니 url에 해당 글의 id가 parameter로 붙어있기 때문이였습니다. 이에 따라 해당 경로 뒤에 어떤 문자가 오더라도 true를 반환하게 만들기 위해 아래와 같이 와일드 카드를 사용해 보았으나, 작동하지 않았습니다.

```TS
{(path === '/write' || path === '/edit/*' || path === '/detail/*') && (
  ...
)}
```

- 고민하다가 결국 아래와 같이 정규표현식을 사용하여 모든 문자열에 대응할 수 있도록 수정하였습니다.

```TS
{(path === '/write' ||
  /^\/edit\/.+$/i.test(path) ||
  /^\/detail\/.+$/i.test(path)) && (
    ...
)}
```

- 근데 수정하고 나니 마이페이지에는 사이드바가 없다는 걸 깨달았습니다. 깔끔하게 정리한걸 위안 삼겠습니다.

- 여러 페이지에서 사용하는 Card UI 컴포넌트를 별도로 생성하여 재사용토록 하였습니다.

```TS
// Card.tsx
const Card = (props: any) => {
  const Card = tw.div`
  ml-4 flex h-8 w-24 items-center justify-center rounded-md
  `;
  return <Card className={props.className}>{props.children}</Card>;
};

//Header.tsx
...
<Card className="h-16 w-48 bg-moogray text-2xl text-mooblack">
  CodrenForum
</Card>
...
```

- 위 코드에서 Header.tsx의 Card에 트윈테일 속성이 적용이 되지 않아 고민해보다가 className도 props로 넘겨주면 되지 않나 라는 생각에 시도해보았는데 잘 되어 기분이 좋았습니다.

- Login, Logout 컴포넌트를 Sign 컴포넌트로 합쳐주었습니다. mypage 만들려고 했는데 갑자기 리팩토링하기 시작했습니다. 이제 어느정도 한 것 같으니 mypage를 만들어 보겠습니다.

- mypage를 만들고 나서 email을 입력하면 제출할 곳이 필요한데 기존의 로그인을 토큰으로 하기 때문에 DB에 추가 입력된 유저 정보를 저장할 수 없습니다. 따라서 로그인 방식을 세션으로 변경하여 유저가 로그인하면 서버에 유저 정보가 저장되게 변경하였습니다.

```TS
export const authOptions: any = {
  providers: [
    KakaoProvider({
      clientId: process.env.KAKAO_CLIENT_ID!,
      clientSecret: process.env.KAKAO_CLIENT_PASSWORD!,
    }),
  ],
  secret: process.env.SECRET_KEY,
  adapter: MongoDBAdapter(connectDB), // 추가된 부분
};
```

- 이제 몽고DB에 유저 정보가 저장되었고, mypage에서 유저가 email을 입력하면 DB에서 현재 로그인한 유저 정보를 찾아 입력한 email을 추가해주도록 하겠습니다. 잠이 오니까 내일 하겠습니다.

</details>

<details>

<summary>

#### 2023. 5. 29. 프로젝트 5일차

</summary>

#### 카카오 로그인 구현

- Next-auth를 사용하여 카카오 로그인을 구현했습니다. 카카오 deveolpers에서 REST_API_KEY와 CLIENT_PASSWORD를 받고, redirect URL을 설정해주었습니다. 현재는 개발단계이기 때문에 localhost:3000으로 설정해놨었는데, 오류가 발생해서 보니 Next-auth로 카카오 로그인을 구현할 시 자동으로 http://localhost:3000/api/auth/callback/kakao 로 리다이렉트 되기 때문에 해당 url을 추가해주었습니다. 카카오는 국내 기업이기 때문에 Next-auth에 카카오 Provider는 없을 줄 알았는데, 혹시나 하는 마음으로 node-modules에서 찾아보니 kakao가 있어 정말 다행이였습니다. 이제 CRUD에 로그인 정보를 추가해주고, 로그인 여부에 따른 조건부 렌더링만 해주면 되겠습니다.

- 로그인을 구현하는 중 로그인 버튼 조건부 렌더링을 위해 Header 컴포넌트에서 로그인 정보를 받아오는 과정에서 Header 컴포넌트를 비동기 함수로 만들어야 하는데,

```TS
const Header = async () => {
  const Card = tw.div`
  ml-4 flex h-8 w-24 items-center justify-center rounded-md

  `;

  let session: any = await getServerSession(authOptions);

  return ( ... )
}
```

- 위와 같이 async await을 사용하게되면, 아래와 같이 Header 컴포넌트가 올바른 JSX 형식이 아니라고 나옵니다.

```TS
'Header'은(는) JSX 구성 요소로 사용할 수 없습니다.
  해당 반환 형식 'Promise<Element>'은(는) 유효한 JSX 요소가 아닙니다.
    'Promise<Element>' 형식에 'ReactElement<any, any>' 형식의 type, props, key 속성이 없습니다.ts(2786)
(alias) const Header: () => Promise<JSX.Element>
import Header
```

- 따라서, Header 컴포넌트에서 직접적으로 async await을 사용하지 않고, 아래와 같이 getInitialProps 메서드를 추가하여, Header에서는 session을 props로 받아오게 만들었습니다.

```TS
const Header = ({ session }) => {
...
}


Header.getInitialProps = async () => {
  const session = await getServerSession(authOptions);
  return { session };
};
```

- 그런데 위와 같이 수정하니, session 정보를 받아오기 전에 렌더링이 되어버립니다.
  에러 메세지가 뜨긴 하지만 작동은 하므로 일단 그대로 두겠습니다...

  - Next.js 13의 서버 컴포넌트를 async 함수로 사용하면 JSX가 아닌 Promise를 반환합니다. React 컴포넌트는 JSX만 반환하는 것으로 이해하는 Typescript가 아직 이 케이스를 커버하지 못해서 위와 같은 에러가 발생한다고 합니다. Next.js 팀에서 이미 인지하고 있는 타입스크립트 이슈이고 조만간 해결될 예정이라고 합니다. 따라서, 임시 해결법으로 아래 주석처리를 통해 해당 경고를 무시하겠습니다.

  ```TS
  export default function RootLayout({
  children,
  }: {
  children: React.ReactNode;
  }) {
  return (
    <html lang="en" className="h-screen">
      <body
        className={`flex-col justify-center text-sm font-black ${inter.className}`}
      >
        {/* @ts-expect-error Async Server Component */}
        <Header />
        {children}
        <Footer />
      </body>
    </html>
  );
  };
  ```

- 로그인 성공 후 user의 image url을 받아와서 next의 Image의 src에 추가하니 아래와 같은 에러가 발생했습니다.

```
Error: Invalid src prop (http://k.kakaocdn.net/dn/cMJqw5/btrLu9LQkAb/kyBJzT0k2VKNVxlfvgFr20/img_640x640.jpg) on `next/image`, hostname "k.kakaocdn.net" is not configured under images in your `next.config.js`
See more info: https://nextjs.org/docs/messages/next-image-unconfigured-host
```

- 위의 에러는 이미지 호스팅을 위해 사용된 호스트가 next.config.js 파일의 이미지 구성에 설정되어 있지 않기 때문에 발생합니다. 따라서 아래와 같이 next.config.js에 'k.kakaocdn.net' 호스트를 추가해주었습니다.

```TS
/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: ['k.kakaocdn.net'],
  },
};

module.exports = nextConfig;
```

- 터미널에서 아래와 같은 경고가 계속 떠서 찾아본 결과, next-auth가 현재 next js 13버전과의 호환이 제대로 되지 않아 경고가 뜨는 것 같습니다. 기능은 정상적으로 작동하고 있고, 안정화되면 사라질 것으로 보입니다.

```
[next-auth][warn][EXPERIMENTAL_API]
`getServerSession` is used in a React Server Component.
```

</details>

<details>

<summary>

#### 2023. 5. 28. 프로젝트 4일차

</summary>

#### CRUD 구현

- 메인페이지에서 글 목록이 바로 나타날 수 있게 구현하였습니다. 추후에 상태 관리를 통한 필터링을 해주어야하므로 ListItem이라는 클라이언트 컴포넌트를 따로 만들고, 서버에서 글 목록 데이터를 받아온 후, 해당 데이터를 map 메서드를 사용하여 렌더링되게 구현하였습니다.

- 해당 글의 타이틀 클릭 시 id에 맞는 상세페이지로 라우팅하고, url의 parameter에서 글의 id를 가져와 서버에서 해당 id와 일치하는 글의 데이터를 받아와서 렌더링 되게끔 구현하였습니다.

- 글 작성 버튼 클릭 시 글 작성 페이지로 라우팅하고, Form의 내용을 서버로 보내준 다음, 알맞게 입력되었으면 db에 저장하도록 로직을 구현하였습니다.

- 글 수정 버튼 클릭 시 글 작성 페이지로 라우팅하고, 조건부 렌더링을 통해 해당 글의 id와 일치하는 데이터가 있으면 defaultValue를 db에서 받아오게끔 구현하였습니다.

- 글 삭제 버튼 클릭 시 db에서 해당 id와 일치하는 데이터를 삭제하도록 구현하였습니다.

- 현재는 로그인 기능이 없으므로, validation 과정이 빠져있습니다. 로그인 기능 구현 후에는 아래와 같은 기능을 추가할 예정입니다.
  - 글 작성 시 useremail을 데이터에 추가하여 본인이 작성한 글만 수정 및 삭제가 가능토록하여야 합니다.
  - 로그인하지 않았을 경우, 글 작성 및 상세페이지 보기가 불가능하여야 합니다.

</details>

<details>

<summary>

#### 2023. 5. 27. 프로젝트 3일차

</summary>

#### 카카오 로그인 구현

- 2일차에 벽에 부딪혀 찾아보니 next.js에서는 next auth라는 라이브러리로 Oauth를 통한 로그인 및 사이트 자체의 로그인까지 구현이 가능하다는 걸 알게 되었습니다. 방법은 알았으니 CRUD를 위한 페이지 및 api를 구현한 후 로그인 기능을 구현하여 적용해 보겠습니다.

</details>

<details>

<summary>

#### 2023. 5. 26. 프로젝트 2일차

</summary>

#### 카카오 로그인 구현

- kakao developers에서 각종 설정을 하여 로그인 버튼 클릭 시 카카오 로그인 페이지로 이동 및 로그인 후 메인페이지로 redirect 되고, qeury parameter로 인가 code를 받아오는 데까지는 성공하였습니다. 그 이후 엑세스 토큰을 받아오는 과정이 정리가 되질 않아서 서버 및 DB를 구축한 후 다시 시도해보겠습니다.

- DB는 mongodb를 사용했습니다. next js는 폴더 구조에서 자동으로 라우팅이 되고, api 라우팅도 되므로 경로만 지정해주면 해당 파일의 함수를 실행시켜 줍니다.

#### 글쓰기 페이지 구현

- 글 쓰는 페이지를 구현했습니다. 메인 페이지의 내비게이션 섹션을 가져와서 글 목록으로 돌아가는 버튼을 만들고 메인 섹션에는 form 태그를 사용해서 글제목, 카테고리 radio, 글 내용 input과 전송 버튼을 만들었습니다. 여기서 신기한 점은 form 태그 자체에 flex 속성을 주면 정렬이 안되어서 해결 방법을 찾다가 아래 div 태그로 한 번 더 감싸니 정렬이 되었습니다.

```TS
 <form action="/api/post/create" method="POST">
          <div className="flex flex-col items-center justify-center">
            <input name="title" placeholder="글제목" />
            ...
            <textarea name="content" placeholder="글내용" />
            <button type="submit">제출</button>
          </div>
        </form>
```

</details>

<details>

<summary>

#### 2023. 5. 25. 프로젝트 1일차

</summary>

#### Header 구현

- 색 조합
  - 애플리케이션의 전체 색상에 일관성을 주기 위해 아래 5개 색상만 사용합니다.
  - <span style="color:#ffffff background: #1976d2">#1976d2</span>
  - <span style="color:#000000 background: #ffffff">#ffffff</span>
  - <span style="color:#000000 background: #e0e0e0">#e0e0e0</span>
  - <span style="color:#ffffff background: #d33131">#d33131</span>
  - <span style="color:#ffffff background: #0a1929">#0a1929</span>
  - 위 색상들을 테일윈드에서 편리하게 사용하기 위해 tailwind.config에 아래와 같이 적용했습니다.
  ```TS
    theme: {
    extend: {
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'gradient-conic':
          'conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))',
      },
      colors: {
        mooblue: '#1976d2',
        moowhite: '#ffffff',
        moogray: '#e0e0e0',
        moored: '#d33131',
        mooblack: '#0a1929',
      },
    },
  },
  ```
- 테일윈드를 처음으로 사용해보고 있는데 동적 css 적용하기가 너무 복잡해서 포기했습니다. 기존의 css(css module, styled components 포함)에서는 개별 속성별로 props로 내려줄 수 있는데, 테일윈드에서는 그게 불가능합니다. 따라서 전체 css 속성을 객체의 키값쌍으로 저장하고, 저장된 속성을 꺼내서 사용하는데, 이런 방식은 동적으로 사용하는 의미가 많이 퇴색된다고 생각되어서 각각의 요소에 css를 적용하기로 했습니다. _그런데_

  - tailwind-styled-components라는 라이브러리를 통해 테일윈드 css를 styled-components 형식으로 사용할 수 있다는 것을 알았습니다. 따라서 공통 css는 styled-componenets 안에, 개별 css는 tailwind로 사용하였습니다.

  ```TS
  const Card = tw.div`
  ml-4 flex h-8 w-24 items-center justify-center rounded-md
  `;

  <Card className="border border-moogray text-mooblack">어바웃</Card>
  ```

- Header는 View 컴포넌트의 역할을 하기 때문에 서버 컴포넌트로 사용을 하고 싶은데, 로그인 상태에 따라 우측 섹션의 요소들을 조건부 렌더링 해야합니다. 조건부 렌더링을 하려면 useState를 사용해서 상태에 따라 렌더링을 해야할 것 같은데 서버 컴포넌트에서는 useState를 사용할 수 없습니다. 일단 넘어가고 해결하면 다시 작성하겠습니다.
- 로고, 어바웃, 로그인, 로그아웃 버튼에 각각 Link로 알맞은 경로에 라우팅해주었습니다. 후원하기 버튼은 클릭 시 모달을 띄우게 만들 것이므로, 모달 컴포넌트를 만든 후에 연결해주겠습니다.

#### Footer 구현

- 기술할만한 것이 없습니다. 어느 페이지에서나 보여야 하므로 Header와 함께 layout에 넣어주었습니다.

#### Main 페이지 구현

- 내비게이션 섹션, 메인(게시글 목록) 섹션, 사이드바 섹션으로 구분하였습니다.
- 내비게이션 섹션에는 글 작성 페이지로 라우팅 되는 글쓰기 버튼과, 글 목록을 필터링할 수 있는 버튼이 있습니다.
- 현재는 게시글 데이터가 없으므로 추후 더미 데이터 작성 후 게시글 목록 구현 예정입니다.
- 우측 사이드바에는 배너가 들어갈 예정입니다.

</details>
