"use client";
import { SummaryActivity } from "@/types/strava/SummaryActivity";
import { getActivityIcon } from "@/utils/getActivityIcon";
import React, { useState } from "react";
import { Duration, DateTime } from "luxon";
import { IoChevronBack } from "react-icons/io5";

const ActivityList = ({ activities }: { activities: SummaryActivity[] }) => {
  const [displayedActivites, setDisplayedActivities] = useState(activities);
  const [isHidden, setIsHidden] = useState(false);
  return (
    <div
      className={`h-fit lg:h-full w-full lg:w-fit p-2 pb-0 lg:pr-0 lg:pb-2 flex flex-col lg:flex-row justify-end border-b-[1px] lg:border-r-[1px] lg:border-b-0 border-white border-opacity-30 ${
        isHidden
          ? "max-h-7 lg:max-w-7 lg:max-h-full"
          : "max-h-48 lg:max-w-[20rem] lg:max-h-full"
      } transition-all duration-500`}
    >
      <div className="overflow-x-auto lg:overflow-y-auto p-2 flex lg:flex-col flex-row gap-2 scrollbar min-h-fit lg:min-w-fit flex-shrink-0">
        {displayedActivites.map((activity) => {
          const icon = getActivityIcon(activity.sport_type);
          return (
            <div className="border-2 border-white border-opacity-30 rounded-md p-2 hover:border-opacity-100 cursor-pointer flex-shrink-0">
              <div className="flex items-center gap-3">
                <div className="text-lg lg:text-xl">{icon}</div>
                <div className="flex flex-col">
                  <p className="font-semibold lg:-mb-1 text-sm lg:text-base">
                    {activity.name}
                  </p>
                  <p className="text-material-400 text-xs lg:text-sm">
                    {DateTime.fromISO(activity.start_date_local, {
                      zone: "utc",
                    }).toLocaleString(DateTime.DATETIME_SHORT)}
                  </p>
                </div>
              </div>
              <div className="flex flex-col lg:flex-row lg:gap-2 w-full justify-between">
                <div className="flex flex-row lg:flex-col gap-2 lg:gap-0 whitespace-nowrap items-center w-fit">
                  <p className="text-xs lg:text-sm text-material-400">
                    Distance
                  </p>
                  <p className="text-sm lg:text-base">
                    {(activity.distance / 1000).toFixed(2)} km
                  </p>
                </div>
                <div className="hidden lg:block w-[1px] bg-white opacity-20" />
                <div className="flex flex-row lg:flex-col gap-2 lg:gap-0 whitespace-nowrap items-center w-fit">
                  <p className="text-xs lg:text-sm text-material-400">Time</p>
                  <p className="text-sm lg:text-base">
                    {Duration.fromObject({
                      seconds: activity.elapsed_time,
                    }).toFormat("hh'h' mm'm'")}
                  </p>
                </div>
                <div className="hidden lg:block w-[1px] bg-white opacity-20" />
                <div className="flex flex-row lg:flex-col gap-2 lg:gap-0 whitespace-nowrap items-center w-fit">
                  <p className="text-xs lg:text-sm text-material-400">
                    Elev gain
                  </p>
                  <p className="text-sm lg:text-base">
                    {activity.total_elevation_gain.toFixed(0)} m
                  </p>
                </div>
              </div>
            </div>
          );
        })}
      </div>
      <IoChevronBack
        onClick={() => setIsHidden((prev) => !prev)}
        className={`mx-auto lg:my-auto cursor-pointer min-w-max min-h-max flex-shrink-0 ${
          isHidden
            ? "-rotate-90 lg:rotate-180 text-3xl"
            : "rotate-90 lg:rotate-0 text-xl"
        } transition-all `}
      />
    </div>
  );
};

export default ActivityList;
