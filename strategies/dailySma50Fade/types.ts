import { Nullable } from "../../types.ts";
import { StrategyBarsResult } from "./getStrategyBars.ts";

export type FilteredStrategyResult = StrategyBarsResult & {
  chart: Nullable<string>;
  lowOfDayTime: Nullable<string>;
  highOfDayTime: Nullable<string>;
};
