import OpenAI from "openai";
import { DataAPIClient } from "@datastax/astra-db-ts";
import { GetResponse } from "@/lib/GetResponse";
import { routeQuery } from "@/lib/FindTypeOfQuery";
export async function POST(request: Request) {
  const { User_Input } = await request.json();
  const {
    ASTRA_DB_PROPERTY_COLLECTION,
    ASTRA_DB_FAQ_COLLECTION,
    ASTRA_DB_API_ENDPOINT,
    ASTRA_DB_APPLICATION_TOKEN,
    OPENAI_API_KEY,
  } = process.env;

  console.log(ASTRA_DB_PROPERTY_COLLECTION);

  // Creating openai
  const openai = new OpenAI({
    apiKey: OPENAI_API_KEY,
  });

  const queryType = routeQuery(User_Input);
  console.log(queryType);
  // Initialize the client and get a "Db" object
  try {
    const client = new DataAPIClient(ASTRA_DB_APPLICATION_TOKEN);
    const db = client.db(ASTRA_DB_API_ENDPOINT || "");

    console.log(`* Connected to DB ${db.id}`);

    const Responsee = await GetResponse(
      User_Input,
      db,
      openai,
      ((queryType == 0 ) && ASTRA_DB_PROPERTY_COLLECTION) ||
        ((queryType == 1 ) && ASTRA_DB_FAQ_COLLECTION) ||
        ((queryType == 2 ) && ASTRA_DB_PROPERTY_COLLECTION) ||
        "",
      queryType
    );

    return Response.json(Responsee, {
      status: 201,
    });
  } catch (error) {
    return Response.json({
      Message: error,
      status: 201,
    });
  }
}
