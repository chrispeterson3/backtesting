import { pLimit } from "https://deno.land/x/p_limit@v1.0.0/mod.ts";
import { ChartBars, getChartBars } from "../utils/getChartBars.ts";

// use strategy results, get daily/5min data for chart creation
export async function getChartData<T extends Array<any>>(
  results: T
): Promise<Array<ChartBars>> {
  const limit = pLimit(50);

  return await Promise.all(
    results.map(({ ticker, time }) => limit(() => getChartBars(ticker, time)))
  );
}
