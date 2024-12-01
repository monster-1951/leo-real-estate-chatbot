import { Db } from "@datastax/astra-db-ts";
import OpenAI from "openai";
import { system_prompt } from "@/constants/SystemPrompt";

export const GetResponse = async (
  input: string,
  db: Db,
  openai: OpenAI,
  ASTRA_DB_COLLECTION: string,
  type: Number
) => {
  console.log(type);
  console.log({ASTRA_DB_COLLECTION});
  let docContext = "";
  const embedding = await openai.embeddings.create({
    model: "text-embedding-3-small",
    input: input,
    encoding_format: "float",
  });

  try {
    const LeoRealEstateGPT = db.collection(ASTRA_DB_COLLECTION || "");

    const responseDocs = LeoRealEstateGPT.find(
      {},
      {
        sort: { $vector: embedding.data[0].embedding },
        limit: 10,
        includeSimilarity: true,
        projection: { $vectorize: 1 }
      }
    );
    const documents = await responseDocs.toArray();
    // console.log(documents)
   

    const docsMap =
      type == 0
        ? documents?.map((doc) => {
            return `Property ID: ${doc["Property-ID"]}, Area: ${doc.Area}, Type: ${doc["Property-Type"]}, Price: ${doc["Price-INR"]}, Size: ${doc["Size-sqft"]} sqft, Bedrooms: ${doc.Bedrooms}, Bathrooms: ${doc.Bathrooms}, Amenities: ${doc.Amenities} , Description:${doc.$vectorize}`;
          })
        : documents?.map((doc) => {
            return {
              id: doc._id,
              answer: doc.Answer, // Using the 'Answer' field as the primary content
              similarity: doc["$similarity"], // Include the similarity score if needed
            };
          });

          console.log(docsMap)
    docContext = JSON.stringify(docsMap);
          // console.log({docContext})
    
    const templateContent = `content:${system_prompt}
          
    ----------------------------
    START CONTEXT
    ${docContext}
    END CONTEXT
    ----------------------------
    QUESTION:${input}
    ----------------------------`;

    const stream = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [
        {
          role: "system",
          content: templateContent,
        },
        {
          role: "user",
          content: input,
        },
      ],
      stream: true,
    });

    let fullResponse = ""; // Initialize an empty string to accumulate the response

    // Iterate through the stream and accumulate the response
    for await (const chunk of stream) {
      const content = chunk.choices[0]?.delta?.content || "";
      fullResponse += content; // Append the chunk to the full response string
    }
    return fullResponse

    // return 'Ok I will return you dont worry 🍻🍻🍻'; // Return the accumulated response once the
  } catch (error) {
    console.log("Error querying db...", error);
    docContext = "";
    return error;
  }
};
