import tickerData from "./data/tickers.json" assert { type: "json" };
import { TickerData } from "../../types.ts";
import { getStrategyBars, StrategyBarsResult } from "./getStrategyBars.ts";
import { getChartData } from "../../strategy/getChartData.ts";
import {
  getPriceAction,
  PriceActionData,
} from "../../strategy/getPriceAction.ts";
import { ChartResponse, createCharts } from "../../strategy/createCharts.ts";
import { strategyFilter } from "./strategyFilter.ts";
import { strategyName } from "./mod.ts";
import { resultsMapper } from "./resultsMapper.ts";
import { FilteredStrategyResult } from "./types.ts";

const { from, to } = { from: "2022-12-22", to: "2022-12-31" };

export async function orchestrateStrategy(): Promise<
  Array<FilteredStrategyResult>
> {
  // get filtered strategy daily bars
  const strategyBars = (
    await getStrategyBars({
      tickers: tickerData,
      from,
      to,
    })
  ).filter(strategyFilter);

  // get daily/5min chart data to build charts
  const chartData = await getChartData(strategyBars);

  // create charts
  const charts = (await createCharts(chartData)).reduce<{
    [key: string]: ChartResponse;
  }>((prev, curr) => ({ ...prev, [curr.strategyId]: curr }), {});

  // get 5min price action for intraday analysis
  const priceAction = (await getPriceAction(strategyBars, 5)).reduce<{
    [key: string]: PriceActionData;
  }>((prev, curr) => ({ ...prev, [curr.strategyId]: curr }), {});

  // merge stratey data and map intraday analysis
  const results = resultsMapper(strategyBars, priceAction, charts);

  Deno.writeTextFile(
    `./strategies/${strategyName}/data/results_${from}_${to}.json`,
    JSON.stringify(results)
  );

  return results;
}
