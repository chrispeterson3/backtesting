import { TickerData } from "../types.ts";
import { StrategyBarsResult } from "./getStrategyBars.ts";

export function getFilteredStrategyResults<T extends Function, U, V>(
  tickers: Array<TickerData>,
  strategyBars: Array<StrategyBarsResult>,
  mapper: T,
  filter: U
): V {
  const results = mapper(tickers, strategyBars);
  return results.filter(filter);
}
