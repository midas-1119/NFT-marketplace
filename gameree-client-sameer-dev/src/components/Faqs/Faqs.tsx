import { Disclosure } from "@headlessui/react";
import { Questions } from "./Questions";

function classNames(...classes: any) {
  return classes.filter(Boolean).join(" ");
}

export default function Faqs() {
  return (
    <section>
      <div className="container pb-10 mt-16 md:mt-36" id="Faqs">
        {/* <h2 className="mb-[6.25rem] text-[3.75rem] font-Circular-Bold text-center ">FAQs</h2> */}
        <div className="flex justify-center mb-[6.25rem]">
          <h2 className="Headings px-7 font-TTTrailers-SemiBold  text-center  border-b-[11px] border-purples">
            FAQs
          </h2>
        </div>
        <div className="grid grid-cols-1 gap-x-[7.813rem] gap-y-8">
          {Questions.map((faq) => (
            <Disclosure
              as="div"
              key={faq.question}
              className="w-full bg-[#0D0D14] relative overflow-hidden mt-4 py-[1.875rem] pl-5 pr-8"
            >
              {({ open }) => (
                <>
                  <dt className="text-lg">
                    <Disclosure.Button className="text-left w-full flex justify-between items-center">
                      <p className="text-2xl font-Circular-Medium text-[#FFFFFF] mb-3">
                        {faq.question}
                      </p>
                      <span className="ml-6  flex items-center">
                        {open ? (
                          <svg
                            className="w-8 h-8 absolute top-[1.875rem] right-8"
                            viewBox="0 0 32 32"
                            fill="none"
                            xmlns="http://www.w3.org/2000/svg"
                          >
                            <path
                              d="M24.6663 16H15.9997L7.33301 16"
                              stroke="#8264E2"
                              strokeWidth="3"
                              strokeMiterlimit="10"
                              strokeLinecap="square"
                              strokeLinejoin="round"
                            />
                          </svg>
                        ) : (
                          <svg
                            className="w-8 h-8 absolute top-[1.875rem] right-8"
                            viewBox="0 0 32 32"
                            fill="none"
                            xmlns="http://www.w3.org/2000/svg"
                          >
                            <path
                              d="M24.6663 16H15.9997L7.33301 16"
                              stroke="#8264E2"
                              strokeWidth="3"
                              strokeMiterlimit="10"
                              strokeLinecap="square"
                              strokeLinejoin="round"
                            />
                            <path
                              d="M15.999 24.6673L15.999 16.0007L15.999 7.33398"
                              stroke="#8264E2"
                              strokeWidth="3"
                              strokeMiterlimit="10"
                              strokeLinecap="square"
                              strokeLinejoin="round"
                            />
                          </svg>
                        )}
                      </span>
                    </Disclosure.Button>
                  </dt>
                  <Disclosure.Panel as="dd">
                    <>
                      {faq.answer && (
                        <p className=" sm:text-lg text-sm text-[#FFFFFF] font-Montserrat-Regular mt-3 py-[0.625rem] mb-5 border-t  border-[#434343] leading-[1.75rem]">
                          {faq.answer}
                        </p>
                      )}
                      {faq.answer1 && (
                        <p className=" sm:text-lg text-sm text-[#FFFFFF] font-Montserrat-Regular mt-3 py-[0.625rem] mb-5 leading-[1.75rem]">
                          {faq.answer1}
                        </p>
                      )}
                      {faq.answer2 && (
                        <p className=" sm:text-lg text-sm text-[#FFFFFF] font-Montserrat-Regular mt-3 py-[0.625rem] mb-5 leading-[1.75rem]">
                          {faq.answer2}
                        </p>
                      )}
                      {faq.answerPoints?.length && (
                        <ol className="pl-8 sm:text-lg text-sm text-[#FFFFFF] font-Montserrat-Regular  py-[0.625rem] mb-5   leading-[1.75rem] list-decimal">
                          {faq.answerPoints?.map((point: string) => {
                            return <li>{point}</li>;
                          })}
                        </ol>
                      )}
                    </>
                  </Disclosure.Panel>
                </>
              )}
            </Disclosure>
          ))}
        </div>
      </div>
    </section>
  );
}
