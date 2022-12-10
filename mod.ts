import {
  getChartData,
  getStrategyData,
  createCharts,
  getPriceAction,
  mergeData,
} from "./setups/highVolGappers/mod.ts";

// !! https://deno.land/x/trading_signals@3.6.1

const strategyData = await getStrategyData("2016-12-31", "2022-12-31");
const chartData = await getChartData(strategyData);
const priceActionData = await getPriceAction(strategyData, 5);
const charts = await createCharts(chartData);
const mergedData = mergeData(strategyData, priceActionData, charts);

Deno.writeTextFile(
  `./setups/highVolGappers/data/highVolGappers-dataset.json`,
  JSON.stringify(mergedData)
);
