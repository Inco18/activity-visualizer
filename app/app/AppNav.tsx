"use client";
import React, { useState } from "react";
import Link from "next/link";
import Logo from "../../public/logo.svg";
import { FaChartLine, FaMapLocationDot } from "react-icons/fa6";
import { usePathname } from "next/navigation";
import { signOut, useSession } from "next-auth/react";
import Image from "next/image";

const AppNav = () => {
  const [profileOpen, setProfileOpen] = useState(false);
  const pathname = usePathname();
  const session = useSession();
  const user = session.data?.user;

  return (
    <div className="h-full relative w-20 bg-dark-800 rounded-r-lg">
      <div
        onMouseLeave={() => setProfileOpen(false)}
        className="bg-dark-800 rounded-r-lg max-w-20 hover:max-w-64 transition-all absolute z-50 h-full peer"
      >
        <div className="overflow-x-hidden p-4 h-full flex flex-col">
          <Link
            href={"/"}
            className="grid grid-cols-[3rem_auto] items-center gap-4 cursor-pointer hover:text-gray-300 w-fit mb-7"
          >
            <Logo className="w-12 h-12 justify-self-center" />
            <p className="text-lg h-[1lh] whitespace-nowrap">
              Activity Visualizer
            </p>
          </Link>
          <ul className="flex flex-col gap-2 h-full">
            <li>
              <Link
                href={"/app"}
                className={`grid grid-cols-[3rem_auto] items-center gap-4 hover:opacity-100 transition-opacity ${
                  pathname === "/app" ? "text-strava opacity-100" : "opacity-50"
                }`}
              >
                <FaMapLocationDot className="text-4xl justify-self-center" />
                <p className="h-[1lh] whitespace-nowrap">Map</p>
              </Link>
            </li>
            <li>
              <Link
                href={"/app/stats"}
                className={`grid grid-cols-[3rem_auto] items-center gap-4 hover:opacity-100 transition-opacity ${
                  pathname === "/app/stats"
                    ? "text-strava opacity-100"
                    : "opacity-50"
                }`}
              >
                <FaChartLine className="text-4xl justify-self-center" />
                <p className="h-[1lh] whitespace-nowrap">Statistics</p>
              </Link>
            </li>
            {user && (
              <li className="mt-auto">
                <div
                  onClick={() => setProfileOpen((prev) => !prev)}
                  className={`grid grid-cols-[3rem_auto] items-center gap-4 ${
                    profileOpen ? "opacity-100" : "opacity-50"
                  } hover:opacity-100 transition-opacity cursor-pointer`}
                >
                  <Image
                    src={user.image ? user.image : "/user.png"}
                    width={100}
                    height={100}
                    alt=""
                    className="justify-self-center rounded-full"
                  />
                  <p className="h-[1lh] whitespace-nowrap">{user.name}</p>
                </div>
              </li>
            )}
          </ul>
        </div>
        {profileOpen && (
          <div className="absolute bottom-4 left-full z-[51] pl-2 w-max">
            <div className="bg-dark-800 w-max rounded-lg overflow-hidden">
              <ul>
                <li>
                  <button
                    className="cursor-pointer hover:bg-dark-500 py-3 px-6"
                    onClick={() => signOut()}
                  >
                    Sign out
                  </button>
                </li>
              </ul>
            </div>
          </div>
        )}
      </div>
      <div className="bg-black z-40 w-screen h-screen absolute invisible opacity-0 peer-hover:visible peer-hover:opacity-20 transition-all" />
    </div>
  );
};

export default AppNav;
