import "https://deno.land/x/dotenv/load.ts";

const CHART_URL = Deno.env.get("CHART_URL");

export function mergeData(strategyData: any, charts: any) {
  const mergedData = strategyData.reduce((prev: any, curr: any) => {
    const record = charts.find((a: any) => a.strategyId === curr.strategyId);

    return [
      ...prev,
      {
        ...curr,
        ...(record
          ? {
              chart: `${CHART_URL}/charts/${record.id}`,
            }
          : {}),
      },
    ];
  }, []);

  return mergedData;
}
