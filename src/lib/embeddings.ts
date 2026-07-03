import { HfInference } from "@huggingface/inference";

const hf = new HfInference(process.env.HUGGINGFACE_API_KEY);

const EMBEDDING_MODEL = "sentence-transformers/all-MiniLM-L6-v2";


export async function generateEmbeddings(texts: string[]): Promise<number[][]> {
    if (!texts || texts.length == 0) {
        return [];
    }

    try {
        // We use featureExtraction to get the embeddings
        const output = await hf.featureExtraction({
            model: EMBEDDING_MODEL,
            inputs: texts,
        });
        // The Hugging Face API returns a 1D, 2D, or 3D array depending on the input shape.
        // For an array of strings, it returns a 2D array (number[][]).
        // We ensure we cast it correctly.
        return output as number[][];
    } catch (error) {
        console.error("Error generating embeddings:", error);
        throw new Error("Failed to generate vector embeddings.");
    }
}

export async function generateSingleEmbedding(text: string): Promise<number[]> {
    const embeddings = await generateEmbeddings([text]);
    return embeddings[0];
}