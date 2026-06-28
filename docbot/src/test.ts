// import { ChromaClient } from "chromadb";

// const client = new ChromaClient({
//     path: "http://localhost:8000",
// });

// async function main() {
//     const collection = await client.getCollection({
//         name: "docbot-docs",
//     });

//     const result = await collection.get();

//     console.table(
//         result.ids.map((id, i) => ({
//             id,
//             source: result.metadatas[i]?.source,
//             text: result?.documents[i].substring(0, 80),
//         }))
//     );
// }

// main();