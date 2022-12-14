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
  strategyMapper: (
    tickerData: Array<TickerData>,
    strategyBars: Array<StrategyBarsResult>
  ) => any;
  strategyFilter: (filter: any) => any;
  resultsMapper: (
    filteredStrategyData: Array<any>,
    priceAction: Array<PriceActionData>,
    charts: Array<ChartResponse>
  ) => any;
};

export async function orchestrateStrategy<T>({
  tickerData,
  from,
  to,
  strategyMapper,
  strategyFilter,
  resultsMapper,
  fileName,
}: OrchestrateStrategyData): Promise<T> {
  const strategyBars = await getStrategyBars({
    tickers: tickerData.map(({ ticker }) => ticker),
    from,
    to,
  });

  const filteredStrategyData = strategyMapper(tickerData, strategyBars).filter(
    strategyFilter
  );

  const chartData = await getChartData(filteredStrategyData);

  const priceAction = await getPriceAction(filteredStrategyData, 5);

  const charts = await createCharts(chartData);
  const results = resultsMapper(filteredStrategyData, priceAction, charts);

  Deno.writeTextFile(`${fileName}_${from}_${to}.json`, JSON.stringify(results));

  return results;
}
