import { Pinecone } from '@pinecone-database/pinecone';

if (!process.env.PINECONE_API_KEY) {
    throw new Error("PINECONE_API_KEY is not set.");
}

export const pinecone = new Pinecone({
    apiKey: process.env.PINECONE_API_KEY,
});

export const PINECONE_INDEX_NAME = 'smartstore-index';

console.log("Pinecone client initialized for index:", PINECONE_INDEX_NAME);