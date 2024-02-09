"use client";
import { signIn } from "next-auth/react";
import Image from "next/image";
import Logo from "../../public/logo.svg";
import { FaMapLocationDot, FaChartLine } from "react-icons/fa6";
import { useSearchParams } from "next/navigation";
import { toast } from "react-toastify";
import { useEffect } from "react";

const SignInForm = () => {
  const searchParams = useSearchParams();
  const error = searchParams.get("error");

  useEffect(() => {
    if (error) {
      toast.error("There was an error signing you in with Strava.");
    }
  }, [error]);

  return (
    <div className="bg-dark-900 p-5 rounded-md flex flex-col items-center max-w-[95%]">
      <div className="flex items-center gap-5 select-none w-fit">
        <Logo className="w-12 h-12 " />
        <p className="text-xl">Activity Visualizer</p>
      </div>
      <h3 className="mt-2 mb-5 font-medium text-2xl">
        Visualize your Strava activites
      </h3>
      <ul className="text-sm flex flex-col gap-2 mb-5">
        <li className="flex items-center gap-4">
          <FaMapLocationDot className="text-2xl text-strava" />
          Map of all your activities
        </li>
        <li className="flex items-center gap-4">
          <FaChartLine className="text-2xl text-strava" />
          Activities summed on charts
        </li>
      </ul>
      <button onClick={() => signIn("strava")}>
        <Image
          src={"/strava-connect.png"}
          width={386}
          height={96}
          alt="Connect with Strava"
          className="h-[48px] w-auto"
        />
      </button>
    </div>
  );
};

export default SignInForm;
