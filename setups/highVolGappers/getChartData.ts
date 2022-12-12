import { pLimit } from "https://deno.land/x/p_limit@v1.0.0/mod.ts";
import {
  getChartCreationData,
  ChartBars,
} from "./utils/getChartCreationData.ts";
import { StrategyResult } from "./utils/mapResults.ts";

// use strategy results, get daily/5min data for chart creation
export async function getChartData(
  strategyResult: Array<StrategyResult>
): Promise<Array<ChartBars>> {
  try {
    console.log("getting strategy detailed bar data..");
    console.log("...");

    const limit = pLimit(50);

    const barData = await Promise.all(
      strategyResult.map(({ ticker, time }) =>
        limit(() => getChartCreationData(ticker, time))
      )
    );

    console.log("-- complete --");

    return barData;
  } catch (error) {
    console.log("getResultsData() error");
    throw Error(error);
  }
}
