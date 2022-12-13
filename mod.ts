import { orchestrateStrategy as orchestrateHighVolGappers } from "./strategies/highVolGappers/mod.ts";
import { orchestrateStrategy as orchestrateSPY } from "./strategies/SPY/mod.ts";
import { orchestrateStrategy as orchestrateGapAndCrap } from "./strategies/gapAndCrap/mod.ts";

// !! https://deno.land/x/trading_signals@3.6.1

// await orchestrateHighVolGappers("2022-12-08", "2022-12-31");

// await orchestrateSPY("2017-12-31", "2022-12-31");

await orchestrateGapAndCrap("2016-12-31", "2022-12-31");
