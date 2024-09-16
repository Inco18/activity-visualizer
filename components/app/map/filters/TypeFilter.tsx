import { useActivities } from "@/context/ActivitiesContext";
import { getActivityIcon } from "@/utils/getActivityIcon";
import { Listbox, Transition } from "@headlessui/react";
import React, { Fragment } from "react";

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

const TypeFilter = () => {
  const { filters, setFilters, allActivities } = useActivities();
  const type =
    activityTypes.find((el) => el.value === filters.sport_type?.equals) ||
    activityTypes[0];

  return (
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
                    {activityType.icon && <div>{activityType.icon}</div>}
                    {activityType.name}
                  </Listbox.Option>
                ))}
              </Listbox.Options>
            </Transition>
          </div>
        </div>
      </Listbox>
    </div>
  );
};

export default TypeFilter;
