"use server";

import { generateSingleEmbedding } from "@/lib/embeddings";
import { searchSimilarChunks } from "@/lib/qdrant";

import { getServerSession } from "next-auth/next";
import { authOptions } from "../app/api/auth/[...nextauth]/route";
import { prisma } from "../lib/prisma";

/**
 * Server Action to retrieve context based on a user's question.
 * It strictly enforces organization isolation.
 */
export async function retrieveContext(question: string): Promise<string> {
  // 1. Authenticate the request
  const session = await getServerSession(authOptions);
  
  if (!session?.user?.id) {
    throw new Error("Unauthorized");
  }

  const membership = await prisma.membership.findFirst({
    where: { userId: session.user.id },
  });

  if (!membership?.orgId) {
    throw new Error("Unauthorized: User must belong to an organization.");
  }

  const orgId = membership.orgId;

  try {
    // 2. Generate a vector embedding for the user's question
    const queryVector = await generateSingleEmbedding(question);

    // 3. Search Qdrant for the Top 5 most similar chunks (Strictly filtered by orgId)
    const similarChunks = await searchSimilarChunks(queryVector, orgId, 5);

    if (similarChunks.length === 0) {
      return "No relevant context found in the company's documents.";
    }

    // 4. Context Assembly: Combine the chunks into a single string
    const assembledContext = similarChunks
      .map((chunk, index) => {
        // We can add Document ID here later to provide citations to the user
        return `[Source Document: ${chunk.documentId}]\n${chunk.text}`;
      })
      .join("\n\n---\n\n");

    return assembledContext;

  } catch (error) {
    console.error("Retrieval pipeline failed:", error);
    throw new Error("Failed to retrieve context for the question.");
  }
}