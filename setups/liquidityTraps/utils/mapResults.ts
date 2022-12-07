import { IAggsResults } from "../../../../polygon_io_client/mod.ts";

export type MappedResult = {
  ticker: string;
  strategyId: string;
  float: number | null;
  pdh?: number; // previousDayHigh
  pdl?: number; // previousDayLow
  pdv?: number; // previousDayVolume
  ndl?: number; // nextDayLow
  ndh?: number; // nextDayHigh
  ndv?: number; // nextDayVolume
  followingRedDay?: boolean; // followingRedDay
  change?: number;
  dayChange?: number;
  range?: number;
  gap?: number;
  closedRed?: boolean;
  floatRotation?: number | null;
} & IAggsResults;

export function mapResults(ticker: string | undefined, float: number | null) {
  return function (
    result: IAggsResults,
    index: number,
    dataset: Array<IAggsResults>
  ): MappedResult {
    const next = index + 1;
    const prev = index - 1;
    const { c: pdc }: IAggsResults = dataset[prev] ?? {};
    const {
      h: ndh,
      l: ndl,
      v: ndv,
      o: ndo,
      c: ndc,
    }: IAggsResults = dataset[next] ?? {};
    const { c: close, o: open } = result;

    return {
      ...result,
      ticker: ticker ?? "",
      strategyId: `${ticker}-${result.t}`,
      float,
      t: result.t,
      ndh,
      ndl,
      ndv,
      followingRedDay: !!(ndo && ndc && ndc < ndo),
      change: close && pdc && ((close - pdc) / pdc) * 100,
      dayChange:
        result.c && result.o && ((result.c - result.o) / result.c) * 100,
      range: result.h && result.l && ((result.h - result.l) / result.h) * 100,
      gap: pdc && open && ((open - pdc) / pdc) * 100,
      closedRed: !!(open && close && close < open),
      floatRotation: float && result.v && result.v / float,
    };
  };
}
