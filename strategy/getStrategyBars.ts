import { pLimit } from "https://deno.land/x/p_limit@v1.0.0/mod.ts";
import { IAggs } from "../../polygon_io_client/mod.ts";
import { getBars } from "../utils/getBars.ts";

type StrategyBarsData = {
  tickers: Array<string>;
  from: string;
  to: string;
};

type StrategyBarsResult = {};

// gets ticker bars for a given strategy
// throttles calls to Polygon.io
export async function getStrategyBars({
  tickers,
  from,
  to,
}: StrategyBarsData): Promise<IAggs[]> {
  const limit = pLimit(100);
  const results = (await Promise.all(
    tickers.map((ticker) => limit(() => getBars({ ticker, from, to })))
  )).flat();

  return results.map(result => ({
    ticker: result.ticker,
    data: result.results?.map(d => ({
      ...d,
      strategyId: `${}`
    })) ?? [],
  }))
}
