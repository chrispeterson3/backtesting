// !! https://deno.land/x/trading_signals@3.6.1

import { orchestrateStrategy } from "./strategy/orchestrateStrategy.ts";

import tickerData from "./strategies/smallCapGappers/data/tickers.json" assert { type: "json" };
import * as strategy from "./strategies/smallCapGappers/mod.ts";

// import tickerData from "./strategies/SPY/data/tickers.json" assert { type: "json" };
// import * as strategy from "./strategies/SPY/mod.ts";

await orchestrateStrategy({
  tickerData,
  from: "2022-12-13",
  to: "2022-12-31",
  strategyMapper: strategy.strategyMapper,
  strategyFilter: strategy.strategyFilter,
  resultsMapper: strategy.resultsMapper,
  fileName: "./strategies/smallCapGappers/data/results",
});
