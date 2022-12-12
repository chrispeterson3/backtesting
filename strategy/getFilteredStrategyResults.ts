import { TickerData } from "../types.ts";
import { StrategyBarsResult } from "./getStrategyBars.ts";

export function getFilteredStrategyResults<T extends Function, U, V>(
  tickerData: Array<TickerData>,
  strategyBars: Array<StrategyBarsResult>,
  mapper: T,
  filter: U
): V {
  const results = mapper(tickerData, strategyBars);

  return results.filter(filter);
  // return results;
}
