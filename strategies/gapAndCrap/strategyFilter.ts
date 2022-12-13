import { FilteredResult } from "./types.ts";

export type StrategyFilter = (data: FilteredResult) => number | boolean | null;

export const strategyTickerQuery =
  'select * from "TickerDetail" where float <= 30000000 and "marketCap" <= 200000000';

export const strategyFilter: StrategyFilter = (data: FilteredResult) => {
  return (
    data &&
    data.volume &&
    data.volume >= 4000000 &&
    data.close &&
    data.close >= 3 &&
    data.gap &&
    data.gap >= 60
  );
};
