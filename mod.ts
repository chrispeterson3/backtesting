import data from "./setups/highVolGappers/data/tickers.json" assert { type: "json" };
import { TickerData } from "./types.ts";

import {
  getStrategyBars,
  getFilteredStrategyResults,
  getChartData,
  getPriceAction,
  createCharts,
} from "./strategy/mod.ts";
import {
  strategyMapper,
  backtestMapper,
  strategyFilter,
  StrategyMapper,
  StrategyFilter,
  FilteredResult,
} from "./setups/highVolGappers/mod.ts";

// !! https://deno.land/x/trading_signals@3.6.1

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

console.log(results);

Deno.writeTextFile(
  `./setups/highVolGappers/data/highVolGappers-dataset-refactored.json`,
  JSON.stringify(results)
);
