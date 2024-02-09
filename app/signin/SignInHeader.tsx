import React from "react";
import Logo from "../../public/logo.svg";
import Link from "next/link";

const SignInHeader = () => {
  return (
    <div className="p-3 border-b-[1px] border-white border-opacity-30 flex items-center gap-20">
      <Link
        href={"/"}
        className="flex items-center gap-5 cursor-pointer hover:text-gray-300 w-fit"
      >
        <Logo className="w-8 h-8" />
        <p className="text-lg">Activity Visualizer</p>
      </Link>
      <nav className="flex items-center gap-5 text-white text-opacity-60 text-sm font-medium">
        <Link href={"/about"} className="hover:text-white transition-colors">
          About
        </Link>
        <Link href={"/faq"} className="hover:text-white transition-colors">
          FAQ
        </Link>
      </nav>
    </div>
  );
};

export default SignInHeader;
