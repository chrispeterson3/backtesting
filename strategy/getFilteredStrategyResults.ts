import { TickerData } from "../types.ts";
import { StrategyBarsResult } from "./getStrategyBars.ts";

export function getFilteredStrategyResults<T extends Function, U, V>(
  tickers: Array<TickerData>,
  strategyBars: Array<StrategyBarsResult>,
  mapper: T,
  filter: U
): V {
  console.log("filtering strategy results..");
  const results = mapper(tickers, strategyBars);
  console.log("");
  console.log("-- done --");
  return results.filter(filter);
}
