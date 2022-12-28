import { StrategyBarsResult } from "./getStrategyBars.ts";

// general query/filters
export const strategyTickerQuery =
  'select * from "TickerDetail" where "marketCap" >= 2000000000';

export function strategyFilter(
  data: StrategyBarsResult
): number | boolean | null {
  return (
    data &&
    data.high &&
    data.sma50 &&
    data.sma200 &&
    data.open &&
    data.volume &&
    data.averageVolume &&
    data.close &&
    data.volume >= 5000000 &&
    data.averageVolume >= 1000000 &&
    data.close >= 5 &&
    data.open < data.sma50 &&
    data.high > data.sma50 &&
    data.close < data.sma50 &&
    data.close < data.sma200
  );
}
