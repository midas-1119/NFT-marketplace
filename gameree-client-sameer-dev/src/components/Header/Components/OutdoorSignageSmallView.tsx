import Link from "next/link";
import React from "react";
import ImageComponent from "../../imageComponent/ImageComponent";

const OutdoorSignageSmallView = ({ data, close }: any) => {
  return (
    <div className="grid grid-cols-1 gap-10">
      {data.featured.map((featured: any, i: any) => (
        <div key={i}>
          <ImageComponent
            src={featured.src}
            height={featured.height}
            width={featured.width}
            className="rounded-lg"
          />
          <h5 className="mt-3 text-xl uppercase font-Roboto-Bold">
            {featured.title}
            <span className="block text-sm text-red-500 font-Roboto-Bold">
              (coming soon)
            </span>
          </h5>
          <ul
            role="list"
            aria-labelledby={`${featured.name}-heading`}
            className="mt-6 space-y-2 text-lg sm:mt-4 font-Roboto-Regular"
          >
            {featured.items.map((item: any, i: any) => (
              <>
                <Link
                  key={i}
                  href={{
                    pathname: item.href,
                    query: {
                      id: data.id,
                      category: featured.name,
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
                        className="hover:text-[#418dc7] text-primary"
                        title={item.name}
                      >
                        {item.name}
                      </a>
                    </li>
                  </a>
                </Link>
              </>
            ))}
            {/* <Link
              href={{
                pathname: router_paths.allProducts,
                query: { id: data.id, category: featured.name },
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
  );
};

export default OutdoorSignageSmallView;
