// @ts-ignore
import pdfParse from "pdf-parse";
import mammoth from "mammoth";

function cleanText(text: string): string {
    return text
        .replace(/\u0000/g, "") // Remove null characters
        .replace(/(\r\n|\n|\r)/gm, " ") // Replace newlines with spaces
        .replace(/\s+/g, " ") // Collapse multiple spaces into one
        .trim();
}

export async function extractTextFromFile(file: File): Promise<string> {
    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    const extension = file.name.split(".").pop()?.toLowerCase();

    let rawText = "";

    try {
        switch (extension) {
            case "pdf":
                const pdfData = await pdfParse(buffer);
                rawText = pdfData.text;
                break;
            case "docx":
                const docxData = await mammoth.extractRawText({ buffer });
                rawText = docxData.value;
                break;
            case "txt":
            case "md":
                rawText = buffer.toString("utf-8");
                break;
            default:
                throw new Error(`Unsupported file type: .${extension}`);
        }
        if (!rawText || rawText.trim() === "") {
            throw new Error("No text could be extracted from the document.");
        }
        return cleanText(rawText);
    } catch (error) {
        console.error("Error parsing document:", error);
        throw new Error("Failed to parse document content.");
    }
}