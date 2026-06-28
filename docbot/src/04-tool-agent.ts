import { tool } from 'langchain';
import { createAgent } from 'langchain';
import { string, z } from "zod";
import { createChatModel } from './config';

const getStockPrice = tool(
    async ({ ticker }: { ticker: string }) => {
        const fakePrices: Record<string, number> = { AAPL: 201.5, GOOGL: 178.2 };
        return `${ticker} is trading at $${fakePrices[ticker] ?? "unknown"}`;
    },
    {
        name: "get_stock_price",
        description: "Get the current stock price for a ticker symbol",
        schema: z.object({ ticker: z.string().describe("e.g. AAPL") }),
    }
)


const agent = createAgent({
    model : createChatModel(0),
    tools: [getStockPrice],
    systemPrompt: "You are a concise financial assistant",
})

const result = await agent.invoke({
    messages: [ { role: "user", content: "What's NET trading at right now?" } ],
})

console.log(result.messages.at(-1)?.content);
