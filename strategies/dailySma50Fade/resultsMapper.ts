import "https://deno.land/x/dotenv/load.ts";
import { IAggsResults } from "../../../polygon_io_client/mod.ts";
import { ChartResponse, PriceActionData } from "../../strategy/mod.ts";
import { FilteredStrategyResult, FilteredResult } from "./types.ts";
import { getSessionData } from "../../utils/getSessionData.ts";
import { StrategyBarsResult } from "./getStrategyBars.ts";

type GetHighLow = (
  prev: IAggsResults | undefined,
  curr: IAggsResults
) => IAggsResults;

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
  console.log("merging data..");

  const results = strategyBars.reduce<Array<FilteredStrategyResult>>(
    (prev, curr) => {
      const chart = charts[curr.strategyId];
      const barData = priceAction[curr.strategyId]?.bars;

      const sessionData = getSessionData(barData);

      return [
        ...prev,
        {
          ...curr,
          chart: chart ? `${CHART_URL}/charts/${chart.id}` : null,
          lowOfDayTime: sessionData.sessionLowOfDayTime,
          highOfDayTime: sessionData.sessionHighOfDayTime,
        },
      ] as Array<FilteredStrategyResult>;
    },
    []
  );

  console.log("");
  console.log("-- done --");

  return results;
};
