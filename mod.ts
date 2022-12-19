// !! https://deno.land/x/trading_signals@3.6.1

import { orchestrateStrategy } from "./strategy/orchestrateStrategy.ts";

// import tickerData from "./strategies/smallCapGappers/data/tickers.json" assert { type: "json" };
// import * as strategy from "./strategies/smallCapGappers/mod.ts";

import tickerData from "./strategies/overnightABCD/data/tickers.json" assert { type: "json" };
import * as strategy from "./strategies/overnightABCD/mod.ts";

await orchestrateStrategy({
  tickerData,
  from: "2022-12-19",
  to: "2022-12-31",
  strategyFilter: strategy.strategyFilter,
  resultsMapper: strategy.resultsMapper,
  fileName: `./strategies/${strategy.strategyName}/data/results`,
});
