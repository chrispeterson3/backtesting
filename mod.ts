import { orchestrateStrategy } from "./strategies/highVolGappers/mod.ts";

// !! https://deno.land/x/trading_signals@3.6.1

await orchestrateStrategy("2022-12-08", "2022-12-31");
