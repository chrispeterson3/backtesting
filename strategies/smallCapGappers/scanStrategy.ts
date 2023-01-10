import tickerData from "./data/tickers.json" assert { type: "json" };
import { getStrategyBars } from "./getStrategyBars.ts";
import { strategyFilter } from "./strategyFilter.ts";

// need to get previous day's data from day of interst to measure gap %
const { from, to } = { from: "2023-01-06", to: "2023-12-31" };

export async function scanStrategy() {
  const strategyBars = (
    await getStrategyBars({
      tickers: tickerData,
      from,
      to,
    })
  ).filter(strategyFilter);

  console.log(
    strategyBars.map((a) => ({
      ticker: a.ticker,
      gap: `${(Math.round((a.gap as number) * 100) / 100).toFixed(2)}%`,

      lastClose: `$${a.close}`,
      high: `$${a.high}`,
      low: `$${a.low}`,

      volume: a.volume?.toLocaleString("en-US"),
      float: a.float?.toLocaleString("en-US"),
    }))
  );
}
