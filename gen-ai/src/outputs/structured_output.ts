/**
 * In LangChain, structured output means forcing the LLM to return data in a predictable format instead of random free text.
 * 
 */
import { z } from 'zod';
import { ChatGoogleGenerativeAI } from "@langchain/google-genai"

async function getStructuredOutput() {
    const model = new ChatGoogleGenerativeAI({
        model: "gemini-2.5-flash-lite",
        temperature: 0
    });

    const schema = z.object({
        name: z.string(),
        age: z.number(),
        occupation: z.string(),
    })

    const structuredModel = model.withStructuredOutput(schema);
    const response = await structuredModel.invoke(
        "Generate details for a fictional software engineer keep age as 35"
    )
    console.log("🚀 ~ main ~ response:", response)

}

export { getStructuredOutput }