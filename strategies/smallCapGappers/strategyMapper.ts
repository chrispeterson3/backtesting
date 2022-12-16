import { StrategyBarsResult } from "../../strategy/getStrategyBars.ts";
import { TickerData } from "../../types.ts";
import { FilteredResult } from "./types.ts";

export type StrategyMapper = (
  tickers: Array<TickerData>,
  strategyBars: Array<StrategyBarsResult>
) => Array<FilteredResult>;

export const strategyMapper: StrategyMapper = (tickers, strategyBars) => {
  console.log("mapping strategy data..");

  const results = strategyBars.map((result) => {
    const tickerFundamentals = tickers.find((a) => a.ticker === result.ticker);
    const float = tickerFundamentals?.float ?? null;

    return {
      ticker: result.ticker ?? "",
      strategyId: `${result.ticker}-${result.t}`,
      description: tickerFundamentals?.description ?? null,
      sector: tickerFundamentals?.sicDescription ?? null,

      open: result.o ?? null,
      high: result.h ?? null,
      low: result.l ?? null,
      close: result.c ?? null,
      volume: result.v ?? null,
      float,
      time: result.t ?? null,
      closedRed: !!(result.o && result.c && result.c < result.o),
      floatRotation: (float && result.v && result.v / float) ?? null,

      change: result.change ?? null,
      dayChange: result.dayChange ?? null,
      range: result.range ?? null,
      gap: result.gap ?? null,

      nextDayGap: result.nextDayGap ?? null,
      nextDayHigh: result.ndh ?? null,
      nextDayLow: result.ndl ?? null,
      nextDayVolume: result.ndv ?? null,
      followingRedDay: !!(result.ndo && result.ndc && result.ndc < result.ndo),
    };
  });

  console.log("-- done --");
  console.log("");

  return results;
};
