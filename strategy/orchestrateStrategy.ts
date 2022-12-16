import { TickerData } from "../types.ts";
import { getStrategyBars, StrategyBarsResult } from "./getStrategyBars.ts";
import { getChartData } from "./getChartData.ts";
import { getPriceAction, PriceActionData } from "./getPriceAction.ts";
import { ChartResponse, createCharts } from "./createCharts.ts";

type OrchestrateStrategyData = {
  tickerData: Array<TickerData>;
  from: string;
  to: string;
  fileName: string;
  strategyFilter: (filter: any) => any;
  resultsMapper: (
    filteredStrategyData: Array<any>,
    priceAction: { [key: string]: PriceActionData },
    charts: { [key: string]: ChartResponse }
  ) => any;
};

export async function orchestrateStrategy<T>({
  tickerData,
  from,
  to,
  strategyFilter,
  resultsMapper,
  fileName,
}: OrchestrateStrategyData): Promise<T> {
  const strategyBars = (
    await getStrategyBars({
      tickers: tickerData,
      from,
      to,
    })
  ).filter(strategyFilter);

  const chartData = await getChartData(strategyBars);

  const priceAction = (await getPriceAction(strategyBars, 5)).reduce<{
    [key: string]: PriceActionData;
  }>((prev, curr) => ({ ...prev, [curr.strategyId]: curr }), {});

  const charts = (await createCharts(chartData)).reduce<{
    [key: string]: ChartResponse;
  }>((prev, curr) => ({ ...prev, [curr.strategyId]: curr }), {});

  const results = resultsMapper(strategyBars, priceAction, charts);

  Deno.writeTextFile(`${fileName}_${from}_${to}.json`, JSON.stringify(results));

  return results;
}
