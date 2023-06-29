import Link from "next/link";
import { useRouter } from "next/router";
import React from "react";
import ImageComponent from "../../imageComponent/ImageComponent";

const WallDecorSmallView = ({ data, close }: any) => {
  console.log(data, "data");
  const Router = useRouter();

  return (
    <div>
      <div className="grid grid-cols-2 gap-4 ">
        {data.featured?.map((item: any, i: any) => (
          <div key={i} className={`${i == 0 ? "col-span-2" : ""} group`}>
            <div>
              <div className="aspect-w-1 aspect-h-1">
                <ImageComponent
                  src={item.src}
                  height={item.height}
                  width={item.width}
                  className="rounded-lg"
                />
              </div>
              <h5 className="mt-2 text-xl font-Roboto-Bold">
                {item.title}
                <span className="block text-sm text-red-500">
                  (coming soon)
                </span>
              </h5>
            </div>
          </div>
        ))}
      </div>
      <div className="grid grid-cols-2 mt-8 truncate gap-x-4 gap-y-8">
        {data.sections?.map((section: any, i: any) => (
          <div key={section.name} className="">
            <h6
              id={`${section.name}-heading`}
              className="text-xl uppercase truncate font-Roboto-Bold"
            >
              {section.name}
              {i !== 0 && (
                <span className="block text-xs text-red-500">
                  (coming soon)
                </span>
              )}
            </h6>

            <ul
              role="list"
              aria-labelledby={`${section.name}-heading`}
              className="mt-6 space-y-2 sm:mt-4"
            >
              {section.items.map((item: any, i: any) => (
                <Link
                  key={i}
                  href={{
                    pathname: item.href,
                    query: {
                      id: data.id,
                      category: section.name,
                      subtype: item.name,
                    },
                  }}
                >
                  <a>
                    <li key={item.name} className="flex">
                      <div
                        onClick={() => {
                          close();
                        }}
                      ></div>
                      <a
                        className="hover:text-[#418dc7] text-primary truncate"
                        title={item.name}
                      >
                        {item.name}
                      </a>
                    </li>
                  </a>
                </Link>
              ))}
              {/* <Link href={{ pathname: router_paths.allProducts, query: { id: data.id, category: section.name } }}>
                <a>
                  <h6 className="text-lg font-Roboto-Medium">Shop All</h6>
                </a>
              </Link> */}
            </ul>
          </div>
        ))}
      </div>
    </div>
  );
};

export default WallDecorSmallView;
