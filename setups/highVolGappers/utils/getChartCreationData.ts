import { IAggsResults } from "../../../../polygon_io_client/mod.ts";
import { getBars } from "../../../utils/getBars.ts";
import type { Nullable } from "../../../types.ts";

export type ChartBars = {
  ticker: string;
  strategyId: string;
  time: Nullable<number>;
  dataset: Array<{
    timeframe: "daily" | "5min";
    data: Array<IAggsResults>;
  }>;
};

export async function getChartCreationData(
  ticker: string,
  _time: Nullable<number>
): Promise<ChartBars> {
  try {
    const time = _time ?? 0;
    const { results: dailyBars } = await getBars({
      ticker,
      from: time - 15780000000, // minus 6 months
      to: time + 15780000000, // plus 6 months
    });

    const { results: fiveMinuteBars } = await getBars({
      ticker,
      timespan: "minute",
      multiplier: 5,
      from: time,
      to: time + 172800000, // plus 48 hours
    });

    return {
      ticker,
      time,
      strategyId: `${ticker}-${time}`,
      dataset: [
        {
          timeframe: "daily",
          data: dailyBars ?? [],
        },
        {
          timeframe: "5min",
          data: fiveMinuteBars ?? [],
        },
      ],
    };
  } catch (error) {
    throw Error(error);
  }
}
