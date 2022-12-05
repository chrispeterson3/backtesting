import "https://deno.land/x/dotenv/load.ts";
import { IAggs, polygonClient } from "../../polygon_io_client/mod.ts";

const POLYGON_API_KEY = Deno.env.get("POLYGON_API_KEY");
const { rest } = polygonClient(POLYGON_API_KEY ?? "");

type GetBarsData = {
  ticker: string;
  timespan?: number;
  multiplier?: "day";
  from: string;
  to: string;
};

export async function getBars({
  ticker,
  timespan = 1,
  multiplier = "day",
  from,
  to,
}: GetBarsData): Promise<IAggs> {
  try {
    return await rest.stocks.aggregates(ticker, timespan, multiplier, from, to);
  } catch (error) {
    throw new Error(error);
  }
}
