import { pLimit } from "https://deno.land/x/p_limit@v1.0.0/mod.ts";
import {
  getPriceActionData,
  PriceActionData,
} from "./utils/getPriceActionData.ts";
import { StrategyResult } from "./utils/mapResults.ts";

// get 5min price action for analysis
export async function getPriceAction(
  strategyData: Array<StrategyResult>,
  multiplier: number
): Promise<Array<PriceActionData>> {
  try {
    console.log("getting price action data..");
    console.log("...");

    const limit = pLimit(50);

    const barData = await Promise.all(
      strategyData.map(({ ticker, time }) =>
        limit(() =>
          getPriceActionData({ ticker, time, multiplier, timespan: "minute" })
        )
      )
    );

    console.log("-- complete --");

    return barData;
  } catch (error) {
    console.log("getPriceAction() error");
    throw Error(error);
  }
}
