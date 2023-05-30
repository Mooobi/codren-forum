'use client';

import axios from 'axios';
import Link from 'next/link';

const ListItem = ({ result }: any) => {
  return (
    <ul className="flex-col">
      {result?.map((item: any) => {
        return (
          <li
            className="m-2 flex h-[85px] w-[720px] flex-col justify-center rounded-md border p-2"
            key={item._id.toString()}
          >
            <div className="flex justify-between">
              <Link prefetch={false} href={`/detail/${item._id.toString()}`}>
                <h4 className="text-xl">{item.title}</h4>
              </Link>
              <div className="flex">
                <p>{item.stack}</p>

                <Link
                  className="mx-2"
                  prefetch={false}
                  href={`/edit/${item._id.toString()}`}
                >
                  ✏️
                </Link>
                <span
                  onClick={(e: any) => {
                    axios
                      .post('api/post/delete', item._id)
                      .then((res) => {
                        if (res.status === 200) {
                          return res.data;
                        } else {
                          console.log('삭제안됨');
                        }
                      })
                      // .then(() => {
                      //   console.log(e.target.parenteElement.parenteElement);
                      //   e.target.parentElement.parenteElement.style.opacity = 0;
                      //   setTimeout(() => {
                      //     e.target.parentElement.parenteElement.style.display =
                      //       'none';
                      //   }, 1000);
                      // })
                      .then((data) => {
                        console.log(data);
                      })
                      .catch((err) => {
                        console.log(err);
                      });
                  }}
                >
                  🗑️
                </span>
              </div>
            </div>
            <div className="mt-2 flex justify-between">
              <p className="h-4 max-w-[35vw] font-normal">
                {item.content.length > 45
                  ? item.content.slice(0, 46) + '...'
                  : item.content}
              </p>
              <div className="flex-col justify-end">
                <p className="font-normal">{item.date}</p>
              </div>
            </div>
          </li>
        );
      })}
    </ul>
  );
};

export default ListItem;
