"use client";
import { SummaryActivity } from "@/types/strava/SummaryActivity";
import React, { useMemo, useState } from "react";
import ActivityList, { sortOptions } from "./ActivityList";
import { sortActivities } from "@/utils/helpers";
import Map from "./Map";
import { Console } from "console";

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
  const [selected, setSelected] = useState<number>();
  const [prevSelected, setPrevSelected] = useState<number>();
  const [isActivityListHidden, setIsActivityListHidden] = useState(false);
  const filtered = data;
  const sorted = useMemo(() => sortActivities(filtered, sortBy), [data]);
  return (
    <main className="flex-1 flex flex-col lg:flex-row h-full w-full">
      <ActivityList
        displayedActivities={sorted}
        allActivities={data}
        sortBy={sortBy}
        setSortBy={setSortBy}
        filters={filters}
        setFilters={setFilters}
        selected={selected}
        setSelected={setSelected}
        prevSelected={prevSelected}
        setPrevSelected={setPrevSelected}
        isHidden={isActivityListHidden}
        setIsHidden={setIsActivityListHidden}
      />
      <Map
        displayedActivities={sorted}
        selected={selected}
        setSelected={setSelected}
        prevSelected={prevSelected}
        setPrevSelected={setPrevSelected}
        isActivityListHidden={isActivityListHidden}
      />
    </main>
  );
};

export default MapMain;
