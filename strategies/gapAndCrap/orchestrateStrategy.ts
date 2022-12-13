import data from "./data/tickers.json" assert { type: "json" };
import { TickerData } from "../../types.ts";

import {
  getStrategyBars,
  getFilteredStrategyResults,
  getChartData,
  getPriceAction,
  createCharts,
} from "../../strategy/mod.ts";
import { strategyMapper, StrategyMapper } from "./strategyMapper.ts";
import { strategyFilter, StrategyFilter } from "./strategyFilter.ts";
import { FilteredResult } from "./types.ts";
import { backtestMapper } from "./backtestMapper.ts";

export async function orchestrateStrategy(from: string, to: string) {
  const tickers = data as Array<TickerData>;

  const strategyBars = await getStrategyBars({
    tickers: data.map(({ ticker }) => ticker),
    from,
    to,
  });

  const filteredStrategyData = getFilteredStrategyResults<
    StrategyMapper,
    StrategyFilter,
    Array<FilteredResult>
  >(tickers, strategyBars, strategyMapper, strategyFilter);

  const chartData = await getChartData<Array<FilteredResult>>(
    filteredStrategyData
  );

  const priceAction = await getPriceAction<Array<FilteredResult>>(
    filteredStrategyData,
    5
  );

  const charts = await createCharts(chartData);
  const results = backtestMapper(filteredStrategyData, priceAction, charts);

  Deno.writeTextFile(
    `./strategies/gapAndCrap/data/results.json`,
    JSON.stringify(results)
  );
}
