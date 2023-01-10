import "https://deno.land/x/dotenv/load.ts";
import { IAggsResults } from "../../../polygon_io_client/mod.ts";
import { ChartResponse, PriceActionData } from "../../strategy/mod.ts";
import { FilteredStrategyResult } from "./types.ts";
import { getSessionData } from "../../utils/getSessionData.ts";
import { StrategyBarsResult } from "./getStrategyBars.ts";

const CHART_URL = Deno.env.get("CHART_URL");

export type ResultsMapper = (
  strategyBars: Array<StrategyBarsResult>,
  priceAction: { [key: string]: PriceActionData },
  charts: { [key: string]: ChartResponse }
) => Array<FilteredStrategyResult>;

export const resultsMapper: ResultsMapper = (
  strategyBars,
  priceAction,
  charts
) => {
  return strategyBars.reduce<Array<FilteredStrategyResult>>((prev, curr) => {
    const chart = charts[curr.strategyId];
    const barData = priceAction[curr.strategyId]?.bars;

    const sessionData = getSessionData(barData);

    return [
      ...prev,
      {
        ...curr,
        chart: chart ? `${CHART_URL}/charts/${chart.id}?timeframe=5min` : null,
        floatRotation:
          (curr.float && curr.volume && curr.volume / curr.float) ?? null,
        preMarketVolume: sessionData.pmSessionVolume,
        lowOfDayTime: sessionData.sessionLowOfDayTime,
        highOfDayTime: sessionData.sessionHighOfDayTime,
        preMarketHigh: sessionData.pmSessionHigh,
        preMarketLow: sessionData.pmSessionLow,
        preMarketHighTime: sessionData.pmSessionHighTime,
        preMarketLowTime: sessionData.pmSessionLowTime,
        hodVolume: sessionData.hodVolume,
        volumeAtHod: sessionData.volumeAtHod,
      },
    ] as Array<FilteredStrategyResult>;
  }, []);
};
