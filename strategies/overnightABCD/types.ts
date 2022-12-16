import { Nullable } from "../../types.ts";

export type FilteredResult = {
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

  averageVolume: Nullable<number>;

  change: Nullable<number>;
  gap: Nullable<number>;
  range: Nullable<number>;
  dayChange: Nullable<number>;
  closedRed: boolean;

  nextDayLow: Nullable<number>;
  nextDayHigh: Nullable<number>;
  nextDayVolume: Nullable<number>;
  nextDayGap: Nullable<number>;
  followingRedDay: boolean;

  description: Nullable<string>;
  sector: Nullable<string>;
};

export type FilteredStrategyResult = FilteredResult & {
  chart: Nullable<string>;

  preMarketVolume: number;
  preMarketHigh: Nullable<number>;
  preMarketLow: Nullable<number>;

  lowOfDayTime: Nullable<number>;
  highOfDayTime: Nullable<number>;
};
