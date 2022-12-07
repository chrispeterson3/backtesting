import { IAggsResults } from "../../../../polygon_io_client/mod.ts";
import { getBars } from "../../../utils/getBars.ts";

type GetStrategyBars = {
  ticker: string;
  strategyId: string;
  t: number;
  lodt: number | null;
  hodt: number | null;
  dataset: Array<{
    timeframe: "daily" | "5min";
    data: Array<IAggsResults>;
  }>;
};

export async function getDetailedChartData(
  ticker: string,
  time = 0
): Promise<GetStrategyBars> {
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
    t: time,
    strategyId: `${ticker}-${time}`,
    lodt:
      fiveMinuteBars?.reduce((prev, current) => {
        if (!prev) return current;
        return prev && prev.l && current && current.l && prev.l < current.l
          ? prev
          : current;
      }).t ?? null,
    hodt:
      fiveMinuteBars?.reduce((prev, current) => {
        if (!prev) return current;
        return prev && prev.h && current && current.h && prev.h > current.h
          ? prev
          : current;
      }).t ?? null,
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
}
