// import "https://deno.land/x/dotenv/load.ts";
// import { datetime } from "https://deno.land/x/ptera@v1.0.2/mod.ts";
// import { formatDate } from "https://deno.land/x/ptera@v1.0.2/format.ts";
// import { IAggsResults, polygonClient } from "../polygon_io_client/mod.ts";
// import tickerData from "./setups/liquidityTraps/tickers.json" assert { type: "json" };
// import { pLimit } from "https://deno.land/x/p_limit@v1.0.0/mod.ts";

// const POLYGON_API_KEY = Deno.env.get("POLYGON_API_KEY");
// const { rest } = polygonClient(POLYGON_API_KEY ?? "");

// const getData = async (ticker: string) => {
//   try {
//     const { results } = await rest.stocks.aggregates(
//       ticker,
//       1,
//       "day",
//       "2017-12-31",
//       "2021-12-31"
//     );

//     return results?.map((result, i) => {
//       const prev = i - 1;
//       const {
//         c: prevClose,
//         h: prevHigh,
//         l: prevLow,
//         o: prevOpen,
//       }: IAggsResults = results[prev] ?? {};
//       const { c: close, o: open } = result;

//       return {
//         // daily data
//         date:
//           formatDate(datetime(result.t).toZonedTime("UTC"), "YYYY-MM-dd") ??
//           null,
//         open: result.o,
//         high: result.h,
//         low: result.l,
//         close: result.c,
//         volume: result.v,

//         // previous day data
//         previousOpen: prevOpen,
//         previousHigh: prevHigh,
//         previousLow: prevLow,
//         previousClose: prevClose,

//         // % changes
//         change: close && prevClose && ((close - prevClose) / prevClose) * 100,
//         dayChange:
//           result.c && result.o && ((result.c - result.o) / result.c) * 100,
//         gap: prevClose && open && ((open - prevClose) / prevClose) * 100,

//         // stats
//         closedRed: open && close && close < open,

//         // stat ideas
//         openPercentFromLow:
//           result && result.l && open && ((open - result.l) / open) * 100,
//         percentageFromPreviousHigh:
//           result &&
//           result.h &&
//           prevHigh &&
//           ((result.h - prevHigh) / result.h) * 100,

//         percentFromPreviousHigh:
//           prevHigh && open && ((prevHigh - open) / prevHigh) * 100,
//       };
//     });
//   } catch (error) {
//     console.log(error);
//   }
// };

// const limit = pLimit(100);
// const tickers = tickerData.map((d) => d.ticker);

// (async () => {
//   const fileName = "setups/liquidityTraps/data.json";

//   console.log(`fetching data for ${fileName}...`);

//   const results = await Promise.all(
//     tickers.map((ticker) => limit(() => getData(ticker)))
//   );

//   Deno.writeTextFile(`./${fileName}`, JSON.stringify(results));

//   console.log(`${fileName} complete`);
// })();
