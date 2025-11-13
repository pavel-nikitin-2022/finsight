import { createRequire } from 'module'
import mammoth from 'mammoth'

const require = createRequire(import.meta.url)
const { PDFParse } = require('pdf-parse')

export async function parsePDF(buffer: Buffer): Promise<string> {
  try {
    const parser = new PDFParse({ data: new Uint8Array(buffer) })
    const result = await parser.getText()
    return result.text;
  } catch (error: any) {
    throw new Error(`Ошибка чтения PDFа: ${error.message}`)
  }
}

export async function parseWord(buffer: Buffer): Promise<string> {
  try {
    const result = await mammoth.extractRawText({ buffer })
    return result.value
  } catch (error: any) {
    throw new Error(`Ошибка чтения Word документа: ${error.message}`)
  }
}

export async function parseDocument(
  buffer: Buffer,
  mimeType: string
): Promise<string> {
  if (mimeType === 'application/pdf') {
    return parsePDF(buffer)
  } else if (
    mimeType ===
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document' ||
    mimeType === 'application/msword'
  ) {
    return parseWord(buffer)
  } else {
    throw new Error('Неподдерживаемый формат файла')
  }
}
