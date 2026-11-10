"use server";

import { getServerSession } from "next-auth/next";
import { authOptions } from "../../api/auth/[...nextauth]/route";
import { prisma } from "../../../lib/prisma";
import { extractTextFromFile } from "../../../lib/document-parser";
import { chunkText, DocumentChunk } from "../../../lib/chunking";
import { generateEmbeddings } from "../../../lib/embeddings";
import { storeChunksInQdrant, ensureCollection } from "../../../lib/qdrant";
import { revalidatePath } from "next/cache";

export async function uploadDocument(formData: FormData) {
  const session = await getServerSession(authOptions);

  if (!session?.user?.id) {
    return { error: "Unauthorized" };
  }

  const membership = await prisma.membership.findFirst({
    where: { userId: session.user.id },
  });

  if (!membership?.orgId) {
    return { error: "Unauthorized: User must belong to an organization." };
  }

  const orgId = membership.orgId;
  const file = formData.get("file") as File;
  const sourceType = formData.get("sourceType") as string || "general";

  if (!file) {
    return { error: "No file provided" };
  }

  
  const document = await prisma.document.create({
    data: {
      orgId,
      title: file.name,
      sourceType,
      status: "processing",
      uploadedBy: session.user.id,
    },
  });

  try {
    
    await ensureCollection();

    
    const text = await extractTextFromFile(file);

    
    const chunks: DocumentChunk[] = await chunkText(text);

    if (chunks.length === 0) {
      throw new Error("No text extracted from document");
    }

    const texts = chunks.map(c => c.text);

    
    const embeddings = await generateEmbeddings(texts);

    
    const payloads = chunks.map(chunk => ({
      documentId: document.id,
      organizationId: orgId,
      text: chunk.text,
      chunkIndex: chunk.metadata.chunkIndex,
    }));

    await storeChunksInQdrant(embeddings, payloads);

    
    await prisma.document.update({
      where: { id: document.id },
      data: {
        status: "ready",
        chunkCount: chunks.length,
      },
    });

    revalidatePath("/dashboard/document");
    return { success: true };

  } catch (error: any) {
    console.error("Document upload pipeline error:", error);

    await prisma.document.update({
      where: { id: document.id },
      data: {
        status: "failed",
      },
    });

    return { error: error.message || "Failed to process document" };
  }
}
