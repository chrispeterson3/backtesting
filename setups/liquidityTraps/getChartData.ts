import { pLimit } from "https://deno.land/x/p_limit@v1.0.0/mod.ts";
import { getDetailedChartData } from "./utils/getDetailedChartData.ts";

// use strategy results, get daily/5min data for chart creation
export async function getChartData(strategyData: any) {
  try {
    console.log("getting strategy detailed bar data..");
    console.log("...");

    const limit = pLimit(50);

    const barData = await Promise.all(
      strategyData.map(({ ticker, t }: any) =>
        limit(() => getDetailedChartData(ticker, t))
      )
    );

    console.log("-- complete --");

    return barData;
  } catch (error) {
    console.log("getResultsData() error");
    console.log(error);
  }
}