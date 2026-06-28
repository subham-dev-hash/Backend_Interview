import readline from "readline/promises";
import { tool } from "langchain";
import { createAgent } from "langchain";
import {  z } from 'zod';
import { createChatModel } from "./config";
import { askDocs } from "./rag/retrieve";

const searchDocs = tool(
    async ({ query }: { query: string }) => {
        return await askDocs(query);
    },
    {
        name: "search_documents",
        description:
            "Search the user's uploaded documents to answer questions about their specific content.",
        schema: z.object({ query: z.string() }),
    }
)

const agent = createAgent({
    model: createChatModel(0.2),
    tools: [searchDocs],
    systemPrompt: "You are DocBot. Use search_documents only when the question is about " +
        "the user's personal documents. Otherwise answer normally.",
});

const rl = readline.createInterface({ input: process.stdin, output: process.stdout });
let history: { role: "user" | "assistant"; content: string }[] = [];

console.log("DocBot ready. Type 'exit' to quit.\n");

while (true) {
    const userInput = await rl.question("You: ");
    if (userInput.trim().toLowerCase() === "exit") break;

    history.push({ role: "user", content: userInput });
    const result = await agent.invoke({ messages: history });
    const reply = result.messages.at(-1)?.content as string;


    console.log("DocBot:", reply, "\n");
    history.push({ role: "assistant", content: reply });
};


rl.close();
