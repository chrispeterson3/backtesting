import "https://deno.land/x/dotenv/load.ts";
import { IAggsResults } from "../../../polygon_io_client/mod.ts";
import { sum } from "../../utils/sum.ts";
import { toTimeZone } from "../../utils/toTimeZone.ts";
import { ChartResponse, PriceActionData } from "../../strategy/mod.ts";
import { FilteredStrategyResult, FilteredResult } from "./types.ts";

type GetHighLow = (
  prev: IAggsResults | undefined,
  curr: IAggsResults
) => IAggsResults;

const CHART_URL = Deno.env.get("CHART_URL");

const getBars = (barData: PriceActionData | undefined): Array<IAggsResults> => {
  return (
    barData?.bars.map((d) => ({
      ...d,
      // transform to easier to work with "Market Time"
      t: d.t
        ? toTimeZone(d.t).getHours() * 100 + toTimeZone(d.t).getMinutes()
        : undefined,
    })) ?? []
  );
};

const getHigh: GetHighLow = (prev, curr) => {
  if (!prev) return curr;
  return prev && prev.h && curr && curr.h && prev.h > curr.h ? prev : curr;
};

const getLow: GetHighLow = (prev, curr) => {
  if (!prev) return curr;
  return prev && prev.l && curr && curr.l && prev.l < curr.l ? prev : curr;
};

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

  const results = filteredStrategyData.reduce<
    Array<FilteredResult & FilteredStrategyResult>
  >((prev, curr) => {
    // get strategy chart
    const chart = charts.find((a) => a.strategyId === curr.strategyId);
    // get strategy daily/5min bar data
    const barData = priceAction.find((a) => a.strategyId === curr.strategyId);
    // get only 5 min bars; map time to readable Market time
    const bars = getBars(barData);

    // split pre-market and regular sessions via "time"
    const preMarketSession = bars.filter((d) => d.t && d.t < 925);
    const regularSession = bars.filter((d) => d.t && d.t >= 925 && d.t <= 1555);

    // get additional datapoints
    const preMarketVolume = sum(
      preMarketSession?.map((d) => d.v).filter((n) => n) as Array<number>
    );
    const { t: highOfDayTime } = regularSession.reduce(
      getHigh,
      [] as IAggsResults
    );
    const { t: lowOfDayTime } = regularSession.reduce(
      getLow,
      [] as IAggsResults
    );

    const { t: preMarketHighTime, h: preMarketHigh } = preMarketSession.reduce(
      getHigh,
      [] as IAggsResults
    );
    const { t: preMarketLowTime, l: preMarketLow } = preMarketSession.reduce(
      getLow,
      [] as IAggsResults
    );

    return [
      ...prev,
      {
        ...curr,
        preMarketVolume,
        chart: chart ? `${CHART_URL}/charts/${chart.id}` : null,
        lowOfDayTime: lowOfDayTime ?? null,
        highOfDayTime: highOfDayTime ?? null,

        preMarketHighTime: preMarketHighTime ?? null,
        preMarketLowTime: preMarketLowTime ?? null,
        preMarketHigh: preMarketHigh ?? null,
        preMarketLow: preMarketLow ?? null,
      },
    ];
  }, []);

  console.log("");
  console.log("-- done --");

  return results;
};
