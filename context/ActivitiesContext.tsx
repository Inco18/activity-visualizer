import { sortOptions } from "@/components/app/map/ActivityList";
import { SummaryActivity } from "@/types/strava/SummaryActivity";
import { sortActivities } from "@/utils/helpers";
import {
  createContext,
  Dispatch,
  SetStateAction,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";

export type SortByType = {
  id: number;
  value: string;
  type: string;
  name: string;
};

export type FiltersType = {
  [key: string]: {
    from?: string | number;
    to?: string | number;
    equals?: any;
  };
};

type activitesContextType = {
  allActivities: SummaryActivity[];
  setAllActivities: Dispatch<SetStateAction<SummaryActivity[]>>;
  displayedActivities: SummaryActivity[];
  sortBy: SortByType;
  setSortBy: Dispatch<SetStateAction<SortByType>>;
  filters: FiltersType;
  setFilters: Dispatch<SetStateAction<FiltersType>>;
  selectedActivity: number | undefined;
  setSelectedActivity: Dispatch<SetStateAction<number | undefined>>;
  prevSelectedActivity: number | undefined;
  setPrevSelectedActivity: Dispatch<SetStateAction<number | undefined>>;
  isActivityListHidden: boolean;
  setIsActivityListHidden: Dispatch<SetStateAction<boolean>>;
};

const ActivitiesContext = createContext<activitesContextType | null>(null);

export const useActivities = () => {
  const activitiesContext = useContext(ActivitiesContext);
  if (!activitiesContext)
    throw new Error(
      "useActivities has to be used within <ActivitiesContext.Provider>"
    );
  return activitiesContext;
};

const ActivitiesProvider = ({ children }: { children: React.ReactNode }) => {
  const [allActivities, setAllActivities] = useState<SummaryActivity[]>([]);
  const [sortBy, setSortBy] = useState<SortByType>(sortOptions[0]);
  const [filters, setFilters] = useState<FiltersType>({});
  const [selectedActivity, setSelectedActivity] = useState<number>();
  const [prevSelectedActivity, setPrevSelectedActivity] = useState<number>();
  const [isActivityListHidden, setIsActivityListHidden] = useState(false);
  // Filter activities
  const filtered = useMemo(() => {
    setSelectedActivity(undefined);
    setPrevSelectedActivity(selectedActivity);
    return allActivities.filter((activity) => {
      let bool = true;
      // Loop through selected filters
      for (const [key, value] of Object.entries(filters)) {
        // Handle range filters
        if (value.to && value.from && activity[key as keyof SummaryActivity]) {
          const activityValue = activity[key as keyof SummaryActivity];
          // Handle date filter
          if (
            key === "start_date" &&
            (new Date(new Date(activityValue as string).toDateString()) <
              new Date(value.from) ||
              new Date(new Date(activityValue as string).toDateString()) >
                new Date(value.to))
          ) {
            bool = false;
          } else if (
            key === "distance" &&
            ((activityValue as number) < (value.from as number) * 1000 ||
              (activityValue as number) > (value.to as number) * 1000)
          ) {
            bool = false;
          }
        }

        if (value.equals && activity[key as keyof SummaryActivity]) {
          const activityValue = activity[key as keyof SummaryActivity];
          if (activityValue != value.equals) bool = false;
        }
      }
      return bool;
    });
  }, [allActivities, filters]);
  // Sort activities
  const sorted = useMemo(
    () => sortActivities(filtered, sortBy),
    [filtered, sortBy]
  );

  return (
    <ActivitiesContext.Provider
      value={{
        allActivities,
        setAllActivities,
        displayedActivities: sorted,
        sortBy,
        setSortBy,
        filters,
        setFilters,
        selectedActivity,
        setSelectedActivity,
        prevSelectedActivity,
        setPrevSelectedActivity,
        isActivityListHidden,
        setIsActivityListHidden,
      }}>
      {children}
    </ActivitiesContext.Provider>
  );
};

export default ActivitiesProvider;
