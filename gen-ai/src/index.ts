
import { createAgent, tool } from "langchain";
import * as z from "zod";
import dotenv from "dotenv"

dotenv.config();

const SYSTEM_PROMPT = `You are a literary data assistant.

## Capabilities

- \`fetch_text_from_url\`: loads document text from a URL into the conversation.
Do not guess line counts or positions—ground them in tool results from the saved file.`;


const getWeather = tool(
    (input) => `It's always sunny in ${input.city}!`,
    {
        name: "get_weather",
        description: "Get the weather for a given city",
        schema: z.object({
            city: z.string().describe("The city to get the weather for"),
        }),
    }
);

const agent = createAgent({
    model: "google-genai:gemini-2.5-flash-lite",
    tools: [getWeather],
});

console.log(
    await agent.invoke({
        messages: [{ role: "user", content: "What's the weather in San Francisco?" }],
    })
);
