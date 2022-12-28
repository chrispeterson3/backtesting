import "https://deno.land/x/dotenv/load.ts";
import { IAggs, polygonClient, ISma } from "../../polygon_io_client/mod.ts";

const POLYGON_API_KEY = Deno.env.get("POLYGON_API_KEY");
const { rest } = polygonClient(POLYGON_API_KEY ?? "");

type GetBarsData = {
  ticker: string;
  timespan?: "day" | "minute";
  multiplier?: number;
  from: string | number;
  to: string | number;
};

export async function getDailyBarsAndSmas({
  ticker,
  multiplier = 1,
  timespan = "day",
  from,
  to,
}: GetBarsData): Promise<IAggs & { smas50: ISma; smas200: ISma }> {
  try {
    const aggregates = await rest.stocks.aggregates(
      ticker,
      multiplier,
      timespan,
      from,
      to
    );
    const smas50 = await rest.indicators.sma(ticker, {
      "timespan.gte": from,
      "timespan.lte": to,
      window: 50,
      limit: 5000,
    });
    const smas200 = await rest.indicators.sma(ticker, {
      "timespan.gte": from,
      "timespan.lte": to,
      window: 200,
      limit: 5000,
    });

    return {
      ...aggregates,
      smas50,
      smas200,
    };
  } catch (error) {
    throw new Error(error);
  }
}
