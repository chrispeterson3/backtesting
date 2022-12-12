import { ChartResponse } from "./createCharts.ts";
import { PriceActionData } from "./getPriceAction.ts";

export function getBacktestResults<T, U, V>(
  filteredStrategyData: T,
  priceAction: Array<PriceActionData>,
  charts: Array<ChartResponse>,
  backtestMapper: U
): Array<V> {
  return [];
}
