import { FilteredResult } from "./types.ts";

export type StrategyFilter = (data: FilteredResult) => number | boolean | null;

// general query/filters
export const strategyTickerQuery =
  'select * from "TickerDetail" where "marketCap" <= 1000000000';

export const strategyFilter: StrategyFilter = (data: FilteredResult) => {
  return (
    data &&
    data.volume &&
    data.volume >= 5000000 &&
    data.close &&
    data.close >= 1 &&
    data.gap &&
    data.gap >= 20
  );
};

// high vol query/fitlers
/*
export const strategyTickerQuery =
  'select * from "TickerDetail" where float <= 25000000 and "marketCap" <= 1000000000';

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
*/

// gap and crap query/filters
/*
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
*/
