import { RecursiveCharacterTextSplitter } from "@langchain/textsplitters";

export interface DocumentChunk {
  text: string;
  metadata: {
    chunkIndex: number;
  };
}

export async function chunkText(
  text: string,
  chunkSize: number = 1000, // 200-250 words
  chunkOverlap: number = 200
): Promise<DocumentChunk[]> {
  if (!text || text.trim() === "") {
    return [];
  }

  const splitter = new RecursiveCharacterTextSplitter({
    chunkSize,
    chunkOverlap,
    separators: ["\n\n", "\n", ".", "?", "!", " ", ""],
  });

  const chunks = await splitter.splitText(text);

  return chunks.map((chunk, index) => ({
    text: chunk,
    metadata: {
      chunkIndex: index,
    },
  }));
}