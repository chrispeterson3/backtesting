// import {
//   getChartData,
//   getStrategyData,
//   createCharts,
//   getPriceAction,
//   mergeData,
// } from "./setups/highVolGappers/mod.ts";
import data from "./setups/highVolGappers/data/tickers.json" assert { type: "json" };
import { TickerData } from "./types.ts";

import { getStrategyBars, getFilteredStrategyResults } from "./strategy/mod.ts";
import {
  mapper,
  filter,
  HighVolGapperMapper,
  HighVolGapperFilter,
  FilteredResult,
} from "./setups/highVolGappers/v2/mod.ts";

const strategyBars = await getStrategyBars({
  tickers: data.map(({ ticker }) => ticker),
  from: "2016-12-31",
  to: "2022-12-31",
});

const filteredStrategy = getFilteredStrategyResults<
  HighVolGapperMapper,
  HighVolGapperFilter,
  Array<FilteredResult>
>(data as Array<TickerData>, strategyBars, mapper, filter);

console.log(filteredStrategy);

// !! https://deno.land/x/trading_signals@3.6.1

// const strategyData = await getStrategyData("2016-12-31", "2022-12-31");
// const chartData = await getChartData(strategyData);
// const priceActionData = await getPriceAction(strategyData, 5);
// const charts = await createCharts(chartData);
// const mergedData = mergeData(strategyData, priceActionData, charts);

// Deno.writeTextFile(
//   `./setups/highVolGappers/data/highVolGappers-dataset.json`,
//   JSON.stringify(mergedData)
// );
