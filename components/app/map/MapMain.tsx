"use client";
import { SummaryActivity } from "@/types/strava/SummaryActivity";
import React, { useState } from "react";
import ActivityList, { sortOptions } from "./ActivityList";
import { sortActivities } from "@/utils/helpers";

export type SortByType = {
  id: number;
  value: string;
  type: string;
  name: string;
};

export type FiltersType = {
  value: string;
  from?: string | number;
  to?: string | number;
  equals?: any;
}[];

type Props = {
  activities: SummaryActivity[];
};

const MapMain = ({ activities }: Props) => {
  const [data, setData] = useState(activities);
  const [sortBy, setSortBy] = useState<SortByType>(sortOptions[0]);
  const [filters, setFilters] = useState<FiltersType>();
  const filtered = data;
  const sorted = sortActivities(filtered, sortBy);
  return (
    <main className="flex-1 flex flex-col lg:flex-row h-full w-full">
      <ActivityList
        displayedActivities={sorted}
        allActivities={data}
        sortBy={sortBy}
        setSortBy={setSortBy}
        filters={filters}
        setFilters={setFilters}
      />
    </main>
  );
};

export default MapMain;
