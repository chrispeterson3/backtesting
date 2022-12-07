import "https://deno.land/x/dotenv/load.ts";
import { IAggs, polygonClient } from "../../polygon_io_client/mod.ts";

const POLYGON_API_KEY = Deno.env.get("POLYGON_API_KEY");
const { rest } = polygonClient(POLYGON_API_KEY ?? "");

type GetBarsData = {
  ticker: string;
  timespan?: "day" | "minute";
  multiplier?: number;
  from: string | number;
  to: string | number;
};

export async function getBars({
  ticker,
  multiplier = 1,
  timespan = "day",
  from,
  to,
}: GetBarsData): Promise<IAggs> {
  try {
    return await rest.stocks.aggregates(ticker, multiplier, timespan, from, to);
  } catch (error) {
    throw new Error(error);
  }
}
