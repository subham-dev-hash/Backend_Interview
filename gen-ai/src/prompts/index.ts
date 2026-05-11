/**
 *       Types
 * ====================
 * 
 * Text Based Prompts
 * Multimodal Prompts -> Image, sound, audio, video etc.
 * 
 * 
 * 
 * System Message 
 * Human Message
 * AI Message
 * 
 * 
 */

import "dotenv/config";
import { ChatGoogleGenerativeAI } from "@langchain/google-genai";
import readline from "node:readline/promises";
import { stdin as input, stdout as output } from "node:process";
import { HumanMessage, AIMessage, SystemMessage } from 'langchain'


async function initializeChatbot() {
    const key = process.env.GOOGLE_API_KEY || "";

    const model = new ChatGoogleGenerativeAI({
        model: "gemini-2.5-flash-lite",
        apiKey: key,
        temperature: 0,
        maxOutputTokens: 100,
        maxRetries: 2,
    });

    const rl = readline.createInterface({
        input,
        output,
    });

    console.log('Chat started. Type "exit" to quit.\n');
    let chatHistory = [];
    const conversation = [
        new SystemMessage("You are a helpful assistant that translates English to French."),
        new HumanMessage("Translate: I love programming."),
        new AIMessage("J'adore la programmation."),
        new HumanMessage("Translate: I love building applications."),
    ];
    try {
        while (true) {
            const userInput = await rl.question("USER: -> ");
            chatHistory.push({ role: "user", content: userInput });
            if (userInput.trim().toLowerCase() === "exit") {
                console.log("Chat ended.");
                break;
            }
            if (!userInput.trim()) {
                continue;
            }
            const response = await model.invoke(chatHistory);
            console.log("AI: -> " + response.content);
            chatHistory.push({ role: "assistant", content: response.content });
            console.log();
        }
    } catch (error) {
        console.error("Error:", error);
    } finally {
        rl.close();
    }
}

export { initializeChatbot };