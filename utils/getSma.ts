import "https://deno.land/x/dotenv/load.ts";
import { ISma, polygonClient } from "../../polygon_io_client/mod.ts";
import { ISmaQuery } from "../../polygon_io_client/rest/indicators/sma.ts";

const POLYGON_API_KEY = Deno.env.get("POLYGON_API_KEY");
const { rest } = polygonClient(POLYGON_API_KEY ?? "");

export async function getSma(
  stockTicker: string,
  query: ISmaQuery
): Promise<ISma> {
  try {
    return await rest.indicators.sma(stockTicker, query);
  } catch (error) {
    throw new Error(error);
  }
}
