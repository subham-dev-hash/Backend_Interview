import { ChatPromptTemplate } from "@langchain/core/prompts";
import { createChatModel } from "./config";

const model = createChatModel();

const prompt = ChatPromptTemplate.fromMessages([
    ["system", "You are a {persona}. Keep answers under 3 sentences."],
    ["human", "Explain {topic} simply."],
]);

const chain = prompt.pipe(model);

const result = await chain.invoke({
    persona: "patient programming tutor",
    topic: "vector embeddings"
})

console.log(result.content)

