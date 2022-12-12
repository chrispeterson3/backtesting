import { pLimit } from "https://deno.land/x/p_limit@v1.0.0/mod.ts";
import { IAggsResults } from "../../polygon_io_client/mod.ts";
import { getBars } from "../utils/getBars.ts";

type StrategyBarsData = {
  tickers: Array<string>;
  from: string;
  to: string;
};

export type StrategyBarsResult = IAggsResults & {
  ticker: string;
  strategyId: string;
};

// gets ticker bars for a given strategy
// throttles calls to Polygon.io
export async function getStrategyBars({
  tickers,
  from,
  to,
}: StrategyBarsData): Promise<Array<StrategyBarsResult>> {
  const limit = pLimit(100);
  const results = await Promise.all(
    tickers.map((ticker) => limit(() => getBars({ ticker, from, to })))
  );

  return results
    .map(
      (result) =>
        result.results?.map((d) => ({
          ...d,
          ticker: result.ticker ?? "",
          strategyId: `${result.ticker}-${d.t}`,
        })) ?? []
    )
    .flat();
}
