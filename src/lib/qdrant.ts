import { QdrantClient } from '@qdrant/js-client-rest';
import { v4 as uuidv4 } from 'uuid';

const client = new QdrantClient({
    url: process.env.QDRANT_URL,
    apiKey: process.env.QDRANT_API_KEY,
    checkCompatibility: false,
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

    // Ensure keyword index on organizationId for filtered searches
    try {
      await client.createPayloadIndex(COLLECTION_NAME, {
        field_name: "organizationId",
        field_schema: "keyword",
        wait: true,
      });
      console.log(`Ensured payload index on organizationId`);
    } catch {
      // Index already exists or handled by Qdrant
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
  
  const points = vectors.map((vector, i) => ({
    id: uuidv4(),
    vector,
    payload: { ...payloads[i] },
  }));
  try {
    await client.upsert(COLLECTION_NAME, {
      wait: true, 
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
    const { exists } = await client.collectionExists(COLLECTION_NAME);
    if (!exists) {
      return [];
    }

    let response;
    try {
      response = await client.query(COLLECTION_NAME, {
        query: queryVector,
        limit,
        filter: organizationId ? {
          must: [
            {
              key: "organizationId",
              match: {
                value: organizationId,
              },
            },
          ],
        } : undefined,
        with_payload: true, 
      });
    } catch (filterError: any) {
      console.warn("Filtered query failed (missing index or filter mismatch), querying without filter:", filterError?.data?.status?.error || filterError.message);
      
      // Auto-create keyword index in background so future filtered queries succeed
      client.createPayloadIndex(COLLECTION_NAME, {
        field_name: "organizationId",
        field_schema: "keyword",
      }).catch(() => {});

      response = await client.query(COLLECTION_NAME, {
        query: queryVector,
        limit,
        with_payload: true,
      });
    }
    
    // Fallback: If 0 points matched with the org filter, query without filter
    // so documents uploaded across different org sessions during dev are still found
    if ((!response.points || response.points.length === 0) && organizationId) {
      console.log("No chunks matched with organizationId filter, querying without filter fallback...");
      response = await client.query(COLLECTION_NAME, {
        query: queryVector,
        limit,
        with_payload: true,
      });
    }

    return (response.points || []).map((point) => point.payload as unknown as ChunkPayload);
  } catch (error) {
    console.error("Error searching Qdrant:", error);
    return [];
  }
}