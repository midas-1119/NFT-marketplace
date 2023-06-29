import Link from "next/link";
import { useRouter } from "next/router";
import React from "react";
import ImageComponent from "../../imageComponent/ImageComponent";

const WallDecorLargeView = ({ data, close }: any) => {
  const Router = useRouter();
  return (
    <div className="flex gap-y-10 gap-x-32">
      <div className="row-start-1 grid grid-cols-1  gap-y-10 gap-x-8 text-lg text-purples  w-[12rem] bd">
        {data.sections.map((section: any, i: any) => (
          <div key={section.name}>
            <h6
              id={`${section.name}-heading`}
              className="text-2xl uppercase font-Roboto-Bold text-purples"
            >
              {section.name}
            </h6>
            <ul
              role="list"
              aria-labelledby={`${section.name}-heading`}
              className={`${
                i === 0 ? "mt-10 sm:mt-8" : "mt-6  sm:mt-4"
              }  space-y-2`}
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
                    <li
                      key={item.name}
                      className="flex"
                      onClick={() => {
                        close();
                      }}
                    >
                      <div>
                        <span className="hover:text-[#418dc7] cursor-pointer">
                          {item.name}
                        </span>
                      </div>
                    </li>
                  </a>
                </Link>
              ))}
              {/* <Link
                href={{
                  pathname: router_paths.allProducts,
                  query: { id: data.id, category: section.name },
                }}
              >
                <a>
                  <h6 className="text-lg font-Roboto-Medium">Shop All</h6>
                </a>
              </Link> */}
            </ul>
          </div>
        ))}
      </div>
      {/* <div className=" grid grid-cols-2 gap-6  w-[30.3rem]">
        {data.featured.map((item: any, i: any) => (
          <div key={i} className={`${i == 0 ? "col-span-2" : ""} group`}>
            <div className="aspect-w-1 aspect-h-1">
              <ImageComponent
                src={item.src}
                height={item.height}
                width={item.width}
                className="rounded-lg"
              />
            </div>
            <h5 className="mt-2 text-xl font-Roboto-Bold">{item.title}</h5>
          </div>
        ))}
      </div> */}
    </div>
  );
};

export default WallDecorLargeView;
