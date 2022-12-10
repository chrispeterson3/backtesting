import { pLimit } from "https://deno.land/x/p_limit@v1.0.0/mod.ts";
import tickers from "./data/tickers.json" assert { type: "json" };
import { getBars } from "../../utils/getBars.ts";
import { StrategyResult, mapResults } from "./utils/mapResults.ts";

// query to ticker subset
export const strategyTickerQuery =
  'select * from "TickerDetail" where float <= 25000000 and "marketCap" <= 1000000000';

// strategy filters
const strategyFilter = (data: StrategyResult | undefined) => {
  return (
    data &&
    data.volume &&
    data.volume >= 5000000 &&
    data.close &&
    data.close >= 1 &&
    data.floatRotation &&
    data.floatRotation >= 4 &&
    data.gap &&
    data.gap >= 20
  );
};

// use ticker query results, get daily bars, filter results for strategy
export async function getStrategyData(
  from: string,
  to: string
): Promise<Array<StrategyResult>> {
  try {
    console.log(`fetching data for liquidity traps..`);
    console.log("...");

    const limit = pLimit(100);

    const results = (
      await Promise.all(
        tickers.map(({ ticker }) => limit(() => getBars({ ticker, from, to })))
      )
    ).map(({ ticker, results: data }) => {
      const { float, sicDescription, description } = tickers.find(
        (d) => d.ticker === ticker
      ) || {
        float: null,
      };
      const floatValue = float ? parseInt(float) : null;

      return data?.map(
        mapResults({ ticker, float: floatValue, sicDescription, description })
      );
    });

    const StrategyDatas = results
      .flat()
      .filter(strategyFilter) as Array<StrategyResult>;

    console.log("-- complete --");

    return StrategyDatas;
  } catch (error) {
    console.log("getStrategyData() error");
    throw Error(error);
  }
}
