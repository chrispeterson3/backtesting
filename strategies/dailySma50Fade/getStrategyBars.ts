import { pLimit } from "https://deno.land/x/p_limit@v1.0.0/mod.ts";
import { average } from "https://deno.land/x/simplestatistics@v7.7.5/index.js";
import { ISmaResults } from "../../../polygon_io_client/rest/indicators/mod.ts";
import {
  getChange,
  getDayChange,
  getGap,
  getNextDayGap,
  getRange,
  getClosedRed,
  getFollowingRedDay,
  getAverageVolume,
} from "../../ta/mod.ts";
import { Nullable, TickerData } from "../../types.ts";
import { getBars } from "../../utils/getBars.ts";
import { getDailyBarsAndSmas } from "../../utils/getDailyBarsAndSmas.ts";
import { getSma } from "../../utils/getSma.ts";

type StrategyBarsData = {
  tickers: Array<TickerData>;
  from: string;
  to: string;
};

export type StrategyBarsResult = {
  ticker: string;
  strategyId: string;

  close: Nullable<number>;
  high: Nullable<number>;
  low: Nullable<number>;
  open: Nullable<number>;
  time: Nullable<number>;
  volume: Nullable<number>;
  vwap: Nullable<number>;
  sma50: Nullable<number>;
  sma200: Nullable<number>;

  gap: Nullable<number>;
  change: Nullable<number>;
  dayChange: Nullable<number>;
  range: Nullable<number>;
  nextDayGap: Nullable<number>;

  nextDayTime: Nullable<number>;
  nextDayOpen: Nullable<number>;
  nextDayHigh: Nullable<number>;
  nextDayLow: Nullable<number>;
  nextDayClose: Nullable<number>;
  nextDayVolume: Nullable<number>;

  averageVolume: Nullable<number>;
  closedRed: Nullable<boolean>;
  followingRedDay: Nullable<boolean>;
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
    tickers.map(({ ticker }) =>
      limit(() => getDailyBarsAndSmas({ ticker, from, to }))
    )
  );

  const tickerFundamentals = tickers.reduce<{
    [key: string]: TickerData;
  }>((prev, curr) => ({ ...prev, [curr.ticker]: curr }), {});

  const data = await Promise.all(
    results.map(async (result) => {
      const strategyResults = result.results ?? [];

      return strategyResults.map((d, index, dataset) => {
        const sma50 =
          result.smas50.results?.values?.find((v) => v.timestamp === d.t)
            ?.value ?? null;
        const sma200 =
          result.smas200.results?.values?.find((v) => v.timestamp === d.t)
            ?.value ?? null;

        const fundamentals = result.ticker
          ? tickerFundamentals[result.ticker]
          : null;

        const previousDayClose = dataset[index - 1]?.c ?? null;

        const nextDayTime = dataset[index + 1]?.t ?? null;
        const nextDayOpen = dataset[index + 1]?.o ?? null;
        const nextDayHigh = dataset[index + 1]?.h ?? null;
        const nextDayLow = dataset[index + 1]?.l ?? null;
        const nextDayClose = dataset[index + 1]?.c ?? null;
        const nextDayVolume = dataset[index + 1]?.v ?? null;

        return {
          ticker: result.ticker ?? "",
          strategyId: `${result.ticker}-${d.t}`,

          close: d.c ?? null,
          high: d.h ?? null,
          low: d.l ?? null,
          open: d.o ?? null,
          time: d.t ?? null,
          volume: d.v ?? null,
          vwap: d.vw ?? null,
          sma50,
          sma200,

          nextDayTime,
          nextDayOpen,
          nextDayHigh,
          nextDayLow,
          nextDayClose,
          nextDayVolume,

          gap: getGap(d.o, previousDayClose),
          change: getChange(d.c, previousDayClose),
          dayChange: getDayChange(d.o, d.c),
          range: getRange(d.h, d.l),
          nextDayGap: getNextDayGap(d.c, nextDayOpen),
          averageVolume: getAverageVolume(
            d.v,
            dataset.map(({ v }) => v ?? 0),
            index,
            9
          ),
          closedRed: getClosedRed(d.o, d.c),
          followingRedDay: getFollowingRedDay(nextDayOpen, nextDayClose),
        };
      });
    })
  );

  return data.flat();
}
