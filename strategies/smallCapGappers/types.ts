import { Nullable } from "../../types.ts";
import { StrategyBarsResult } from "./getStrategyBars.ts";

export type FilteredStrategyResult = StrategyBarsResult & {
  chart: Nullable<string>;
  floatRotation: Nullable<number>;
  preMarketVolume: number;
  preMarketHigh: Nullable<number>;
  preMarketLow: Nullable<number>;
  preMarketHighTime: Nullable<string>;
  preMarketLowTime: Nullable<string>;
  lowOfDayTime: Nullable<string>;
  highOfDayTime: Nullable<string>;
  hodVolume: Nullable<number>;
  volumeAtHod: Nullable<number>;
};
