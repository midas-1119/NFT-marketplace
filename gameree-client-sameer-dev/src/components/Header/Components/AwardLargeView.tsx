import Link from "next/link";
import { useRouter } from "next/router";
import React from "react";
import ImageComponent from "../../imageComponent/ImageComponent";

const AwardLargeView = ({ data, close }: any) => {
  const Router = useRouter();

  // main retrun
  return (
    <div className="flex gap-y-10 gap-x-16">
      <div className=" grid grid-cols-3   gap-y-10 gap-x-16 text-lg text-primary   w-[48rem] ">
        <div>
          {data.sections.map((section: any) => (
            <div key={section.id}>
              <h6
                id={`${section.name}-heading`}
                className="mb-2 text-xl uppercase font-Roboto-Bold leading-0"
              >
                {section.name ? section.name : ""}
              </h6>
              <span className="block text-sm text-red-500 font-Roboto-Bold">
                (coming soon)
              </span>
              <i className="text-[#4AA7ED] text-base font-Roboto-Regular ">
                {section.start_price ? section.start_price : ""}
              </i>
              <ul
                role="list"
                aria-labelledby={`${section.name}-heading`}
                className="mt-6 space-y-2 sm:mt-4"
              >
                {section.items.map((item: any, i: any) => (
                  <>
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
                          <a className="hover:text-[#418dc7] ">{item.name}</a>
                        </li>
                      </a>
                    </Link>
                  </>
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
        <div className="space-y-6">
          {data.featured1.map((item: any, i: any) => (
            <div key={i}>
              <ImageComponent
                src={item.src}
                height={item.height}
                width={item.width}
                className="rounded-lg"
              />
              <h5 className="mt-2 text-xl font-Roboto-Bold ">
                {item.title}
                <span className="block text-sm text-red-500">
                  (coming soon)
                </span>
              </h5>
            </div>
          ))}
        </div>
        <div>
          {data.section1.map((section: any) => (
            <div key={section.id}>
              <h6
                id={`${section.name}-heading`}
                className="mb-2 text-xl uppercase font-Roboto-Bold leading-0"
              >
                {section.name ? section.name : ""}
              </h6>
              <span className="block text-sm text-red-500 font-Roboto-Bold">
                (coming soon)
              </span>
              <i className="text-[#4AA7ED] text-base font-Roboto-Regular">
                {section.start_price ? section.start_price : ""}
              </i>
              <ul
                role="list"
                aria-labelledby={`${section.name}-heading`}
                className="mt-6 space-y-2 sm:mt-4 "
              >
                {section.items.map((item: any) => (
                  <>
                    <li key={item.name} className="flex">
                      <a href={item.href} className="hover:text-[#418dc7]">
                        {item.name}
                      </a>
                    </li>
                  </>
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
                </Link>{" "} */}
              </ul>
            </div>
          ))}
        </div>
      </div>

      <div className=" grid grid-cols-2 gap-6  w-[30.3rem]">
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
            <h5 className="mt-2 text-xl font-Roboto-Bold">
              {item.title}
              <span className="block text-sm text-red-500">(coming soon)</span>
            </h5>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AwardLargeView;
