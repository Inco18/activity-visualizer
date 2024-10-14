import Image from "next/image";
import React from "react";

const SmallFooter = ({ bg }: { bg?: string }) => {
  return (
    <div
      className={`absolute bottom-0 right-0 ${
        bg ? bg : ""
      } rounded-tl-lg z-[9999]`}>
      <Image
        src={"/strava-pow-horiz-orange.png"}
        width={338}
        height={63}
        alt="Powered by Strava"
        className="h-8 w-auto"
      />
    </div>
  );
};

export default SmallFooter;
