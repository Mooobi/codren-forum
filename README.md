# Coldren Forum

## 2023. 5. 25. 프로젝트 시작

### Header 구현

- 색 조합
  - 애플리케이션의 전체 색상에 일관성을 주기 위해 아래 5개 색상만 사용합니다.
  - #1976d2 : <span style="color:#1976d2">파란색</span>
  - #ffffff : <span style="color:#ffffff background: #000000">흰색</span>
  - #e0e0e0 : <span style="color:#e0e0e0 background: #000000">회색</span>
  - #d33131 :
    <span style="color:#d33131">빨간색</span>
  - #0a1929 :
    <span style="color:#0a1929">검정색</span>
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

### Footer 구현

- 기술할만한 것이 없습니다. 어느 페이지에서나 보여야 하므로 Header와 함께 layout에 넣어주었습니다.

### Main 페이지 구현

- 내비게이션 섹션, 메인(게시글 목록) 섹션, 사이드바 섹션으로 구분하였습니다.
- 내비게이션 섹션에는 글 작성 페이지로 라우팅 되는 글쓰기 버튼과, 글 목록을 필터링할 수 있는 버튼이 있습니다.
- 현재는 게시글 데이터가 없으므로 추후 더미 데이터 작성 후 게시글 목록 구현 예정입니다.
- 우측 사이드바에는 배너가 들어갈 예정입니다.
