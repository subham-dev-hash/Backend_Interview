import { Chroma } from "@langchain/community/vectorstores/chroma";
import { ChatPromptTemplate } from "@langchain/core/prompts";
import { createChatModel, createEmbeddings } from "../config";

const COLLECTION_NAME = "docbot-docs";
const CHROMA_URL = "http://localhost:8000";

const RAG_PROMPT = ChatPromptTemplate.fromMessages([
    [
        "system",
        "Answer ONLY using the context below. If the answer isn't in the context, say you don't know.\n\nContext:\n{context}",
    ],
    ["human", "{question}"]
]);

export async function askDocs(question: string) {
    const vectorStore = new Chroma(createEmbeddings(), {
        collectionName: COLLECTION_NAME,
        url: CHROMA_URL
    })

    const retriever = vectorStore.asRetriever({ k: 4 });
    const relevantDocs = await retriever.invoke(question);
    const context = relevantDocs.map((d) => d.pageContent).join("\n\n---\n\n");

    const model = createChatModel(0);
    const chain = RAG_PROMPT.pipe(model);

    const result = await chain.invoke({ context, question });
    return result.content;
}

// Allow running this file directly: npm run dev src/rag/retrieve.ts
if (process.argv[2]) {
    const answer = await askDocs(process.argv.slice(2).join(" "));
    console.log(answer);
}