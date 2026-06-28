import "dotenv/config";
import { ChatGoogleGenerativeAI } from "@langchain/google-genai";
import { GoogleGenerativeAIEmbeddings } from "@langchain/google-genai";


if(!process.env.GEMINI_API_KEY){
    throw new Error("Misiing GEMINI API KEY in env")
}


export function createChatModel(temperature = 0.3){
    return new ChatGoogleGenerativeAI({
        apiKey: process.env.GEMINI_API_KEY,
        model: "gemini-2.5-flash",
        temperature
    })
}


export function createEmbeddings(){
    return new GoogleGenerativeAIEmbeddings({
        apiKey: process.env.GEMINI_API_KEY,
        model: "gemini-embedding-001",

    })
}

