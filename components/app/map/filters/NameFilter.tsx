import { useActivities } from "@/context/ActivitiesContext";
import React from "react";

const NameFilter = () => {
  const { filters, setFilters } = useActivities();
  return (
    <label className="flex flex-col flex-1 items-center text-lg w-full">
      Name:
      <input
        type="text"
        name="name"
        value={filters.name?.includes || ""}
        onChange={(e) =>
          setFilters((prev) => {
            return {
              ...prev,
              name: {
                includes: e.target.value,
              },
            };
          })
        }
        className="bg-dark-300 p-2 w-full relative rounded-md text-sm lg:text-base text-white hover:bg-dark-50 transition-colors text-left"
      />
    </label>
  );
};

export default NameFilter;
