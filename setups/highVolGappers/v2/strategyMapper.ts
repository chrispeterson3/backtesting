import { IAggsResults } from "../../../../polygon_io_client/mod.ts";
import { StrategyBarsResult } from "../../../strategy/getStrategyBars.ts";
import { TickerData } from "../../../types.ts";
import { FilteredResult } from "./types.ts";

export type StrategyMapper = (
  tickers: Array<TickerData>,
  strategyBars: Array<StrategyBarsResult>
) => Array<FilteredResult>;

export const strategyMapper: StrategyMapper = (tickers, strategyBars) => {
  return strategyBars.map((result, index, dataset) => {
    const tickerFundamentals = tickers.find((a) => a.ticker === result.ticker);

    const next = index + 1;
    const prev = index - 1;
    const { c: previousDayClose }: IAggsResults = dataset[prev] ?? {};
    const {
      h: nextDayHigh,
      l: nextDayLow,
      v: nextDayVolume,
      o: nextDayOpen,
      c: nextDayClose,
    }: IAggsResults = dataset[next] ?? {};
    const { c: close, o: open, ticker } = result;
    const float = tickerFundamentals?.float
      ? parseInt(tickerFundamentals.float)
      : null;

    return {
      ticker: ticker ?? "",
      strategyId: `${ticker}-${result.t}`,
      description: tickerFundamentals?.description ?? null,
      sector: tickerFundamentals?.sicDescription ?? null,

      // raw data points
      open: result.o ?? null,
      high: result.h ?? null,
      low: result.l ?? null,
      close: result.c ?? null,
      volume: result.v ?? null,
      float,
      time: result.t ?? null,
      closedRed: !!(open && close && close < open),
      floatRotation: (float && result.v && result.v / float) ?? null,

      // daily calculations
      change:
        (close &&
          previousDayClose &&
          ((close - previousDayClose) / previousDayClose) * 100) ??
        null,
      dayChange:
        (result.c && result.o && ((result.c - result.o) / result.c) * 100) ??
        null,
      range:
        (result.h && result.l && ((result.h - result.l) / result.h) * 100) ??
        null,
      gap:
        (previousDayClose &&
          open &&
          ((open - previousDayClose) / previousDayClose) * 100) ??
        null,

      // next day calculations
      nextDayGap:
        (result.c &&
          nextDayOpen &&
          ((nextDayOpen - result.c) / result.c) * 100) ??
        null,
      nextDayHigh: nextDayHigh ?? null,
      nextDayLow: nextDayLow ?? null,
      nextDayVolume: nextDayVolume ?? null,
      followingRedDay: !!(
        nextDayOpen &&
        nextDayClose &&
        nextDayClose < nextDayOpen
      ),
    };
  });
};
