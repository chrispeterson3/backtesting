import "https://deno.land/x/dotenv/load.ts";
import { datetime } from "https://deno.land/x/ptera@v1.0.2/mod.ts";
import { formatDate } from "https://deno.land/x/ptera@v1.0.2/format.ts";
import { IAggsResults, polygonClient } from "../../../polygon_io_client/mod.ts";
import tickerData from "./tickers.json" assert { type: "json" };
import data from "./data.json" assert { type: "json" };
import { pLimit } from "https://deno.land/x/p_limit@v1.0.0/mod.ts";

const POLYGON_API_KEY = Deno.env.get("POLYGON_API_KEY");
const { rest } = polygonClient(POLYGON_API_KEY ?? "");

const getData = async (ticker: string, float: number): Promise<any> => {
  try {
    const { results } = await rest.stocks.aggregates(
      ticker,
      1,
      "day",
      "2020-12-31",
      "2022-12-31"
    );

    return results?.map((result, i) => {
      const next = i + 1;
      const prev = i - 1;
      const { c: previousClose }: IAggsResults = results[prev] ?? {};
      const {
        h: nextHigh,
        v: nextVolume,
        o: nextOpen,
        c: nextClose,
      }: IAggsResults = results[next] ?? {};
      const { c: close, o: open } = result;

      return {
        // daily data
        ticker,
        date:
          formatDate(datetime(result.t).toZonedTime("UTC"), "YYYY-MM-dd") ??
          null,
        open: result.o,
        high: result.h,
        low: result.l,
        close: result.c,
        volume: result.v,

        nextHigh,
        nextVolume,
        nextDayRed: nextOpen && nextClose && nextClose < nextOpen,

        // % changes
        change:
          close &&
          previousClose &&
          ((close - previousClose) / previousClose) * 100,
        dayChange:
          result.c && result.o && ((result.c - result.o) / result.c) * 100,
        range: result.h && result.l && ((result.h - result.l) / result.h) * 100,
        gap:
          previousClose &&
          open &&
          ((open - previousClose) / previousClose) * 100,

        // stats
        closedRed: open && close && close < open,
        floatRotation: result.v && result.v / float,
        float,
      };
    });
  } catch (error) {
    console.log(error);
  }
};

export function fetchData() {
  const limit = pLimit(100);

  (async () => {
    console.log(`fetching data for liquidity traps..`);

    const results = await Promise.all(
      tickerData.map(({ ticker, float }) =>
        limit(() => getData(ticker, parseInt(float)))
      )
    );

    Deno.writeTextFile(
      `./setups/liquidityTraps/data.json`,
      JSON.stringify(results.flat())
    );

    console.log("");
    console.log("complete.");
  })();
}

export function filterData() {
  const filteredResults = data.filter(
    ({ volume, close, floatRotation, gap }) =>
      volume >= 5000000 && close >= 1 && floatRotation >= 4 && gap >= 20
  );

  Deno.writeTextFile(
    `./setups/liquidityTraps/filteredData.json`,
    JSON.stringify(filteredResults)
  );
}
