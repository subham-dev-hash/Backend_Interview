import { createChatModel } from "./config";

const model = createChatModel();

const response = await model.invoke("In one sentence, What is RAG in AI");
console.log("🚀 ~ response:", response.content)

