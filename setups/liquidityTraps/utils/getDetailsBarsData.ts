import { IAggsResults } from "../../../../polygon_io_client/mod.ts";
import { getBars } from "../../../utils/getBars.ts";

type GetStrategyBars = {
  ticker: string;
  t: number;
  dataset: Array<{
    timeframe: "daily" | "5min";
    data: Array<IAggsResults>;
  }>;
};

export async function getDetailsBarsData(
  ticker: string,
  time = 0
): Promise<GetStrategyBars> {
  const { results: dailyBars } = await getBars({
    ticker,
    from: time - 15780000, // minus 6 months
    to: time + 15780000, // plus 6 months
  });

  const { results: fiveMinuteBars } = await getBars({
    ticker,
    timespan: 5,
    multiplier: "minute",
    from: time,
    to: time + 86400, // plus 24 hours
  });

  return {
    ticker,
    t: time,
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
