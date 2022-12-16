import { pLimit } from "https://deno.land/x/p_limit@v1.0.0/mod.ts";
import { average } from "https://deno.land/x/simplestatistics@v7.7.5/index.js";
import { Nullable, TickerData } from "../types.ts";
import { getBars } from "../utils/getBars.ts";

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

  gap: Nullable<number>;
  change: Nullable<number>;
  dayChange: Nullable<number>;
  range: Nullable<number>;
  nextDayGap: Nullable<number>;

  previousDayOpen: Nullable<number>;
  previousDayHigh: Nullable<number>;
  previousDayLow: Nullable<number>;
  previousDayClose: Nullable<number>;

  nextDayOpen: Nullable<number>;
  nextDayHigh: Nullable<number>;
  nextDayLow: Nullable<number>;
  nextDayClose: Nullable<number>;
  nextDayVolume: Nullable<number>;

  float: Nullable<number>;
  description: Nullable<string>;
  sector: Nullable<string>;

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
  console.log("getting strategy daily bars...");

  const limit = pLimit(100);
  const results = await Promise.all(
    tickers.map(({ ticker }) => limit(() => getBars({ ticker, from, to })))
  );
  const tickerFundamentals = tickers.reduce<{
    [key: string]: TickerData;
  }>((prev, curr) => ({ ...prev, [curr.ticker]: curr }), {});

  const data = results
    .map(
      (result) =>
        result.results?.map((d, index, dataset) => {
          const fundamentals = result.ticker
            ? tickerFundamentals[result.ticker]
            : null;

          const previousDayOpen = dataset[index - 1]?.o ?? null;
          const previousDayHigh = dataset[index - 1]?.h ?? null;
          const previousDayLow = dataset[index - 1]?.l ?? null;
          const previousDayClose = dataset[index - 1]?.c ?? null;

          const nextDayOpen = dataset[index + 1]?.o ?? null;
          const nextDayHigh = dataset[index + 1]?.h ?? null;
          const nextDayLow = dataset[index + 1]?.l ?? null;
          const nextDayClose = dataset[index + 1]?.c ?? null;
          const nextDayVolume = dataset[index + 1]?.v ?? null;

          const gap =
            (previousDayClose &&
              d.o &&
              ((d.o - previousDayClose) / previousDayClose) * 100) ??
            null;
          const change =
            (d.c &&
              previousDayClose &&
              ((d.c - previousDayClose) / previousDayClose) * 100) ??
            null;
          const dayChange = (d.c && d.o && ((d.c - d.o) / d.c) * 100) ?? null;
          const range = (d.h && d.l && ((d.h - d.l) / d.h) * 100) ?? null;
          const nextDayGap =
            (d.c && nextDayOpen && ((nextDayOpen - d.c) / d.c) * 100) ?? null;

          const volumeSubset = dataset
            .map((d) => d.v ?? 0)
            .slice(index - 9, index + 1);
          const averageVolume = average(
            volumeSubset.length ? volumeSubset : [d.v ?? 0]
          );

          const float = fundamentals?.float ?? null;
          const sector = fundamentals?.sicDescription ?? null;
          const description = fundamentals?.description ?? null;

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

            gap,
            change,
            dayChange,
            range,
            nextDayGap,

            float,

            previousDayOpen,
            previousDayHigh,
            previousDayLow,
            previousDayClose,

            nextDayOpen,
            nextDayHigh,
            nextDayLow,
            nextDayClose,
            nextDayVolume,

            sector,
            description,

            averageVolume,
            closedRed: !!(d.o && d.c && d.c < d.o),
            followingRedDay: !!(
              nextDayOpen &&
              nextDayClose &&
              nextDayClose < nextDayOpen
            ),
          };
        }) ?? []
    )
    .flat();

  console.log("-- done --");
  console.log("");

  return data;
}
