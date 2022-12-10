import { pLimit } from "https://deno.land/x/p_limit@v1.0.0/mod.ts";
import {
  getDetailedChartData,
  StrategyBars,
} from "./utils/getDetailedChartData.ts";
import { StrategyResult } from "./utils/mapResults.ts";

// use strategy results, get daily/5min data for chart creation
export async function getChartData(
  strategyData: Array<StrategyResult>
): Promise<Array<StrategyBars>> {
  try {
    console.log("getting strategy detailed bar data..");
    console.log("...");

    const limit = pLimit(50);

    const barData = await Promise.all(
      strategyData.map(({ ticker, time }) =>
        limit(() => getDetailedChartData(ticker, time))
      )
    );

    console.log("-- complete --");

    return barData;
  } catch (error) {
    console.log("getResultsData() error");
    throw Error(error);
  }
}
