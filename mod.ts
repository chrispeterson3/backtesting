import {
  getChartData,
  getStrategyData,
  createCharts,
  mergeData,
} from "./setups/liquidityTraps/mod.ts";

const strategyData = await getStrategyData("2016-12-31", "2022-12-31");
const chartData = await getChartData(strategyData);
const charts = await createCharts(chartData);
const mergedData = mergeData(strategyData, charts);

console.log(mergedData);

Deno.writeTextFile(
  `./setups/liquidityTraps/data/liquidityTraps-dataset.json`,
  JSON.stringify(mergedData)
);
