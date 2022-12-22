import { StrategyBarsResult } from "./getStrategyBars.ts";

// general query/filters
export const strategyTickerQuery =
  'select * from "TickerDetail" where "marketCap" <= 1000000000';

export function strategyFilter(
  data: StrategyBarsResult
): number | boolean | null {
  return (
    data &&
    data.volume &&
    data.volume >= 5000000 &&
    data.close &&
    data.close >= 1 &&
    data.gap &&
    data.gap >= 18
  );
}
