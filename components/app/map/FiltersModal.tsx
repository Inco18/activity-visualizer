"use client";
import { getActivityIcon } from "@/utils/getActivityIcon";
import { Dialog, Listbox, Transition } from "@headlessui/react";
import Slider from "rc-slider";
import "rc-slider/assets/index.css";
import React, { Fragment, useState } from "react";
import { IoClose } from "react-icons/io5";
import { FiltersType } from "./MapMain";
import { useActivities } from "@/context/ActivitiesContext";
import { dateToInputTypeDate } from "@/utils/helpers";

type Props = {
  isOpen: boolean;
  onClose: () => void;
};

type activityType = {
  id: number;
  name: string;
  value: string | null;
  icon?: JSX.Element | undefined;
};

const activityTypes: activityType[] = [
  { id: 1, name: "All", value: null },
  { id: 2, name: "Ride", value: "Ride", icon: getActivityIcon("Ride") },
  { id: 3, name: "Run", value: "Run", icon: getActivityIcon("Run") },
];

const FiltersModal = ({ isOpen, onClose }: Props) => {
  const { filters, setFilters, allActivities } = useActivities();
  const type =
    activityTypes.find((el) => el.value === filters.sport_type?.equals) ||
    activityTypes[0];
  const distanceRange = [
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
  ];
  const activitiesSortedByDate = allActivities.toSorted((a, b) => {
    return new Date(a.start_date).getTime() - new Date(b.start_date).getTime();
  });
  const dates: {
    [key: number]: { label: string; style: React.CSSProperties };
  } = {};
  for (let i = 0; i < activitiesSortedByDate.length; i++) {
    dates[
      new Date(
        new Date(activitiesSortedByDate[i].start_date).toDateString()
      ).getTime()
    ] = {
      label: new Date(
        activitiesSortedByDate[i].start_date
      ).toLocaleDateString(),
      style:
        i === 0
          ? {
              color: "white",
              paddingLeft: "2rem",
            }
          : i === activitiesSortedByDate.length - 1
          ? {
              color: "white",
              paddingRight: "2rem",
            }
          : { display: "none" },
    };
  }

  const handleCloseDiscard = () => {
    onClose();
  };

  return (
    <Transition show={isOpen} as={Fragment}>
      <Dialog onClose={handleCloseDiscard}>
        <Transition.Child
          as={Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0">
          <div
            className="fixed inset-0 bg-black/40 z-[1990]"
            aria-hidden="true"
          />
        </Transition.Child>
        <Transition.Child
          as={Fragment}
          enter="ease-out duration-300"
          enterFrom="-translate-x-96"
          enterTo="translate-x-0"
          leave="ease-in duration-200"
          leaveFrom="translate-x-0"
          leaveTo="-translate-x-96">
          <div className="fixed left-0 top-0 flex items-center justify-center z-[2000] ">
            <Dialog.Panel className="bg-dark-700 p-3 rounded-md relative min-w-96">
              <div
                onClick={handleCloseDiscard}
                className="absolute right-1 top-1 text-xl hover:bg-dark-900 rounded-full cursor-pointer p-1">
                <IoClose />
              </div>
              <Dialog.Title className="text-xl font-medium text-center">
                Filter activities
              </Dialog.Title>

              <div className="flex flex-col items-center gap-2">
                <div className="flex flex-col flex-1 items-center text-lg">
                  Date
                  <div className="flex gap-2 w-full mb-2">
                    <label className="flex flex-col text-sm flex-1">
                      From:
                      <input
                        type="date"
                        name="from"
                        max={filters.start_date?.to || undefined}
                        value={
                          filters.start_date?.from
                            ? dateToInputTypeDate(
                                new Date(filters.start_date?.from as string)
                              )
                            : dateToInputTypeDate(
                                new Date(activitiesSortedByDate[0].start_date)
                              )
                        }
                        onChange={(e) =>
                          setFilters((prev) => {
                            return {
                              ...prev,
                              start_date: {
                                from: new Date(e.target.value).toDateString(),
                                to: prev.start_date?.to || undefined,
                              },
                            };
                          })
                        }
                        className="bg-dark-300 p-2 w-full relative rounded-md text-sm lg:text-base text-white hover:bg-dark-50 transition-colors text-left"
                      />
                    </label>
                    <label className="flex flex-col text-sm flex-1">
                      To:
                      <input
                        type="date"
                        name="to"
                        value={
                          filters.start_date?.to
                            ? dateToInputTypeDate(
                                new Date(filters.start_date?.to as string)
                              )
                            : dateToInputTypeDate(
                                new Date(
                                  activitiesSortedByDate[
                                    activitiesSortedByDate.length - 1
                                  ].start_date
                                )
                              )
                        }
                        min={filters.start_date?.from || undefined}
                        onChange={(e) =>
                          setFilters((prev) => {
                            return {
                              ...prev,
                              start_date: {
                                from: prev.start_date?.from || undefined,
                                to: new Date(e.target.value).toDateString(),
                              },
                            };
                          })
                        }
                        className="bg-dark-300 p-2 w-full relative rounded-md text-sm lg:text-base text-white hover:bg-dark-50 transition-colors"
                      />
                    </label>
                  </div>
                  <Slider
                    range
                    onChange={(val) =>
                      setFilters((prev) => {
                        return {
                          ...prev,
                          start_date: {
                            from: Array.isArray(val)
                              ? new Date(val[0]).toDateString()
                              : new Date(val).toDateString(),
                            to: Array.isArray(val)
                              ? new Date(val[1]).toDateString()
                              : new Date(val).toDateString(),
                          },
                        };
                      })
                    }
                    value={[
                      new Date(filters.start_date?.from as string).getTime() ||
                        new Date(
                          activitiesSortedByDate[0].start_date
                        ).getTime(),
                      new Date(filters.start_date?.to as string).getTime() ||
                        new Date(
                          activitiesSortedByDate[
                            activitiesSortedByDate.length - 1
                          ].start_date
                        ).getTime(),
                    ]}
                    min={new Date(
                      activitiesSortedByDate[0].start_date
                    ).getTime()}
                    max={new Date(
                      activitiesSortedByDate[
                        activitiesSortedByDate.length - 1
                      ].start_date
                    ).getTime()}
                    step={null}
                    defaultValue={[
                      new Date(activitiesSortedByDate[0].start_date).getTime(),
                      new Date(
                        activitiesSortedByDate[
                          activitiesSortedByDate.length - 1
                        ].start_date
                      ).getTime(),
                    ]}
                    marks={dates}
                    className="[&>.rc-slider-rail]:bg-dark-300 [&>.rc-slider-track]:bg-strava [&_.rc-slider-dot]:bg-dark-50 [&_.rc-slider-dot]:border-dark-50 [&_.rc-slider-handle]:border-strava [&_.rc-slider-handle]:bg-dark-50 [&_.rc-slider-handle]:opacity-100 [&_.rc-slider-handle-dragging]:!border-strava [&_.rc-slider-handle-dragging]:!shadow-[0_0_0_5px] [&_.rc-slider-handle-dragging]:!shadow-strava/80 [&_.rc-slider-handle:focus-visible]:!border-strava [&_.rc-slider-handle:focus-visible]:!shadow-[0_0_0_5px] [&_.rc-slider-handle:focus-visible]:!shadow-strava/80 [&_.rc-slider-handle:hover]:border-strava [&_.rc-slider-handle:hover]:border-opacity-50"
                  />
                </div>
                <div className="flex flex-col flex-1 items-center text-lg">
                  Type
                  <Listbox
                    value={filters.sport_type?.equals || activityTypes[0].value}
                    onChange={(val) =>
                      setFilters((prev) => {
                        return { ...prev, sport_type: { equals: val } };
                      })
                    }>
                    <div className="flex flex-col w-full min-w-48 mt-auto">
                      <div className="relative w-full">
                        <Listbox.Button className="bg-dark-300 p-2 w-full relative rounded-md text-sm lg:text-base text-white hover:bg-dark-50 transition-colors flex items-center gap-2 justify-center">
                          {type.icon && <div>{type.icon}</div>}
                          {type.name}
                        </Listbox.Button>
                        <Transition
                          as={Fragment}
                          leave="transition ease-in duration-100"
                          leaveFrom="opacity-100"
                          leaveTo="opacity-0">
                          <Listbox.Options className="absolute bg-dark-300 rounded-md z-30 w-full mt-1 overflow-hidden text-sm lg:text-base">
                            {activityTypes.map((activityType) => (
                              <Listbox.Option
                                key={activityType.id}
                                value={activityType.value}
                                className={({ selected }) =>
                                  `p-2 cursor-pointer flex items-center gap-2 hover:bg-dark-800 ${
                                    selected ? "bg-dark-50" : ""
                                  }`
                                }>
                                {activityType.icon && (
                                  <div>{activityType.icon}</div>
                                )}
                                {activityType.name}
                              </Listbox.Option>
                            ))}
                          </Listbox.Options>
                        </Transition>
                      </div>
                    </div>
                  </Listbox>
                </div>
                <div className="flex flex-col flex-1 items-center text-lg min-w-48">
                  Distance
                  <div className="pb-5 w-full mt-auto h-fit">
                    <p className="text-center text-sm mb-2">
                      {filters.distance?.from || distanceRange[0]} km -{" "}
                      {filters.distance?.to || distanceRange[1]} km
                    </p>
                    <Slider
                      range
                      onChange={(val) =>
                        setFilters((prev) => {
                          return {
                            ...prev,
                            distance: {
                              from: Array.isArray(val) ? val[0] : val,
                              to: Array.isArray(val) ? val[1] : val,
                            },
                          };
                        })
                      }
                      value={[
                        (filters.distance?.from as number) || distanceRange[0],
                        (filters.distance?.to as number) || distanceRange[1],
                      ]}
                      min={distanceRange[0]}
                      max={distanceRange[1]}
                      step={1}
                      defaultValue={distanceRange}
                      marks={{
                        [distanceRange[0]]: {
                          label: distanceRange[0] + " km",
                          style: {
                            color: "white",
                            paddingLeft: "1.3rem",
                          },
                        },
                        [distanceRange[1]]: {
                          label: distanceRange[1] + " km",
                          style: {
                            color: "white",
                            paddingRight: "1.3rem",
                            whiteSpace: "nowrap",
                          },
                        },
                      }}
                      className="[&>.rc-slider-rail]:bg-dark-300 [&>.rc-slider-track]:bg-strava [&_.rc-slider-dot]:bg-dark-50 [&_.rc-slider-dot]:border-dark-50 [&_.rc-slider-handle]:border-strava [&_.rc-slider-handle]:bg-dark-50 [&_.rc-slider-handle]:opacity-100 [&_.rc-slider-handle-dragging]:!border-strava [&_.rc-slider-handle-dragging]:!shadow-[0_0_0_5px] [&_.rc-slider-handle-dragging]:!shadow-strava/80 [&_.rc-slider-handle:focus-visible]:!border-strava [&_.rc-slider-handle:focus-visible]:!shadow-[0_0_0_5px] [&_.rc-slider-handle:focus-visible]:!shadow-strava/80 [&_.rc-slider-handle:hover]:border-strava [&_.rc-slider-handle:hover]:border-opacity-50"
                    />
                  </div>
                </div>
                <button className="bg-strava rounded-md px-7 py-2 hover:bg-opacity-80 transition-all">
                  Filter
                </button>
              </div>
            </Dialog.Panel>
          </div>
        </Transition.Child>
      </Dialog>
    </Transition>
  );
};

export default FiltersModal;
