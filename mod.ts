// !! https://deno.land/x/trading_signals@3.6.1

import { orchestrateStrategy } from "./strategies/dailySma50Fade/mod.ts";
// import { orchestrateStrategy } from "./strategies/smallCapGappers/mod.ts";

await orchestrateStrategy();
