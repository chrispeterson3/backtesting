import "https://deno.land/x/dotenv/load.ts";
import { pLimit } from "https://deno.land/x/p_limit@v1.0.0/mod.ts";
import { ChartBars } from "../utils/getChartBars.ts";

const CHART_URL = Deno.env.get("CHART_URL");

export type ChartResponse = {
  id: string;
  strategyId: string;
};

// use strategy results, get daily/5min data for chart creation
export async function createCharts(
  chartsData: Array<ChartBars>
): Promise<Array<ChartResponse>> {
  const limit = pLimit(5);

  return await Promise.all(
    chartsData.map(({ ticker, strategyId, dataset }) =>
      limit(() =>
        fetch(`${CHART_URL}/api/charts`, {
          headers: {
            "Content-Type": "application/json",
          },
          method: "POST",
          body: JSON.stringify({ ticker, strategyId, dataset }),
        }).then((r) => r.json())
      )
    )
  );
}
