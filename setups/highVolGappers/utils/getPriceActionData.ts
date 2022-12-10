import { IAggsResults } from "../../../../polygon_io_client/mod.ts";
import { getBars } from "../../../utils/getBars.ts";
import type { Nullable } from "../../../types.ts";

export type PriceActionData = {
  ticker: string;
  strategyId: string;
  time: Nullable<number>;
  bars: Array<IAggsResults>;
};

type Payload = {
  ticker: string;
  time: Nullable<number>;
  multiplier: number;
  timespan: "minute";
};

export async function getPriceActionData({
  ticker,
  time,
  multiplier,
  timespan,
}: Payload): Promise<PriceActionData> {
  try {
    const _time = time ?? 0;

    const { results: fiveMinuteBars } = await getBars({
      ticker,
      timespan,
      multiplier,
      from: _time,
      to: _time + 86400000, // plus 24 hours
    });

    return {
      ticker,
      time: _time,
      strategyId: `${ticker}-${time}`,
      bars: fiveMinuteBars ?? [],
    };
  } catch (error) {
    throw Error(error);
  }
}
