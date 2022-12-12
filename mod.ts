import data from "./setups/highVolGappers/data/tickers.json" assert { type: "json" };
import { orchestrateStrategy } from "./strategies/highVolGappers/mod.ts";

// !! https://deno.land/x/trading_signals@3.6.1

await orchestrateStrategy();
