import * as pdfParse from "pdf-parse";
import mammoth from "mammoth";

export async function parsePDF(buffer: Buffer): Promise<string> {
  try {
    const data = await (pdfParse as any).default(buffer);
    return data.text;
  } catch (error: any) {
    throw new Error(`Ошибка чтения PDF: ${error.message}`);
  }
}

export async function parseWord(buffer: Buffer): Promise<string> {
  try {
    const result = await mammoth.extractRawText({ buffer });
    return result.value;
  } catch (error: any) {
    throw new Error(`Ошибка чтения Word документа: ${error.message}`);
  }
}

export async function parseDocument(buffer: Buffer, mimeType: string): Promise<string> {
  if (mimeType === "application/pdf") {
    return parsePDF(buffer);
  } else if (
    mimeType === "application/vnd.openxmlformats-officedocument.wordprocessingml.document" ||
    mimeType === "application/msword"
  ) {
    return parseWord(buffer);
  } else {
    throw new Error("Неподдерживаемый формат файла");
  }
}
