import Link from "next/link";
import React, { useState } from "react";
import { toast } from "react-toastify";
import { userService } from "../../../../services/user.service";
import Button from "../../../button/Button";
import ImageComponent from "../../../imageComponent/ImageComponent";
const Icons = ({ className }: any) => {
  return (
    <i
      className={`${className} text-4xl text-white cursor-pointer opacity-20 hover:opacity-100`}
    ></i>
  );
};
const Footer = () => {
  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState("");

  const subscribe = async (e: any) => {
    try {
      e.preventDefault();
      if (loading) return;
      setLoading(true);
      const response = await userService.subscribeToNewsletter({
        email: email,
      });
      if (response) {
        toast.success("Subscribed!");
      }
      setEmail("");
      setLoading(false);
    } catch (error: any) {
      console.log(error.response);
      const message = error?.response?.data?.message ?? "Something went wrong!";
      toast.error(message);
      setLoading(false);
      setEmail("");
    }
  };

  return (
    <div className="container bg-[#101117] mt-[7.5rem]">
      <div className="   py-14 flex flex-wrap gap-10 justify-between px-5">
        <div className="">
          <Link href="/">
            <a>
              <ImageComponent
                src="/assets/images/logo.png"
                objectFit="contain"
                layout="fill"
                alt=""
                figClassName="w-[10.313rem] h-[3.313rem] mb-10"
              />
            </a>
          </Link>
          <h2 className="text-white text-[2.688rem] font-TTTrailers-Bold">
            The New Creative Land NFTs.
          </h2>
        </div>
        <div>
          <h3 className="text-[2.125rem] mb-5">LINKS</h3>
          <ul className="text-base text-[#C2C3C5] font-Montserrat-Medium">
            <li className="mb-4 cursor-pointer">
              <Link href="/">Home</Link>
            </li>
            <li className="mb-4 cursor-pointer">
              <Link href="/marketplace">Marketplace</Link>
            </li>
            <li className="mb-4 cursor-pointer">
              <Link href="/academy">Academy</Link>
            </li>
            <li className="mb-4">FAQ</li>
            <li className="mb-4">Gameree World</li>
          </ul>
        </div>
        <div>
          <h3 className="text-[2.125rem] mb-5">Policy</h3>
          <ul className="text-base text-[#C2C3C5] font-Montserrat-Medium">
            <li className="mb-4">Terms & Conditions</li>
            <li className="mb-4">Privacy Policy</li>
            <li className="mb-4">Whitepaper</li>
          </ul>
        </div>

        <div className=" w-[35.313rem]">
          <h3 className="text-[2.125rem] mb-5">SUBSCRIBE</h3>
          <p className="font-Montserrat-Medium  mt-9 text-[#9FA0A2]">
            Join our mailing list to stay in the loop with our newest feature
            releases, NFT drops, and tips and tricks for navigating NFTs.
          </p>
          <form
            className="w-full sm:w-[29.9rem] mt-8 relative"
            onSubmit={subscribe}
          >
            <input
              type="email"
              required
              value={email}
              onChange={(e: any) => setEmail(e.target.value)}
              placeholder="Type your email..."
              className=" w-full pr-44  text-base font-Montserrat-Medium text-white border border-[#4F4F4F] placeholder:text-[#4F4F4F] bg-transparent  xs:pl-6 pl-10 py-6 rounded-full outline-none relative"
            />
            <Button
              type="submit"
              disabled={loading}
              className=" !absolute  px-8 rounded-full   top-1/2 !-translate-y-1/2 !right-3 !text-[2rem]"
            >
              SUBMIT
            </Button>
          </form>
        </div>
      </div>
      <div className="py-10 flex md:justify-end justify-center border-t border-[#2B2C2D]">
        <div className="flex md:justify-between justify-center md:gap-0 gap-10 items-center sm:flex-row flex-col md:w-[59%] w-full">
          <p className="  text-white ">
            {`Copyright © ${new Date().getFullYear()} Gameree.com`}
          </p>
          <div className="flex  gap-x-4 flex-wrap">
            <div className="w-[3.125rem] h-[3.125rem] bg-white rounded-full flex justify-center items-center shadow-[2px_2px_0px_0px_#8264E2] cursor-pointer">
              <a href="https://www.facebook.com/" target="_blank">
                <i className="icon-fb text-2xl"></i>
              </a>
            </div>
            <div className="w-[3.125rem] h-[3.125rem] bg-white rounded-full flex justify-center items-center shadow-[2px_2px_0px_0px_#8264E2] cursor-pointer">
              <a
                href="https://www.linkedin.com/in/gameree-metaverse-43359921a/"
                target="_blank"
              >
                <i className="icon-linkedin text-2xl"></i>
              </a>
            </div>
            <div className="w-[3.125rem] h-[3.125rem] bg-white rounded-full flex justify-center items-center shadow-[2px_2px_0px_0px_#8264E2] cursor-pointer">
              <a href="https://twitter.com/GameReeofficial" target="_blank">
                <i className="icon-twiter text-2xl"></i>
              </a>
            </div>
            <div className="w-[3.125rem] h-[3.125rem] bg-white rounded-full flex justify-center items-center shadow-[2px_2px_0px_0px_#8264E2] cursor-pointer">
              <a
                href="https://www.instagram.com/gamereeofficial/"
                target="_blank"
              >
                <i className="icon-insta text-2xl"></i>
              </a>
            </div>
            <div className="w-[3.125rem] h-[3.125rem] bg-white rounded-full flex justify-center items-center shadow-[2px_2px_0px_0px_#8264E2] cursor-pointer">
              <a href="https://www.twitch.tv/signup" target="_blank">
                <i className=" icon-Twitch text-2xl"></i>
              </a>
            </div>
            <div className="w-[3.125rem] h-[3.125rem] bg-white rounded-full flex justify-center items-center shadow-[2px_2px_0px_0px_#8264E2] cursor-pointer">
              <a href="https://www.youtube.com/" target="_blank">
                <i className="icon-YouTube text-2xl"></i>
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Footer;
