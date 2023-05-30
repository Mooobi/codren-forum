'use client';

const Form = ({ result }: any) => {
  return (
    <>
      <form
        action={result ? '/api/post/edit' : '/api/post/create'}
        method="POST"
      >
        <div className="flex w-[736px] flex-col items-center justify-center">
          <label>글제목</label>
          <input
            name="title"
            placeholder="글제목을 입력하세요."
            defaultValue={result && result.title}
            className="mb-2 mt-2 w-full border border-moogray p-2"
          />
          <label>카테고리</label>
          <div className="m-2 flex">
            <label htmlFor="frontend" className="pr-2">
              프론트엔드
            </label>
            <input
              id="frontend"
              name="stack"
              type="radio"
              value="frontend"
              defaultChecked={result && result.stack === 'frontend' && true}
            />
            <label htmlFor="backend" className="pl-4 pr-2">
              백엔드
            </label>
            <input
              id="backend"
              name="stack"
              type="radio"
              value="backend"
              defaultChecked={result && result.stack === 'backend' && true}
            />
          </div>
          <label>글내용</label>
          <textarea
            name="content"
            placeholder="글내용을 입력하세요."
            defaultValue={result && result.content}
            className="mt-2 min-h-[50vh] w-full resize-none border border-moogray p-2 "
          />
          {result && (
            <input
              className="hidden"
              name="_id"
              placeholder="_id"
              value={result._id}
            />
          )}
          <button
            type="submit"
            className="m-4 mb-6 ml-4 flex h-12 w-24 flex-col items-center justify-center rounded-md border bg-mooblue text-moowhite"
          >
            {result ? '수정' : '제출'}
          </button>
        </div>
      </form>
    </>
  );
};

export default Form;
