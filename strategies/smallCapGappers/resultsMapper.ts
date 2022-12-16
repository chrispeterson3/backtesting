import "https://deno.land/x/dotenv/load.ts";
import { IAggsResults } from "../../../polygon_io_client/mod.ts";
import { ChartResponse, PriceActionData } from "../../strategy/mod.ts";
import { FilteredStrategyResult, FilteredResult } from "./types.ts";
import { getSessionData } from "../../utils/getSessionData.ts";

type GetHighLow = (
  prev: IAggsResults | undefined,
  curr: IAggsResults
) => IAggsResults;

const CHART_URL = Deno.env.get("CHART_URL");

export type ResultsMapper = (
  filteredStrategyData: Array<FilteredResult>,
  priceAction: Array<PriceActionData>,
  charts: Array<ChartResponse>
) => Array<FilteredStrategyResult>;

export const resultsMapper: ResultsMapper = (
  filteredStrategyData,
  priceAction,
  charts
) => {
  console.log("merging data..");

  const results = filteredStrategyData.reduce<Array<FilteredStrategyResult>>(
    (prev, curr) => {
      const chart = charts.find((a) => a.strategyId === curr.strategyId);
      const barData = priceAction.find(
        (a) => a.strategyId === curr.strategyId
      )?.bars;

      const sessionData = getSessionData(barData);

      return [
        ...prev,
        {
          ...curr,
          chart: chart ? `${CHART_URL}/charts/${chart.id}` : null,

          preMarketVolume: sessionData.pmSessionVolume,

          lowOfDayTime: sessionData.sessionLowOfDayTime,
          highOfDayTime: sessionData.sessionHighOfDayTime,

          preMarketHighTime: sessionData.pmSessionHighTime,
          preMarketLowTime: sessionData.pmSessionLowTime,

          preMarketHigh: sessionData.pmSessionHigh,
          preMarketLow: sessionData.pmSessionLow,
        },
      ] as Array<FilteredStrategyResult>;
    },
    []
  );

  console.log("-- done --");
  console.log("");

  return results;
};
