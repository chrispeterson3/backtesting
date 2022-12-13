import { FilteredResult } from "./types.ts";

export type StrategyFilter = (data: FilteredResult) => number | boolean | null;

export const strategyFilter: StrategyFilter = (data: FilteredResult) => {
  return true;
};
