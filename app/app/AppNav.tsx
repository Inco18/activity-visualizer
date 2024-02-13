"use client";
import React, { useRef, useState } from "react";
import Link from "next/link";
import Logo from "../../public/logo.svg";
import { FaChartLine, FaMapLocationDot } from "react-icons/fa6";
import { IoIosMenu } from "react-icons/io";
import { usePathname } from "next/navigation";
import { signOut, useSession } from "next-auth/react";
import Image from "next/image";
import useOutsideClick from "@/hooks/useOutsideClick";

const AppNav = () => {
  const [profileOpen, setProfileOpen] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef<HTMLUListElement>(null);
  const menuBtnRef = useRef<HTMLButtonElement>(null);
  useOutsideClick([menuRef, menuBtnRef], () => setMenuOpen(false));
  const pathname = usePathname();
  const session = useSession();
  const user = session.data?.user;

  return (
    <div className="w-full lg:h-full relative lg:w-20 rounded-r-lg">
      <div
        onMouseLeave={() => setProfileOpen(false)}
        className="lg:bg-dark-800 bg-black lg:rounded-r-lg lg:max-w-20 lg:hover:max-w-64 transition-all lg:absolute z-50 lg:h-full peer border-b-[1px] border-white border-opacity-30 lg:border-0"
      >
        <div className="overflow-x-hidden p-1 lg:p-4 h-full flex lg:flex-col">
          <button
            onClick={() => setMenuOpen((prev) => !prev)}
            ref={menuBtnRef}
            className="mr-4 lg:hidden hover:bg-dark-700 p-1 rounded-lg"
          >
            <IoIosMenu className="text-3xl" />
          </button>
          <Link
            href={"/"}
            className="flex gap-2 lg:grid lg:grid-cols-[3rem_auto] items-center lg:gap-4 cursor-pointer hover:text-gray-300 w-fit lg:mb-7 p-1 lg:p-0"
          >
            <Logo className="w-8 h-8 lg:w-12 lg:h-12 justify-self-center" />
            <p className="lg:text-lg h-[1lh] whitespace-nowrap">
              Activity Visualizer
            </p>
          </Link>
          <ul
            className={`flex flex-col gap-2 absolute top-full bg-dark-800 left-0 p-4 rounded-br-lg max-w-[95%] ${
              menuOpen ? "block" : "hidden lg:flex"
            } lg:p-0 lg:static lg:h-full`}
            ref={menuRef}
          >
            <li>
              <Link
                href={"/app"}
                className={`grid grid-cols-[3rem_auto] items-center gap-4 hover:opacity-100 transition-opacity ${
                  pathname === "/app" ? "text-strava opacity-100" : "opacity-50"
                }`}
              >
                <FaMapLocationDot className="text-3xl lg:text-4xl justify-self-center" />
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
                <FaChartLine className="text-3xl lg:text-4xl justify-self-center" />
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
                    className="justify-self-center rounded-full w-9 lg:w-12"
                  />
                  <p className="h-[1lh] whitespace-nowrap">{user.name}</p>
                </div>
              </li>
            )}
            {profileOpen && (
              <div className="block lg:hidden top-full left-1/2 -translate-x-1/2 absolute z-[51] pt-2 w-max">
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
          </ul>
        </div>
        {profileOpen && (
          <div className="hidden lg:block absolute bottom-4 left-full z-[51] pl-2 w-max">
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
      <div className="hidden lg:block bg-black z-40 w-screen h-screen absolute invisible opacity-0 peer-hover:visible peer-hover:opacity-20 transition-all" />
    </div>
  );
};

export default AppNav;
