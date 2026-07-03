import { QdrantClient } from '@qdrant/js-client-rest';
import { v4 as uuidv4 } from 'uuid';

const client = new QdrantClient({
    url: process.env.QDRANT_URL,
    apiKey: process.env.QDRANT_API_KEY,
});

const COLLECTION_NAME = "sales_document";

export async function ensureCollection() {
  try {
    const { exists } = await client.collectionExists(COLLECTION_NAME);
    if (!exists) {
      await client.createCollection(COLLECTION_NAME, {
        vectors: {
          size: 384,
          distance: "Cosine",
        },
      });
      console.log(`Created Qdrant collection: ${COLLECTION_NAME}`);
    }
  } catch (error) {
    console.error("Error ensuring Qdrant collection:", error);
  }
}

export interface ChunkPayload {
    documentId: string;
    organizationId: string;
    text: string;
    chunkIndex: number;
}

export async function storeChunksInQdrant(
  vectors: number[][],
  payloads: ChunkPayload[]
) {
  if (vectors.length !== payloads.length) {
    throw new Error("Vectors and payloads must have the same length.");
  }
  // Map into Qdrant's expected point structure
  const points = vectors.map((vector, i) => ({
    id: uuidv4(),
    vector,
    payload: { ...payloads[i] },
  }));
  try {
    await client.upsert(COLLECTION_NAME, {
      wait: true, // Wait for the operation to complete
      points,
    });
  } catch (error) {
    console.error("Error storing chunks in Qdrant:", error);
    throw new Error("Failed to store document embeddings.");
  }
}

export async function searchSimilarChunks(
  queryVector: number[],
  organizationId: string,
  limit: number = 5
) {
  try {
    const searchResults = await client.search(COLLECTION_NAME, {
      vector: queryVector,
      limit,
      // THIS IS CRITICAL FOR MULTI-TENANCY SECURITY
      filter: {
        must: [
          {
            key: "organizationId",
            match: {
              value: organizationId,
            },
          },
        ],
      },
      with_payload: true, // Return the actual text, not just the ID
    });
    // Extract just the payload data from the results
    return searchResults.map((result) => result.payload as unknown as ChunkPayload);
  } catch (error) {
    console.error("Error searching Qdrant:", error);
    throw new Error("Failed to perform semantic search.");
  }
}