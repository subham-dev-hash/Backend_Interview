import { StructuredOutputParser } from "@langchain/core/output_parsers";
import { PromptTemplate } from "@langchain/core/prompts";
import { ChatGoogleGenerativeAI } from "@langchain/google-genai";
import { z } from 'zod';


async function outputParser() {
    const parser = StructuredOutputParser.fromZodSchema(
        z.object({
            answer: z.string(),
            score: z.number()
        })
    );

    const prompt = PromptTemplate.fromTemplate(`
Summarize text.

{format_instructions}

Text:
{text}
`);

    const formattedPrompt = await prompt.format({
        text: "LangChain is a framework for AI apps",
        format_instructions: parser.getFormatInstructions()
    });

    const model = new ChatGoogleGenerativeAI({
        model: "gemini-2.5-flash-lite",
        temperature: 0
    });

    const response = await model.invoke(formattedPrompt);
    console.log("🚀 ~ outputParser ~ response:", response.content)
    // const parsed = await parser.parse(response.content);
    // console.log("🚀 ~ outputParser ~ parsed:", parsed);

}

export { outputParser }