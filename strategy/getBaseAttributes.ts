import { IAggsResults } from "../../polygon_io_client/mod.ts";
import { getAverageVolume } from "../ta/getAverageVolume.ts";
import { getChange } from "../ta/getChange.ts";
import { getClosedRed } from "../ta/getClosedRed.ts";
import { getDayChange } from "../ta/getDayChange.ts";
import { getGap } from "../ta/getGap.ts";
import { getRange } from "../ta/getRange.ts";
import { Nullable } from "../types.ts";

export type BaseAttributes = {
  ticker: string;
  strategyId: string;
  open: Nullable<number>;
  high: Nullable<number>;
  low: Nullable<number>;
  close: Nullable<number>;
  time: Nullable<number>;
  volume: Nullable<number>;
  vwap: Nullable<number>;
  previousDayOpen: Nullable<number>;
  previousDayHigh: Nullable<number>;
  previousDayLow: Nullable<number>;
  previousDayClose: Nullable<number>;
  previousDayVolume: Nullable<number>;
  previousDayTime: Nullable<number>;
  nextDayOpen: Nullable<number>;
  nextDayHigh: Nullable<number>;
  nextDayLow: Nullable<number>;
  nextDayClose: Nullable<number>;
  nextDayVolume: Nullable<number>;
  nextDayTime: Nullable<number>;
  gap: Nullable<number>;
  change: Nullable<number>;
  dayChange: Nullable<number>;
  range: Nullable<number>;
  averageVolume: Nullable<number>;
  closedRed: boolean;
};

export function getBaseAttributes(
  ticker: string,
  dailyBar: IAggsResults,
  dailyBars: Array<IAggsResults>,
  currentDay: number
): BaseAttributes {
  const previousDayOpen = dailyBars[currentDay - 1]?.o ?? null;
  const previousDayHigh = dailyBars[currentDay - 1]?.h ?? null;
  const previousDayLow = dailyBars[currentDay - 1]?.l ?? null;
  const previousDayClose = dailyBars[currentDay - 1]?.c ?? null;
  const previousDayVolume = dailyBars[currentDay - 1]?.v ?? null;
  const previousDayTime = dailyBars[currentDay - 1]?.t ?? null;

  const nextDayOpen = dailyBars[currentDay + 1]?.o ?? null;
  const nextDayHigh = dailyBars[currentDay + 1]?.h ?? null;
  const nextDayLow = dailyBars[currentDay + 1]?.l ?? null;
  const nextDayClose = dailyBars[currentDay + 1]?.c ?? null;
  const nextDayVolume = dailyBars[currentDay + 1]?.v ?? null;
  const nextDayTime = dailyBars[currentDay + 1]?.t ?? null;

  const gap = getGap(dailyBar.o, previousDayClose);
  const change = getChange(dailyBar.c, previousDayClose);
  const dayChange = getDayChange(dailyBar.o, dailyBar.c);
  const range = getRange(dailyBar.h, dailyBar.l);
  const averageVolume = getAverageVolume(
    dailyBar.v,
    dailyBars.map(({ v }) => v ?? 0),
    currentDay,
    9
  );
  const closedRed = getClosedRed(dailyBar.o, dailyBar.c);

  // TODO - average true range (atr)
  return {
    ticker,
    strategyId: `${ticker}-${dailyBar.t}`,
    open: dailyBar.o ?? null,
    high: dailyBar.h ?? null,
    low: dailyBar.l ?? null,
    close: dailyBar.c ?? null,
    time: dailyBar.t ?? null,
    volume: dailyBar.v ?? null,
    vwap: dailyBar.vw ?? null,
    previousDayOpen,
    previousDayHigh,
    previousDayLow,
    previousDayClose,
    previousDayVolume,
    previousDayTime,
    nextDayOpen,
    nextDayHigh,
    nextDayLow,
    nextDayClose,
    nextDayVolume,
    nextDayTime,
    gap,
    change,
    dayChange,
    range,
    averageVolume,
    closedRed,
  };
}
