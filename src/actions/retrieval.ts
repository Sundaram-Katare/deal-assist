"use server";

import { generateSingleEmbedding } from "@/lib/embeddings";
import { searchSimilarChunks } from "@/lib/qdrant";

import { getServerSession } from "next-auth/next";
import { authOptions } from "../app/api/auth/[...nextauth]/route";
import { prisma } from "../lib/prisma";

export async function retrieveContext(question: string, passedOrgId?: string): Promise<string> {
  let orgId = passedOrgId;

  if (!orgId) {
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.id) {
      console.warn("retrieveContext: No user session found");
      return "";
    }

    const membership = await prisma.membership.findFirst({
      where: { userId: session.user.id },
    });

    if (!membership?.orgId) {
      console.warn("retrieveContext: User has no organization");
      return "";
    }

    orgId = membership.orgId;
  }

  try {
    const queryVector = await generateSingleEmbedding(question);
    const similarChunks = await searchSimilarChunks(queryVector, orgId, 5);

    if (!similarChunks || similarChunks.length === 0) {
      console.log("retrieveContext: No matching chunks found in Qdrant");
      return "No relevant context found in the company's documents.";
    }

    console.log(`retrieveContext: Found ${similarChunks.length} relevant chunks`);

    const assembledContext = similarChunks
      .filter((chunk) => chunk && chunk.text)
      .map((chunk) => `[Source Document: ${chunk.documentId || "Document"}]\n${chunk.text}`)
      .join("\n\n---\n\n");

    return assembledContext || "No relevant context found in the company's documents.";

  } catch (error) {
    console.error("Retrieval pipeline warning (proceeding without context):", error);
    return "";
  }
}
