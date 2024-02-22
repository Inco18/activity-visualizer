"use client";
import { SummaryActivity } from "@/types/strava/SummaryActivity";
import { getActivityIcon } from "@/utils/getActivityIcon";
import React, { Dispatch, Fragment, SetStateAction, useState } from "react";
import { Duration, DateTime } from "luxon";
import { IoChevronBack } from "react-icons/io5";
import { FiltersType, SortByType } from "./MapMain";
import FiltersModal from "./FiltersModal";
import { Listbox, Transition } from "@headlessui/react";

type Props = {
  displayedActivities: SummaryActivity[];
  allActivities: SummaryActivity[];
  sortBy: SortByType;
  setSortBy: Dispatch<SetStateAction<SortByType>>;
  filters: FiltersType | undefined;
  setFilters: Dispatch<SetStateAction<FiltersType | undefined>>;
};

export const sortOptions: SortByType[] = [
  {
    id: 1,
    value: "start_date",
    type: "desc",
    name: "Date (Descending)",
  },
  {
    id: 2,
    value: "start_date",
    type: "asc",
    name: "Date (Ascending)",
  },
  {
    id: 3,
    value: "distance",
    type: "asc",
    name: "Distance (Ascending)",
  },
  {
    id: 4,
    value: "distance",
    type: "desc",
    name: "Distance (Descending)",
  },
  {
    id: 5,
    value: "moving_time",
    type: "asc",
    name: "Time (Ascending)",
  },
  {
    id: 6,
    value: "moving_time",
    type: "desc",
    name: "Time (Descending)",
  },
  {
    id: 7,
    value: "total_elevation_gain",
    type: "asc",
    name: "Elev. gain (Ascending)",
  },
  {
    id: 8,
    value: "total_elevation_gain",
    type: "desc",
    name: "Elev.gain (Descending)",
  },
];

const ActivityList = ({
  allActivities,
  displayedActivities,
  sortBy,
  setSortBy,
  filters,
  setFilters,
}: Props) => {
  const [isHidden, setIsHidden] = useState(false);
  const [filtersOpen, setFiltersOpen] = useState(false);
  return (
    <div
      className={`h-fit lg:h-full w-full lg:w-fit p-2 pb-0 lg:pr-0 lg:pb-2 flex flex-col lg:flex-row justify-end border-b-[1px] lg:border-r-[1px] lg:border-b-0 border-white border-opacity-30 ${
        isHidden
          ? "max-h-7 lg:max-w-7 lg:max-h-full"
          : "max-h-72 lg:max-w-[20rem] lg:max-h-full"
      } transition-all duration-500`}
    >
      <div className="lg:h-full flex flex-col">
        <div className="p-2 py-0 lg:py-2 w-full flex flex-col sm:flex-row lg:flex-col gap-2 z-20">
          <Listbox value={sortBy} onChange={setSortBy}>
            <div className="flex flex-col lg:w-full min-w-60">
              <Listbox.Label className="text-sm">Sort by:</Listbox.Label>
              <div className="relative w-full">
                <Listbox.Button className="bg-dark-700 p-2 w-full relative rounded-md text-sm lg:text-base text-white hover:bg-dark-300 transition-colors">
                  {sortBy.name}
                </Listbox.Button>
                <Transition
                  as={Fragment}
                  leave="transition ease-in duration-100"
                  leaveFrom="opacity-100"
                  leaveTo="opacity-0"
                >
                  <Listbox.Options className="absolute bg-dark-700 rounded-md z-30 w-full mt-1 overflow-hidden text-sm lg:text-base">
                    {sortOptions.map((option) => (
                      <Listbox.Option
                        key={option.id}
                        value={option}
                        className={({ selected }) =>
                          `p-2 cursor-pointer hover:bg-dark-900 ${
                            selected ? "bg-dark-100" : ""
                          }`
                        }
                      >
                        {option.name}
                      </Listbox.Option>
                    ))}
                  </Listbox.Options>
                </Transition>
              </div>
            </div>
          </Listbox>
          <button
            onClick={() => setFiltersOpen(true)}
            className="bg-dark-700 p-2 rounded-md text-sm lg:text-base text-white hover:bg-dark-300 transition-colors"
          >
            Show filters
          </button>

          <FiltersModal
            isOpen={filtersOpen}
            onClose={() => setFiltersOpen(false)}
            distanceRange={[
              Math.floor(
                allActivities.reduce((acc, cur) => {
                  return acc < cur.distance ? acc : cur.distance;
                }, allActivities[0].distance) / 1000
              ),
              Math.ceil(
                allActivities.reduce((acc, cur) => {
                  return acc > cur.distance ? acc : cur.distance;
                }, allActivities[0].distance) / 1000
              ),
            ]}
          />
        </div>
        <div className="overflow-x-auto lg:overflow-y-auto p-2 flex lg:flex-col flex-row gap-2 scrollbar min-h-fit lg:min-w-fit flex-1 flex-shrink-0">
          {displayedActivities.map((activity) => {
            const icon = getActivityIcon(activity.sport_type);
            return (
              <div
                key={activity.id}
                className="border-2 border-white border-opacity-30 rounded-md p-2 hover:border-opacity-100 cursor-pointer flex-shrink-0 max-w-48 lg:max-w-none"
              >
                <div className="flex items-center gap-3">
                  <div className="text-lg lg:text-xl">{icon}</div>
                  <div className="flex flex-col">
                    <p className="font-semibold lg:-mb-1 text-sm lg:text-base line-clamp-1">
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
