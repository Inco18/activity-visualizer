"use client";
import { getActivityIcon } from "@/utils/getActivityIcon";
import { Dialog, Listbox, Transition } from "@headlessui/react";
import Slider from "rc-slider";
import "rc-slider/assets/index.css";
import React, { Fragment, useState } from "react";
import { IoClose } from "react-icons/io5";

type Props = { isOpen: boolean; onClose: () => void; distanceRange: number[] };

type activityType = {
  id: number;
  name: string;
  value: string | undefined;
  icon?: JSX.Element | undefined;
};

const activityTypes: activityType[] = [
  { id: 1, name: "All", value: undefined },
  { id: 2, name: "Ride", value: "Ride", icon: getActivityIcon("Ride") },
  { id: 3, name: "Run", value: "Run", icon: getActivityIcon("Run") },
];

const FiltersModal = ({ isOpen, onClose, distanceRange }: Props) => {
  const [date, setDate] = useState<{
    from: string | undefined;
    to: string | undefined;
  }>({
    from: undefined,
    to: undefined,
  });
  const [type, setType] = useState<activityType>(activityTypes[0]);
  const [distance, setDistance] = useState<number | number[]>(distanceRange);

  const handleCloseDiscard = () => {
    setDate({
      from: undefined,
      to: undefined,
    });
    setType(activityTypes[0]);
    setDistance(distanceRange);
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
          leaveTo="opacity-0"
        >
          <div
            className="fixed inset-0 bg-black/40 backdrop-blur-[1px] z-[199]"
            aria-hidden="true"
          />
        </Transition.Child>
        <Transition.Child
          as={Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 flex w-screen items-center justify-center p-4 z-[200]">
            <Dialog.Panel className="bg-dark-700 p-3 rounded-md relative min-w-72">
              <div
                onClick={handleCloseDiscard}
                className="absolute right-1 top-1 text-xl hover:bg-dark-900 rounded-full cursor-pointer p-1"
              >
                <IoClose />
              </div>
              <Dialog.Title className="text-xl font-medium text-center">
                Filter activities
              </Dialog.Title>

              <div className="flex flex-col items-center gap-2">
                <div className="flex flex-wrap gap-5">
                  <div className="flex flex-col flex-1 items-center text-lg">
                    Date
                    <div className="flex gap-2 w-full">
                      <label className="flex flex-col text-sm flex-1">
                        From:
                        <input
                          type="date"
                          name="from"
                          max={date.to}
                          onChange={(e) =>
                            setDate((prev) => {
                              return { to: prev?.to, from: e.target.value };
                            })
                          }
                          className="bg-dark-300 p-2 w-full relative rounded-md text-sm lg:text-base text-white hover:bg-dark-50 transition-colors"
                        />
                      </label>
                      <label className="flex flex-col text-sm flex-1">
                        To:
                        <input
                          type="date"
                          name="to"
                          min={date.from}
                          onChange={(e) =>
                            setDate((prev) => {
                              return { from: prev?.from, to: e.target.value };
                            })
                          }
                          className="bg-dark-300 p-2 w-full relative rounded-md text-sm lg:text-base text-white hover:bg-dark-50 transition-colors"
                        />
                      </label>
                    </div>
                  </div>
                  <div className="flex flex-col flex-1 items-center text-lg">
                    Type
                    <Listbox value={type} onChange={setType}>
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
                            leaveTo="opacity-0"
                          >
                            <Listbox.Options className="absolute bg-dark-300 rounded-md z-30 w-full mt-1 overflow-hidden text-sm lg:text-base">
                              {activityTypes.map((activityType) => (
                                <Listbox.Option
                                  key={activityType.id}
                                  value={activityType}
                                  className={({ selected }) =>
                                    `p-2 cursor-pointer flex items-center gap-2 hover:bg-dark-800 ${
                                      selected ? "bg-dark-50" : ""
                                    }`
                                  }
                                >
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
                        {Array.isArray(distance) ? distance[0] : distance} km -{" "}
                        {Array.isArray(distance) ? distance[1] : distance} km
                      </p>
                      <Slider
                        range
                        onChange={(val) => setDistance(val)}
                        value={distance}
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
