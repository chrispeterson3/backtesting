import "https://deno.land/x/dotenv/load.ts";
import { Client } from "https://deno.land/x/postgres@v0.17.0/mod.ts";

const CONNECTION_STRING = Deno.env.get("DATABASE_URL");

function writeJson(path: string, data: object): string {
  try {
    Deno.writeTextFileSync(path, JSON.stringify(data));

    return "Written to " + path;
  } catch (e) {
    return e.message;
  }
}

export async function fetchAndSaveTickers(fileName: string) {
  const client = new Client(CONNECTION_STRING);

  await client.connect();

  try {
    const results = await client.queryObject(
      'select * from "TickerDetail" where float <= 25000000 and "marketCap" <= 1000000000'
    );

    writeJson(fileName, results.rows);
  } catch (error) {
    console.log(error);
  }

  await client.end();
}
