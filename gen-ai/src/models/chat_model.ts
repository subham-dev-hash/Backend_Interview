import { ChatGoogleGenerativeAI } from '@langchain/google-genai';

async function getChatModelResponse() {
    let key: string = process.env.GOOGLE_API_KEY || "";
    
    // 1. Initialize the base Chat Model
    const model = new ChatGoogleGenerativeAI({
        model: "gemini-2.5-flash-lite",
        apiKey: key,
        temperature: 0,
        maxOutputTokens: 200,
        maxRetries: 2
    });

    // 2. Bind the updated googleSearch tool syntax
    const modelWithSearch = model.bindTools([
        {
            googleSearch: {} // This triggers the native Google Search grounding
        }
    ]);

    // 3. Invoke the enhanced model
    // const response = await modelWithSearch.invoke("Who is the Founder Of The Wedding Company?");
    const response = await modelWithSearch.invoke("Who is the Founder Of Arcade.dev?");

    console.log(response.content);
}

export { getChatModelResponse };