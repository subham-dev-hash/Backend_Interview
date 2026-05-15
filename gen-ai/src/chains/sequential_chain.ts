import { StringOutputParser } from "@langchain/core/output_parsers";
import { PromptTemplate } from "@langchain/core/prompts"
import { ChatGoogleGenerativeAI } from "@langchain/google-genai";


async function sequentialChain() {

    const model = new ChatGoogleGenerativeAI({
        model: "gemini-2.5-flash-lite",
        temperature: 0,
    })

    const titlePrompt = PromptTemplate.fromTemplate(`
        Generate a catchy blog title about:
        {topic}
        `)

    const parser = new StringOutputParser();

    const titleChain = titlePrompt.pipe(model).pipe(parser);

    const outlinePrompt = PromptTemplate.fromTemplate(`
       Create a blog outline for this title:
       
       {title}
        `);

    const outlineChain = outlinePrompt.pipe(model).pipe(parser);

    const articlePrompt = PromptTemplate.fromTemplate(`
        Write a detailed blog using this outline:

        {outline}
        `)

    const articleChain = articlePrompt.pipe(model).pipe(parser);

    // Sequential Execution
    const title = await titleChain.invoke({
        topic: "AI in Healthcare"
    });
    const outline = await outlineChain.invoke({
        title
    });
    const article = await articleChain.invoke({
        outline
    });
    console.log("🚀 ~ sequentialChain ~ article:", article)
    
}

export { sequentialChain }