import "https://deno.land/x/dotenv/load.ts";
import { pLimit } from "https://deno.land/x/p_limit@v1.0.0/mod.ts";
import { StrategyBars } from "./utils/getDetailedChartData.ts";

const CHART_URL = Deno.env.get("CHART_URL");

export type ChartResponse = {
  id: string;
  strategyId: string;
};

// use strategy results, get daily/5min data for chart creation
export async function createCharts(
  chartsData: Array<StrategyBars>
): Promise<Array<ChartResponse>> {
  try {
    console.log("creating charts..");
    console.log("...");

    const limit = pLimit(5);

    const barData: Array<ChartResponse> = await Promise.all(
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

    console.log("-- complete --");

    return barData;
  } catch (error) {
    console.log("createCharts() error");
    throw Error(error);
  }
}
