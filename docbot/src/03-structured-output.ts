import { z } from 'zod';
import { createChatModel } from './config';

const model = createChatModel();

const ReviewSchema = z.object({
    sentiment: z.enum(["positive", "negative", "neutral" ]),
    summary: z.string(),
    rating: z.number().min(1).max(5),
});


const structuredModel = model.withStructuredOutput(ReviewSchema);

const result = await structuredModel.invoke(
    "This laptop is fast and the screen is gorgeous, but the battery dies too quickly."
);

console.log("🚀 ~ result:", result)

