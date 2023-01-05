import { pLimit } from "https://deno.land/x/p_limit@v1.0.0/mod.ts";
import {
  BaseAttributes,
  getBaseAttributes,
} from "../../strategy/getBaseAttributes.ts";
import { Nullable, TickerData } from "../../types.ts";
import { getBars } from "../../utils/getBars.ts";

type StrategyBarsData = {
  tickers: Array<TickerData>;
  from: string;
  to: string;
};

export type StrategyBarsResult = {
  float: Nullable<number>;
} & BaseAttributes;

// gets ticker bars for a given strategy
// throttles calls to Polygon.io
export async function getStrategyBars({
  tickers,
  from,
  to,
}: StrategyBarsData): Promise<Array<StrategyBarsResult>> {
  const limit = pLimit(100);

  const results = await Promise.all(
    tickers.map(({ ticker }) => limit(() => getBars({ ticker, from, to })))
  );

  const tickerFundamentals = tickers.reduce<{
    [key: string]: TickerData;
  }>((prev, curr) => ({ ...prev, [curr.ticker]: curr }), {});

  return results
    .map(
      (result) =>
        result.results?.map((dailyBar, currentDay, dailyBars) => {
          const ticker = result.ticker ?? "";
          const fundamentals = ticker ? tickerFundamentals[ticker] : null;
          const float = fundamentals?.float ?? null;

          return {
            ...getBaseAttributes(ticker, dailyBar, dailyBars, currentDay),
            float,
          };
        }) ?? []
    )
    .flat();
}
