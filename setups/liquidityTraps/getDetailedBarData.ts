import strategyData from "./data/data.json" assert { type: "json" };
import { pLimit } from "https://deno.land/x/p_limit@v1.0.0/mod.ts";
import { getDetailsBarsData } from "./utils/getDetailsBarsData.ts";

// use strategy results, get daily/5min data for chart creation
export async function getDetailedBarData() {
  try {
    console.log("getting strategy detailed bar data..");
    console.log("...");

    const limit = pLimit(50);

    const barData = await Promise.all(
      strategyData.map(({ ticker, t }) =>
        limit(() => getDetailsBarsData(ticker, t))
      )
    );

    Deno.writeTextFile(
      `./setups/liquidityTraps/data/TEST.json`,
      JSON.stringify(barData)
    );

    console.log("-- complete --");
  } catch (error) {
    console.log("getResultsData() error");
    console.log(error);
  }
}
