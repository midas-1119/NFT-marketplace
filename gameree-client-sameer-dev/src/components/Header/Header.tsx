import { Fragment, useEffect, useState } from "react";
import { Popover, Transition } from "@headlessui/react";
import { ChevronDownIcon } from "@heroicons/react/20/solid";
import { NavigationData } from "../../data/CustomNavData";
import { Bars3Icon, XMarkIcon } from "@heroicons/react/24/outline";
import ImageComponent from "../imageComponent/ImageComponent";
import Link from "next/link";
import { useRouter } from "next/router";
import ProfileDropdown from "../profileDropown/ProfileDropdown";
import { useDispatch, useSelector } from "react-redux";
import { selectUser } from "../../store/auth/selector";
import { isMetaMaskConnected } from "../../metamask/metamask";
import { handleShowModal } from "../../utils/showModal";
import { LOGIN, SIGNUP } from "../../constants";
import { HttpService } from "../../services/base.service";
import { getUserWithOAuth } from "../../store/auth/async.fun";
import moment from "moment";

function classNames(...classes: any) {
  return classes.filter(Boolean).join(" ");
}

export default function Header() {
  const router = useRouter();
  const user = useSelector(selectUser);
  const dispatch = useDispatch();
  const [account, setAccount] = useState({
    balance: 0,
    connected: false,
    account: "0x0000000000000000000",
  });
  const getWalletDetails = async () => {
    const response = await isMetaMaskConnected();
    if (response.connected) {
      setAccount(response);
    }
  };

  const query = router.query;
  const saveUser = async (t: any) => {
    HttpService.setToken(t);
    let res: any = await dispatch(getUserWithOAuth({ token: t }));

    router.push(router.pathname);
  };

  useEffect(() => {
    if (query.oAuthToken) {
      console.log("OAUTH");
      saveUser(query.oAuthToken);
    }
  }, [query]);
  useEffect(() => {
    if (user && user.metamaskId) getWalletDetails();
  }, [user]);
  return (
    <>
      <Popover className="bg-[rgba(20,21,27,0.35)] backdrop-blur-md sticky top-0  z-50">
        <div className="container ">
          <div className="flex items-center justify-between py-6 xl:space-x-6">
            <div className="">
              <Link href="/">
                <a>
                  <ImageComponent
                    src="/assets/images/logo.png"
                    objectFit="contain"
                    layout="fill"
                    alt=""
                    figClassName=" w-[7.3rem] h-[4.25rem] "
                    priority
                  />
                </a>
              </Link>
            </div>
            <div className="xl:hidden absolute flex items-center mr-2 -ml-2  right-4 sm:right-10 md:right-16">
              <Popover.Button className="inline-flex items-center justify-center p-2 text-gray-400 bg-white rounded-md hover:bg-gray-100 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-indigo-500">
                <span className="sr-only">Open menu</span>
                <Bars3Icon className="w-6 h-6" aria-hidden="true" />
              </Popover.Button>
            </div>
            <Popover.Group as="nav" className="hidden space-x-10 xl:flex">
              <Link href="/">
                <a
                  className={`${
                    router.pathname == "/"
                      ? "border-purples"
                      : "border-transparent"
                  } text-primary text-3xl  h-full flex items-center border-b-[4px] font-TTTrailers-SemiBold`}
                >
                  Home
                </a>
              </Link>
              {NavigationData.categories.map((category, i) => (
                <Popover className="relative" key={category.name}>
                  {({ open, close }) => (
                    <>
                      <Popover.Button
                        className={classNames(
                          open ? "text-gray-900 " : "text-gray-500",
                          "group inline-flex items-center  hover:text-gray-900 focus:outline-none "
                        )}
                      >
                        <a
                          className={`${
                            category.href == router.pathname
                              ? "border-purples "
                              : "border-transparent"
                          }     text-primary text-3xl  hover:text-gray-300  h-full flex items-center border-b-[4px] font-TTTrailers-SemiBold`}
                        >
                          {category.name}
                        </a>

                        <ChevronDownIcon
                          className={classNames(
                            open ? "text-gray-600 rotate-180" : "text-gray-400",
                            "ml-1 h-6 w-6 group-hover:text-gray-500 duration-300"
                          )}
                          aria-hidden="true"
                        />
                      </Popover.Button>

                      <Transition
                        as={Fragment}
                        enter="transition ease-out duration-200"
                        enterFrom="opacity-0 translate-y-1"
                        enterTo="opacity-100 translate-y-0"
                        leave="transition ease-in duration-100"
                        leaveFrom="opacity-100 translate-y-0"
                        leaveTo="opacity-0 translate-y-1"
                      >
                        <Popover.Panel className="absolute z-10 w-screen max-w-md px-2 mt-3 -ml-4 transform sm:px-0 lg:left-1/2 lg:ml-0 lg:-translate-x-1/2">
                          {({ close }) => (
                            <div
                              onMouseLeave={() => close()}
                              className="overflow-hidden rounded-lg shadow-lg ring-1 ring-black ring-opacity-5"
                            >
                              <div className="relative grid gap-6 px-5 py-6 bg-white sm:gap-8 sm:p-8">
                                {category?.subcategory?.map((item) => (
                                  <Link
                                    href={item.href}
                                    onClick={() => close()}
                                  >
                                    <a
                                      key={item.name}
                                      // href={item.href}
                                      className="flex items-start p-3 -m-3 rounded-lg hover:bg-gray-50"
                                    >
                                      <item.icon
                                        className="flex-shrink-0 w-6 h-6 text-indigo-600"
                                        aria-hidden="true"
                                      />
                                      <div className="ml-4">
                                        <p className="text-base font-medium text-gray-900">
                                          {item.name}
                                        </p>
                                        <p className="mt-1 text-sm text-gray-500">
                                          {item.description}
                                        </p>
                                      </div>
                                    </a>
                                  </Link>
                                ))}
                              </div>
                            </div>
                          )}
                        </Popover.Panel>
                      </Transition>
                    </>
                  )}
                </Popover>
              ))}
              <Link href="/">
                <a
                  className={`${
                    router.pathname == "/about"
                      ? "border-purples"
                      : "border-transparent"
                  } text-primary text-3xl  h-full flex items-center border-b-[4px] font-TTTrailers-SemiBold`}
                >
                  About Us
                </a>
              </Link>
            </Popover.Group>
            <div className="relative mr-28  xl:mr-10 hidden md:flex min-w-[260px] h-fit">
              {/* <GamreeDropdown /> */}
              <div className=" flex gap-2 w-full h-fit">
                <div
                  className={`w-full h-fit`}
                  onClick={() => !user && handleShowModal(LOGIN)}
                >
                  {
                    user &&
                      (account.connected ? (
                        <div className=" bg-[#15161B] pl-7 pr-16 border-2 text-center rounded-full py-5 border-purples relative cursor-pointer">
                          <h6 className="text-left -mt-3">
                            {account.balance} BNB
                          </h6>
                          <p className="text-sm font-Montserrat-Medium truncate w-40 xs:w-24 absolute -mt-[6px]">
                            {account.account.substring(0, 8)}...
                            {account.account.substring(
                              account.account.length - 5
                            )}{" "}
                          </p>
                        </div>
                      ) : (
                        <div className=" bg-[#15161B] px-8 pr-16 border-2 text-center rounded-full py-5 border-purples relative cursor-pointer ">
                          <h6 className="-mt-3 text-start ">{user.fullName}</h6>
                          {user.lastLoginAt && (
                            <p className="text-left text-sm font-Montserrat-Medium truncate w-40 xs:w-24 absolute -mt-[6px]">
                              Last login : {moment(user.lastLoginAt).fromNow()}
                            </p>
                          )}
                        </div>
                      )) // <p
                    //   onClick={() => handleShowModal(LOGIN)}
                    //   className="h-full w-full flex justify-center cursor-pointer items-center font-TTTrailers-Bold text-[1.625rem] text-white "
                    // >
                    //   LOGIN
                    // </p>
                  }
                  {user && (
                    // <div className="absolute -top-2 -right-10">
                    <div className="absolute top-[50%] translate-y-[-50%] right-[5px]">
                      <ProfileDropdown user={user} />
                    </div>
                  )}
                </div>
                {!user && (
                  <div className="hidden sm:flex gap-2">
                    <div
                      onClick={() => handleShowModal(LOGIN)}
                      className="bg-[#15161B] flex justify-center  items-center px-7 border-2 text-center rounded-full  border-purples relative  cursor-pointer font-TTTrailers-Bold text-[1.625rem] text-white"
                    >
                      Login
                    </div>
                    <div
                      onClick={() => handleShowModal(SIGNUP)}
                      className="bg-[#15161B] flex justify-center  items-center px-7 border-2 text-center rounded-full  border-purples relative  cursor-pointer font-TTTrailers-Bold text-[1.625rem] text-white"
                    >
                      Signup
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        <Transition
          as={Fragment}
          enter="duration-200 ease-out"
          enterFrom="opacity-0 scale-95"
          enterTo="opacity-100 scale-100"
          leave="duration-100 ease-in"
          leaveFrom="opacity-100 scale-100"
          leaveTo="opacity-0 scale-95"
        >
          <Popover.Panel
            focus
            className="absolute inset-x-0 top-0 p-2 transition origin-top-right transform xl:hidden"
          >
            <div className="h-[100vh] overflow-y-auto bg-[rgb(20,21,27)] backdrop-blur-md divide-y-2 rounded-lg shadow-lg divide-gray-50 ring-1 ring-black ring-opacity-5">
              <div className="px-5 pt-5 pb-6">
                <div className="flex items-center justify-between">
                  <Link href="/">
                    <a>
                      <ImageComponent
                        src="/assets/images/logo.png"
                        objectFit="contain"
                        layout="fill"
                        alt=""
                        figClassName=" w-[9.3rem] h-[4.25rem] "
                        priority
                      />
                    </a>
                  </Link>
                  <div className="-mr-2">
                    <Popover.Button className="inline-flex items-center justify-center p-2 text-gray-400 bg-white rounded-md hover:bg-gray-100 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-indigo-500">
                      <span className="sr-only">Close menu</span>
                      <XMarkIcon className="w-6 h-6" aria-hidden="true" />
                    </Popover.Button>
                  </div>
                </div>
                <div className="mt-6">
                  <nav className="grid grid-cols-2 gap-8 xs:grid-cols-1 sm:grid-cols-3 ">
                    {NavigationData.categories.map((category) => (
                      <div key={category.name}>
                        <a
                          className={`${
                            category.href == router.pathname
                              ? "border-purples "
                              : "border-transparent"
                          }     text-purples text-3xl  hover:text-gray-300 flex items-center border-b-[4px] font-TTTrailers-SemiBold`}
                        >
                          {category.name}
                        </a>
                        {category?.subcategory?.map((item) => (
                          <a
                            key={item.name}
                            href={item.href}
                            className="flex items-center p-3 -m-3 rounded-md hover:bg-[#070E1E] "
                          >
                            <item.icon
                              className="flex-shrink-0 w-6 h-6 text-purples"
                              aria-hidden="true"
                            />
                            <span className="ml-3 text-base font-medium text-white ">
                              {item.name}
                            </span>
                          </a>
                        ))}
                      </div>
                    ))}
                  </nav>
                </div>
                <div className=" flex gap-2 min-w-[260px] h-fit  ">
                  <div
                    className={`mt-8 w-full relative`}
                    onClick={() => !user && handleShowModal(LOGIN)}
                  >
                    {
                      user &&
                        (account.connected ? (
                          <div className="w-full bg-[#15161B] pl-7 pr-16 border-2 text-center rounded-full py-5 border-purples relative cursor-pointer">
                            <h6 className="text-left -mt-3">
                              {account.balance} BNB
                            </h6>
                            <p className="text-sm font-Montserrat-Medium truncate w-28 xs:w-24 absolute -mt-[6px]">
                              {account.account.substring(0, 8)}...
                              {account.account.substring(
                                account.account.length - 5
                              )}{" "}
                            </p>
                          </div>
                        ) : (
                          <div className=" bg-[#15161B] px-8 pr-16 border-2 text-center rounded-full py-5 border-purples relative cursor-pointer">
                            <h6 className="-mt-3 text-start">
                              {user.fullName}
                            </h6>
                            {user.lastLoginAt && (
                              <p className="text-left text-sm font-Montserrat-Medium truncate absolute -mt-[6px]">
                                Last login :{" "}
                                {moment(user.lastLoginAt).fromNow()}
                              </p>
                            )}
                          </div>
                        )) // <p
                      //   onClick={() => handleShowModal(LOGIN)}
                      //   className="h-full w-full flex justify-center cursor-pointer items-center font-TTTrailers-Bold text-[1.625rem] text-white "
                      // >
                      //   LOGIN
                      // </p>
                    }
                    {user && (
                      // <div className="absolute -top-2 -right-10">
                      <div className="absolute top-[50%] translate-y-[-50%] right-[5px]">
                        <ProfileDropdown user={user} />
                      </div>
                    )}
                  </div>
                  {!user && (
                    <div className="flex mt-5">
                      <div
                        onClick={() => handleShowModal(LOGIN)}
                        className="bg-[#15161B] flex justify-center  items-center px-7 border-2 text-center rounded-full  border-purples relative  cursor-pointer font-TTTrailers-Bold text-[1.625rem] text-white"
                      >
                        Login
                      </div>
                      <div
                        onClick={() => handleShowModal(SIGNUP)}
                        className="bg-[#15161B] flex justify-center  items-center px-7 border-2 text-center rounded-full  border-purples relative  cursor-pointer font-TTTrailers-Bold text-[1.625rem] text-white"
                      >
                        Signup
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </Popover.Panel>
        </Transition>
      </Popover>
    </>
  );
}
