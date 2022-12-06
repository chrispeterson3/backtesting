import { pLimit } from "https://deno.land/x/p_limit@v1.0.0/mod.ts";
import tickers from "./data/tickers.json" assert { type: "json" };
import { getBars } from "../../utils/getBars.ts";
import { MappedResult, mapResults } from "./utils/mapResults.ts";

// query to ticker subset
export const strategyTickerQuery =
  'select * from "TickerDetail" where float <= 25000000 and "marketCap" <= 1000000000';

// strategy filters
const strategyFilter = ({ v, c, floatRotation, gap }: any) =>
  v >= 5000000 && c >= 1 && floatRotation >= 4 && gap >= 20;

// use ticker query results, get daily bars, filter results for strategy
export async function getStrategyData(from: string, to: string) {
  try {
    console.log(`fetching data for liquidity traps..`);
    console.log("...");

    const limit = pLimit(100);

    const results = (
      await Promise.all(
        tickers.map(({ ticker }) => limit(() => getBars({ ticker, from, to })))
      )
    ).map(({ ticker, results: data }) => {
      const { float } = tickers.find((d) => d.ticker === ticker) || {
        float: null,
      };
      const floatValue = float ? parseInt(float) : null;

      return data?.map(mapResults(ticker, floatValue));
    });

    const strategyResults = results
      .flat()
      .filter(strategyFilter) as Array<MappedResult>;

    Deno.writeTextFile(
      `./setups/liquidityTraps/data/data.json`,
      JSON.stringify(strategyResults)
    );

    console.log("-- complete --");
  } catch (error) {
    console.log("getStrategyData() error");
    console.log(error);
  }
}
