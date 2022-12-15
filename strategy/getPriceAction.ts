import { pLimit } from "https://deno.land/x/p_limit@v1.0.0/mod.ts";
import { IAggsResults } from "../../polygon_io_client/mod.ts";
import { Nullable } from "../types.ts";
import { getBars } from "../utils/getBars.ts";

export type PriceActionData = {
  ticker: string;
  strategyId: string;
  time: Nullable<number>;
  bars: Array<IAggsResults>;
};

type DataPayload = {
  ticker: string;
  time: number;
  multiplier: number;
  timespan: "minute";
};

async function getData({
  ticker,
  timespan,
  multiplier,
  time,
}: DataPayload): Promise<PriceActionData> {
  const { results: fiveMinuteBars } = await getBars({
    ticker,
    timespan,
    multiplier,
    from: time,
    to: time + 86400000, // plus 24 hours
  });

  return {
    ticker,
    time,
    strategyId: `${ticker}-${time}`,
    bars: fiveMinuteBars ?? [],
  };
}

// get 5min price action for analysis
export async function getPriceAction<T extends Array<any>>(
  strategyData: T,
  multiplier: number
): Promise<Array<PriceActionData>> {
  console.log("getting price action data..");

  const limit = pLimit(100);

  console.log("-- done --");
  console.log("");

  return await Promise.all(
    strategyData.map(({ ticker, time }) =>
      limit(() => getData({ ticker, time, multiplier, timespan: "minute" }))
    )
  );
}
