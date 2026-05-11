import { ChatGoogleGenerativeAI } from '@langchain/google-genai'
import { initChatModel } from 'langchain'

// const model = await initChatModel("google-genai:gemini-2.5-flash-lite");


async function getChatModelResponse() {
    let key: string = process.env.GOOGLE_API_KEY || "";
    const model = new ChatGoogleGenerativeAI({
        model: "gemini-2.5-flash-lite",
        apiKey: key,
        temperature: 0,
        maxOutputTokens: 100,
        maxRetries: 2
    });

    const response = await model.invoke("Who is Virat Kohli?");

    console.log(response.content);
}

export { getChatModelResponse }