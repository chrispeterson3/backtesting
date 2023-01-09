import tickerData from "./data/tickers.json" assert { type: "json" };
import { writeCSV } from "https://deno.land/x/flat/mod.ts";
import { getStrategyBars, StrategyBarsResult } from "./getStrategyBars.ts";
import { getChartData } from "../../strategy/getChartData.ts";
import {
  getPriceAction,
  PriceActionData,
} from "../../strategy/getPriceAction.ts";
import { ChartResponse, createCharts } from "../../strategy/createCharts.ts";
import { strategyFilter } from "./strategyFilter.ts";
import { strategyPath } from "./mod.ts";
import { resultsMapper } from "./resultsMapper.ts";
import { FilteredStrategyResult } from "./types.ts";

const { from, to } = { from: "2023-01-03", to: "2023-12-31" };

export async function orchestrateStrategy(): Promise<
  Array<FilteredStrategyResult>
> {
  // get filtered strategy daily bars
  console.log("getting strategy daily bars...");
  const strategyBars = (
    await getStrategyBars({
      tickers: tickerData,
      from,
      to,
    })
  ).filter(strategyFilter);
  console.log("-- done --");
  console.log("");

  // get daily/5min chart data to build charts
  console.log("getting chart data..");
  const chartData = await getChartData(strategyBars);
  console.log("-- done --");
  console.log("");

  // create charts
  console.log("creating charts..");
  const charts = (await createCharts(chartData)).reduce<{
    [key: string]: ChartResponse;
  }>((prev, curr) => ({ ...prev, [curr.strategyId]: curr }), {});
  console.log("-- done --");
  console.log("");

  // get 5min price action for intraday analysis
  console.log("getting price action data..");
  const priceAction = (await getPriceAction(strategyBars, 5)).reduce<{
    [key: string]: PriceActionData;
  }>((prev, curr) => ({ ...prev, [curr.strategyId]: curr }), {});
  console.log("-- done --");
  console.log("");

  // merge stratey data and map intraday analysis
  console.log("merging data..");
  const results = resultsMapper(strategyBars, priceAction, charts);
  console.log("");
  console.log("-- done --");

  await writeCSV(`${strategyPath}/results_${from}_${to}.csv`, results);

  return results;
}
