import { pLimit } from "https://deno.land/x/p_limit@v1.0.0/mod.ts";
import { ChartBars, getChartBars } from "../utils/getChartBars.ts";

// use strategy results, get daily/5min data for chart creation
export async function getChartData<T extends Array<any>>(
  results: T
): Promise<Array<ChartBars>> {
  console.log("getting chart data..");

  const limit = pLimit(50);

  console.log("");
  console.log("-- done --");

  return await Promise.all(
    results.map(({ ticker, time }) => limit(() => getChartBars(ticker, time)))
  );
}
