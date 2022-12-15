// !! https://deno.land/x/trading_signals@3.6.1

import { orchestrateStrategy } from "./strategy/orchestrateStrategy.ts";

// import tickerData from "./strategies/smallCapGappers/data/tickers.json" assert { type: "json" };
// import * as strategy from "./strategies/smallCapGappers/mod.ts";

import tickerData from "./strategies/overnightABCD/data/tickers.json" assert { type: "json" };
import * as strategy from "./strategies/overnightABCD/mod.ts";

await orchestrateStrategy({
  tickerData,
  // from: "2017-01-01",
  // to: "2017-12-31",
  from: "2022-12-12",
  to: "2022-12-15",
  strategyMapper: strategy.strategyMapper,
  strategyFilter: strategy.strategyFilter,
  resultsMapper: strategy.resultsMapper,
  fileName: `./strategies/${strategy.strategyName}/data/results`,
});
