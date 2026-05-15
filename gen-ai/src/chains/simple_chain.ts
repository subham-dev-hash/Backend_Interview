import { PromptTemplate } from "@langchain/core/prompts";
import { StringOutputParser } from "@langchain/core/output_parsers";
import { ChatGoogleGenerativeAI } from "@langchain/google-genai";


async function simpleChain() {

    const model = new ChatGoogleGenerativeAI({
        model: "gemini-2.5-flash-lite",
        temperature: 0
    })

    const prompt = PromptTemplate.fromTemplate(`
     Explain the following topic in simple words:

     Topic: {topic}
    `)

    const parser = new StringOutputParser();

    const simpleChain = prompt.pipe(model).pipe(parser);

    const result = await simpleChain.invoke({
        topic: "Redis"
    });
    console.log("🚀 ~ simpleChain ~ result:", result)
}


export { simpleChain }