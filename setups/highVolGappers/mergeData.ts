import "https://deno.land/x/dotenv/load.ts";
import { Nullable } from "../../types.ts";
import { ChartResponse } from "./createCharts.ts";
import { StrategyBars } from "./utils/getDetailedChartData.ts";
import { sum } from "../../utils/sum.ts";
import { StrategyResult } from "./utils/mapResults.ts";
import { toTimeZone } from "../../utils/toTimeZone.ts";
import { IAggsResults } from "../../../polygon_io_client/mod.ts";

type GetHighLow = (
  prev: IAggsResults | undefined,
  curr: IAggsResults
) => IAggsResults;

type StrategyData = {
  chart: Nullable<string>;
  preMarketVolume: number;
  lowOfDayTime: Nullable<number>;
  highOfDayTime: Nullable<number>;
};

const CHART_URL = Deno.env.get("CHART_URL");

const getFiveMinuteBars = (
  barData: StrategyBars | undefined
): Array<IAggsResults> | undefined => {
  return barData?.dataset
    .filter((d) => d.timeframe === "5min")
    .map(({ data }) =>
      data.map((d) => ({
        ...d,
        t: d.t
          ? toTimeZone(d.t).getHours() * 100 + toTimeZone(d.t).getMinutes()
          : undefined,
      }))
    )
    .flat();
};

const getHighOfDay: GetHighLow = (prev, curr) => {
  if (!prev) return curr;
  return prev && prev.h && curr && curr.h && prev.h > curr.h ? prev : curr;
};

const getLowOfDay: GetHighLow = (prev, curr) => {
  if (!prev) return curr;
  return prev && prev.l && curr && curr.l && prev.l < curr.l ? prev : curr;
};

export function mergeData(
  strategyData: Array<StrategyResult>,
  strategyBars: Array<StrategyBars>,
  charts: Array<ChartResponse>
): Array<StrategyResult & StrategyData> {
  const mergedData = strategyData.reduce<Array<StrategyResult & StrategyData>>(
    (prev, curr) => {
      // get strategy chart
      const chart = charts.find((a) => a.strategyId === curr.strategyId);
      // get strategy daily/5min bar data
      const barData = strategyBars.find(
        (a) => a.strategyId === curr.strategyId
      );
      // get only 5 min bars; map time to readable Market time
      const fiveMinuteBars = getFiveMinuteBars(barData);

      // split pre-market and regular sessions via "time"
      const preMarketSession = fiveMinuteBars?.filter((d) => d.t && d.t < 925);
      const regularSession = fiveMinuteBars?.filter(
        (d) => d.t && d.t >= 925 && d.t <= 1555
      );

      // get additional datapoints
      const preMarketVolume = sum(
        preMarketSession?.map((d) => d.v).filter((n) => n) as Array<number>
      );
      const highOfDayTime = regularSession?.reduce(getHighOfDay).t;
      const lowOfDayTime = regularSession?.reduce(getLowOfDay).t;

      return [
        ...prev,
        {
          ...curr,
          preMarketVolume,
          chart: chart ? `${CHART_URL}/charts/${chart.id}` : null,
          lowOfDayTime: Number(lowOfDayTime) ?? null,
          highOfDayTime: Number(highOfDayTime) ?? null,
        },
      ];
    },
    []
  );

  return mergedData;
}
