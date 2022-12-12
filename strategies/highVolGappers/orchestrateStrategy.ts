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

export async function orchestrateStrategy() {
  const tickers = data as Array<TickerData>;

  const strategyBars = await getStrategyBars({
    tickers: data.map(({ ticker }) => ticker),
    from: "2016-12-31",
    to: "2022-12-31",
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
    `./setups/highVolGappers/data/highVolGappers-dataset.json`,
    JSON.stringify(results)
  );
}
