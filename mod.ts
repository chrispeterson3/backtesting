// !! https://deno.land/x/trading_signals@3.6.1

import { orchestrateStrategy } from "./strategy/orchestrateStrategy.ts";

// import tickerData from "./strategies/smallCapGappers/data/tickers.json" assert { type: "json" };
// import * as strategy from "./strategies/smallCapGappers/mod.ts";

// import tickerData from "./strategies/SPY/data/tickers.json" assert { type: "json" };
// import * as strategy from "./strategies/SPY/mod.ts";

import tickerData from "./strategies/overnightABCD/data/tickers.json" assert { type: "json" };
import * as strategy from "./strategies/overnightABCD/mod.ts";

await orchestrateStrategy({
  tickerData,
  from: "2017-04-01",
  to: "2017-06-30",
  strategyMapper: strategy.strategyMapper,
  strategyFilter: strategy.strategyFilter,
  resultsMapper: strategy.resultsMapper,
  fileName: "./strategies/overnightABCD/data/results",
});
