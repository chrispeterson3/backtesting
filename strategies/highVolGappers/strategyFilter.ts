import { FilteredResult } from "./types.ts";

export type StrategyFilter = (data: FilteredResult) => number | boolean | null;

export const strategyFilter: StrategyFilter = (data: FilteredResult) => {
  return (
    data &&
    data.volume &&
    data.volume >= 5000000 &&
    data.close &&
    data.close >= 1 &&
    data.floatRotation &&
    data.floatRotation >= 4 &&
    data.gap &&
    data.gap >= 20
  );
};
