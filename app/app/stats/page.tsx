import { Metadata } from "next";
import Image from "next/image";
import React from "react";

export const metadata: Metadata = {
  title: "Activity Visualizer - Stats",
  description: "Stats for all your activities",
};

const Stats = () => {
  return (
    <div className="flex flex-col items-center justify-center w-full gap-5">
      <Image
        src={"/under_construction.png"}
        width={395}
        height={349}
        alt=""
        className="h-36 w-auto"
      />
      <h1 className="text-2xl">Page under construction</h1>
    </div>
  );
};

export default Stats;
