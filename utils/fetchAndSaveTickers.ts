import "https://deno.land/x/dotenv/load.ts";
import { Client } from "https://deno.land/x/postgres@v0.17.0/mod.ts";

const CONNECTION_STRING = Deno.env.get("DATABASE_URL");

// TODO Fetching using postgres@v0.17.0 outputs numeric data
// as a string. The expected type should be Number else float/marketCap etc
// needs to be parseInt
export async function fetchAndSaveTickers(fileName: string, query: string) {
  const client = new Client(CONNECTION_STRING);

  await client.connect();

  try {
    const results = await client.queryObject(query);

    Deno.writeTextFileSync(
      fileName,
      JSON.stringify(
        results.rows.map((a: any) => ({
          ...a,
          float: parseInt(a.float),
          marketCap: parseInt(a.marketCap),
        }))
      )
    );
  } catch (error) {
    console.log(error);
  }

  await client.end();
}
