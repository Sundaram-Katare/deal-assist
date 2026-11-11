import path from "path";
import os from "os";

// Lazy-load the feature-extraction pipeline singleton with dynamic import
let extractorPromise: Promise<any> | null = null;

async function getExtractor() {
  if (!extractorPromise) {
    extractorPromise = (async () => {
      const { pipeline, env } = await import("@xenova/transformers");
      
      // In serverless environments (e.g. Vercel), only /tmp is writable
      env.cacheDir = path.join(os.tmpdir(), ".cache");
      env.allowLocalModels = false;
      env.useBrowserCache = false;

      return pipeline("feature-extraction", "Xenova/all-MiniLM-L6-v2");
    })();
  }
  return extractorPromise;
}

export async function generateEmbeddings(texts: string[]): Promise<number[][]> {
  if (!texts || texts.length === 0) {
    return [];
  }

  try {
    const extractor = await getExtractor();
    const output = await extractor(texts, { pooling: "mean", normalize: true });
    const list = output.tolist();
    if (Array.isArray(list) && list.length > 0 && !Array.isArray(list[0])) {
      return [list as unknown as number[]];
    }
    return list as number[][];
  } catch (error) {
    console.error("Error generating embeddings:", error);
    throw new Error("Failed to generate vector embeddings.");
  }
}

export async function generateSingleEmbedding(text: string): Promise<number[]> {
  try {
    const extractor = await getExtractor();
    const output = await extractor(text, { pooling: "mean", normalize: true });
    if (output.data) {
      return Array.from(output.data);
    }
    const list = output.tolist();
    return Array.isArray(list[0]) ? list[0] : list;
  } catch (error) {
    console.error("Error generating single embedding:", error);
    throw new Error("Failed to generate vector embedding.");
  }
}
