import { createRequire } from 'module'
import mammoth from 'mammoth'
import PDFParser from 'pdf2json'
function safeDecode(str: string): string {
  try {
    return decodeURIComponent(str)
  } catch {
    return str.replace(/%[0-9A-Fa-f]{2}/g, (m) => {
      try {
        return decodeURIComponent(m)
      } catch {
        return m
      }
    })
  }
}

export async function parsePDF(buffer: Buffer): Promise<string> {
  return new Promise((resolve, reject) => {
    const pdfParser = new PDFParser()

    pdfParser.on('pdfParser_dataError', (errData: any) => {
      reject(new Error(`Ошибка чтения PDFа: ${errData.parserError}`))
    })

    pdfParser.on('pdfParser_dataReady', (data: any) => {
      try {
        const text = data?.Pages?.map((page: any) =>
          page.Texts.map((t: any) =>
            t.R.map((r: any) => safeDecode(r.T)).join('')
          ).join(' ')
        ).join('\n\n')

        resolve(text || '')
      } catch (e: any) {
        reject(new Error(`Ошибка парсинга PDF: ${e.message}`))
      }
    })

    try {
      pdfParser.parseBuffer(buffer)
    } catch (e: any) {
      reject(new Error(`Ошибка чтения PDF: ${e.message}`))
    }
  })
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
