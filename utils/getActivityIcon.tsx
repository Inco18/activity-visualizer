import { SportType } from "@/types/strava/SportType";
import { MdDirectionsBike } from "react-icons/md";
import { GiRunningShoe } from "react-icons/gi";

export const getActivityIcon = (
  sportType: SportType
): JSX.Element | undefined => {
  switch (sportType) {
    case "Ride":
    case "GravelRide":
    case "MountainBikeRide":
    case "VirtualRide":
      return <MdDirectionsBike />;
    case "Run":
      return <GiRunningShoe />;
    default:
      <></>;
      break;
  }
};
