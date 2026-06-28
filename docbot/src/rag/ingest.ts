import path from 'node:path';
import { DirectoryLoader } from "@langchain/classic/document_loaders/fs/directory";
import { TextLoader } from "@langchain/classic/document_loaders/fs/text";
import { PDFLoader } from "@langchain/community/document_loaders/fs/pdf";
import { RecursiveCharacterTextSplitter } from '@langchain/textsplitters';
import { Chroma } from '@langchain/community/vectorstores/chroma';
import { createEmbeddings } from '../config';

const DOCS_DIR = path.resolve("data/docs");
const COLLECTION_NAME = "docbot-docs";
const CHROMA_URL = "http://localhost:8000";

async function main() {
    console.log("Loading doc from .....", DOCS_DIR);
    const loader = new DirectoryLoader(DOCS_DIR, {
        ".txt": (filePath) => new TextLoader(filePath),
        ".pdf": (filePath) => new PDFLoader(filePath),
    })

    const rawDocs = await loader.load();
    console.log(`Loaded ${rawDocs.length} documents`);

    const splitter = new RecursiveCharacterTextSplitter({
        chunkSize: 800,
        chunkOverlap: 100
    })
    const chunks = await splitter.splitDocuments(rawDocs);
    console.log(`Split into ${chunks.length} chunks`);

    const embeddings = createEmbeddings();
    const vector = await embeddings.embedQuery("Hello world");

    console.log(vector.length);
    console.log(vector.slice(0, 5));
    console.dir(chunks[0].metadata, { depth: null });

    const cleanedChunks = chunks.map((doc) => {
        const { pdf, loc, ...metadata } = doc.metadata;

        return {
            ...doc,
            metadata: {
                ...metadata,
                page: loc?.pageNumber ?? null,
            },
        };
    });

    await Chroma.fromDocuments(
        cleanedChunks,
        embeddings,
        {
            collectionName: COLLECTION_NAME,
            url: CHROMA_URL,
        }
    );

    console.log(`Stored ${chunks.length} chunks in Chroma collection "${COLLECTION_NAME}"`);
}


main();
