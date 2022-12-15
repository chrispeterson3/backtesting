import { FilteredResult } from "./types.ts";

export type StrategyFilter = (data: FilteredResult) => number | boolean | null;

// general query/filters
export const strategyTickerQuery =
  'select * from "TickerDetail" where "marketCap" >= 2000000000';

export const strategyFilter: StrategyFilter = (data: FilteredResult) => {
  return (
    data &&
    data.volume &&
    data.change &&
    data.change >= 10 &&
    data.change <= 30 &&
    data.averageVolume &&
    data.volume * 2 >= data.averageVolume &&
    !data.closedRed &&
    data.close &&
    data.close >= 15
  );
};
