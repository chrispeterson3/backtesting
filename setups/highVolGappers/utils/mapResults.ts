import { IAggsResults } from "../../../../polygon_io_client/mod.ts";
import type { Nullable } from "../../../types.ts";

export type StrategyResult = {
  ticker: string;
  strategyId: string;

  // o/h/l/c
  open: Nullable<number>;
  high: Nullable<number>;
  low: Nullable<number>;
  close: Nullable<number>;
  time: Nullable<number>;
  float: Nullable<number>;
  volume: Nullable<number>;

  // calculated data
  change: Nullable<number>;
  gap: Nullable<number>;
  range: Nullable<number>;
  floatRotation: Nullable<number>;
  dayChange: Nullable<number>;
  closedRed: boolean;

  // prev/next day data
  nextDayLow: Nullable<number>;
  nextDayHigh: Nullable<number>;
  nextDayVolume: Nullable<number>;
  nextDayGap: Nullable<number>;
  followingRedDay: boolean;
};

export function mapResults(ticker: string | undefined, float: number | null) {
  return function (
    result: IAggsResults,
    index: number,
    dataset: Array<IAggsResults>
  ): StrategyResult {
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
    const { c: close, o: open } = result;

    return {
      ticker: ticker ?? "",
      strategyId: `${ticker}-${result.t}`,

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
  };
}
