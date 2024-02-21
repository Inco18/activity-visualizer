import { SortByType } from "@/components/app/map/MapMain";
import { SummaryActivity } from "@/types/strava/SummaryActivity";

export const sortActivities = (data: SummaryActivity[], sortBy: SortByType) => {
  return data.toSorted((a, b) => {
    if (
      a[sortBy.value as keyof SummaryActivity]! <
      b[sortBy.value as keyof SummaryActivity]!
    ) {
      if (sortBy.type === "asc") return -1;
      else return 1;
    } else if (
      a[sortBy.value as keyof SummaryActivity]! ===
      b[sortBy.value as keyof SummaryActivity]!
    ) {
      return 0;
    } else {
      if (sortBy.type === "asc") return 1;
      else return -1;
    }
  });
};
