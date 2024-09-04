import React, { act, Fragment } from "react";
import { SummaryActivity } from "@/types/strava/SummaryActivity";
import { getActivityIcon } from "@/utils/getActivityIcon";
import { DateTime, Duration } from "luxon";
import { Menu, Transition } from "@headlessui/react";
import { BsThreeDotsVertical } from "react-icons/bs";
import { FaArrowRight } from "react-icons/fa";

type Props = {
  activity: SummaryActivity;
  selected: number | undefined;
  setSelected: React.Dispatch<React.SetStateAction<number | undefined>>;
  prevSelected: number | undefined;
  setPrevSelected: React.Dispatch<React.SetStateAction<number | undefined>>;
  activityRefs: React.MutableRefObject<{
    [key: string]: HTMLDivElement | null;
  }>;
};

const ActivityListItem = ({
  activity,
  selected,
  setSelected,
  prevSelected,
  setPrevSelected,
  activityRefs,
}: Props) => {
  const icon = getActivityIcon(activity.sport_type);
  return (
    <div
      key={activity.id}
      ref={(ref) => {
        activityRefs.current[activity.id] = ref;
      }}
      onClick={() =>
        setSelected((prev) => {
          setPrevSelected(prev);
          if (prev == activity.id) {
            return undefined;
          }
          return activity.id;
        })
      }
      className={`border-2 ${
        selected == activity.id
          ? "border-strava"
          : "border-white border-opacity-30"
      }  rounded-md p-2 hover:border-opacity-100 cursor-pointer flex-shrink-0 ${
        selected == activity.id ? "" : "max-w-48"
      } lg:max-w-none`}>
      <div className="flex items-center gap-3">
        <div className="text-lg lg:text-xl">{icon}</div>
        <div className="flex flex-col">
          <p
            className="font-semibold lg:-mb-1 text-sm lg:text-base line-clamp-1 break-all"
            title={activity.name}>
            {activity.name}
          </p>
          {selected != activity.id && (
            <p className="text-material-400 text-xs lg:text-sm">
              {DateTime.fromISO(activity.start_date_local, {
                zone: "utc",
              }).toLocaleString(DateTime.DATETIME_SHORT)}
            </p>
          )}
        </div>
        <Menu
          as="div"
          className="relative ml-auto"
          onClick={(e) => e.stopPropagation()}>
          <Menu.Button
            className="ml-auto mb-auto text-lg hover:bg-dark-50 p-1 rounded-full"
            onClick={(e) => e.stopPropagation()}>
            <BsThreeDotsVertical />
          </Menu.Button>
          <Transition
            as={Fragment}
            enter="transition duration-100 ease-out"
            enterFrom="transform scale-95 opacity-0"
            enterTo="transform scale-100 opacity-100"
            leave="transition duration-75 ease-out"
            leaveFrom="transform scale-100 opacity-100"
            leaveTo="transform scale-95 opacity-0">
            <Menu.Items className="absolute mt-1 right-0 origin-top-right rounded-md bg-dark-50 shadow-lg ring-1 ring-white/5 focus:outline-none z-50">
              <div className="px-1 py-1 w-max flex flex-col">
                <Menu.Item>
                  {({ active }) => (
                    <a
                      className={`${
                        active && "bg-material-700"
                      } py-1 px-3 rounded-md`}
                      href={`https://www.strava.com/activities/${activity.id}`}
                      target="_blank">
                      View on <span className="text-strava">Strava</span>
                    </a>
                  )}
                </Menu.Item>
                <Menu.Item>
                  {({ active }) => (
                    <button
                      className={`${
                        active && "bg-material-700"
                      } py-1 px-3 rounded-md`}>
                      View details
                    </button>
                  )}
                </Menu.Item>
              </div>
            </Menu.Items>
          </Transition>
        </Menu>
      </div>
      {selected != activity.id && (
        <div className="flex flex-col lg:flex-row lg:gap-2 w-full justify-between">
          <div className="flex flex-row lg:flex-col gap-2 lg:gap-0 whitespace-nowrap items-center w-fit">
            <p className="text-xs lg:text-sm text-material-400">Distance</p>
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
            <p className="text-xs lg:text-sm text-material-400">Elev gain</p>
            <p className="text-sm lg:text-base">
              {activity.total_elevation_gain.toFixed(0)} m
            </p>
          </div>
        </div>
      )}

      {selected == activity.id && (
        <div className="flex flex-row lg:flex-col w-full justify-between gap-2 lg:gap-0">
          <div className="flex flex-col lg:flex-row w-max lg:w-full justify-between items-center">
            <div className="text-material-400 text-sm w-max">
              {DateTime.fromISO(activity.start_date_local, {
                zone: "utc",
              }).toLocaleString(DateTime.DATETIME_SHORT)}
            </div>
            <FaArrowRight className="text-material-400 mx-auto text-xs rotate-90 lg:rotate-0" />
            <div className="text-material-400 text-sm w-max">
              {DateTime.fromISO(activity.start_date_local, {
                zone: "utc",
              })
                .plus({ seconds: activity.elapsed_time })
                .toLocaleString(DateTime.DATETIME_SHORT)}
            </div>
          </div>
          <div className="flex flex-col lg:flex-row w-full justify-between items-center lg:gap-5">
            <div className="text-material-400 text-sm w-max">Distance</div>
            <div className="w-max text-sm lg:text-base">
              {(activity.distance / 1000).toFixed(2)} km
            </div>
          </div>
          <div className="flex flex-col lg:flex-row w-full justify-between items-center lg:gap-5">
            <div className="text-material-400 text-sm w-max">Moving time</div>
            <div className="w-max text-sm lg:text-base">
              {Duration.fromObject({
                seconds: activity.moving_time,
              }).toFormat("hh'h' mm'm'")}
            </div>
          </div>
          <div className="flex flex-col lg:flex-row w-full justify-between items-center lg:gap-5">
            <div className="text-material-400 text-sm w-max">Elapsed time</div>
            <div className="w-max text-sm lg:text-base">
              {Duration.fromObject({
                seconds: activity.elapsed_time,
              }).toFormat("hh'h' mm'm'")}
            </div>
          </div>
          <div className="flex flex-col lg:flex-row w-full justify-between items-center lg:gap-5">
            <div className="text-material-400 text-sm w-max">
              Elevation gain
            </div>
            <div className="w-max text-sm lg:text-base">
              {activity.total_elevation_gain} m
            </div>
          </div>
          <div className="flex flex-col lg:flex-row w-full justify-between items-center lg:gap-5">
            <div className="text-material-400 text-sm w-max">Average speed</div>
            <div className="w-max text-sm lg:text-base">
              {((activity.average_speed * 18) / 5).toFixed(1)} km/h
            </div>
          </div>
          <div className="flex flex-col lg:flex-row w-full justify-between items-center lg:gap-5">
            <div className="text-material-400 text-sm w-max">Max speed</div>
            <div className="w-max text-sm lg:text-base">
              {((activity.max_speed * 18) / 5).toFixed(1)} km/h
            </div>
          </div>
          {activity.kilojoules && (
            <div className="flex flex-col lg:flex-row w-full justify-between items-center lg:gap-5">
              <div className="text-material-400 text-sm w-max">Kilojoules</div>
              <div className="w-max text-sm lg:text-base">
                {activity.kilojoules} KJ
              </div>
            </div>
          )}
          {activity.average_watts && (
            <div className="flex flex-col lg:flex-row w-full justify-between items-center lg:gap-5">
              <div className="text-material-400 text-sm w-max">
                Average watts
              </div>
              <div className="w-max text-sm lg:text-base">
                {activity.average_watts} W
              </div>
            </div>
          )}
          {activity.max_watts && (
            <div className="flex flex-col lg:flex-row w-full justify-between items-center lg:gap-5">
              <div className="text-material-400 text-sm w-max">Max watts</div>
              <div className="w-max text-sm lg:text-base">
                {activity.max_watts} W
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default ActivityListItem;
