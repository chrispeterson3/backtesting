import tickers from "./data/tickers.json" assert { type: "json" };
import { getBars } from "../../utils/getBars.ts";
import { pLimit } from "https://deno.land/x/p_limit@v1.0.0/mod.ts";
import { mapResults } from "./mapResults.ts";

// query to ticker subset
export const strategyTickerQuery =
  'select * from "TickerDetail" where float <= 25000000 and "marketCap" <= 1000000000';

// strategy filters
const strategyFilter = ({ v, c, floatRotation, gap }: any) =>
  v >= 5000000 && c >= 1 && floatRotation >= 4 && gap >= 20;

// fetch and map daily ticker data
export function getStrategyData(from: string, to: string) {
  const limit = pLimit(100);

  (async () => {
    console.log(`fetching data for liquidity traps..`);

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

    Deno.writeTextFile(
      `./setups/liquidityTraps/data/data.json`,
      JSON.stringify(results.flat().filter(strategyFilter))
    );

    console.log("...");
    console.log("complete.");
  })();
}
