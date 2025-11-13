import type { Express } from 'express'
import { createServer, type Server } from 'http'
import multer from 'multer'
import { storage } from './storage'
import { parseDocument } from './documentParser'
import { analyzeFinancialDocument } from './openai'
import { analysisDataSchema } from '@shared/schema'

const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 10 * 1024 * 1024, // 10MB limit
  },
  fileFilter: (req, file, cb) => {
    const allowedMimes = [
      'application/pdf',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      'application/msword',
    ]
    if (allowedMimes.includes(file.mimetype)) {
      cb(null, true)
    } else {
      cb(new Error('Поддерживаются только PDF и Word документы'))
    }
  },
})

export async function registerRoutes(app: Express): Promise<Server> {
  // Upload and analyze document
  app.post('/api/upload', upload.single('file'), async (req, res) => {
    try {
      if (!req.file) {
        return res.status(400).json({ message: 'Файл не предоставлен' })
      }

      const fileName = Buffer.from(req.file.originalname, 'latin1').toString(
        'utf8'
      )

      // Create initial analysis record
      const analysis = await storage.createAnalysis({
        fileName,
        fileType: req.file.mimetype,
        status: 'pending',
        analysisData: null,
        errorMessage: null,
      })

      // Process document in background
      setImmediate(async () => {
        try {
          // Parse document text
          const documentText = await parseDocument(
            req.file!.buffer,
            req.file!.mimetype
          )

          if (!documentText || documentText.trim().length < 100) {
            throw new Error('Документ слишком короткий или не содержит текста')
          }

          // Analyze with OpenAI
          const analysisData = await analyzeFinancialDocument(documentText)

          // Validate the response structure
          const validatedData = analysisDataSchema.parse(analysisData)

          // Update analysis with results
          await storage.updateAnalysis(analysis.id, {
            status: 'completed',
            analysisData: validatedData,
          })
        } catch (error: any) {
          console.error('Analysis error:', error)
          await storage.updateAnalysis(analysis.id, {
            status: 'failed',
            errorMessage:
              error.message || 'Произошла ошибка при анализе документа',
          })
        }
      })

      return res.json(analysis)
    } catch (error: any) {
      console.error('Upload error:', error)
      return res
        .status(500)
        .json({ message: error.message || 'Ошибка загрузки файла' })
    }
  })

  // Get all analyses
  app.get('/api/analyses', async (req, res) => {
    try {
      const analyses = await storage.getAllAnalyses()
      return res.json(analyses)
    } catch (error: any) {
      console.error('Get analyses error:', error)
      return res
        .status(500)
        .json({ message: 'Ошибка получения списка анализов' })
    }
  })

  // Get single analysis
  app.get('/api/analyses/:id', async (req, res) => {
    try {
      const analysis = await storage.getAnalysis(req.params.id)
      if (!analysis) {
        return res.status(404).json({ message: 'Анализ не найден' })
      }
      return res.json(analysis)
    } catch (error: any) {
      console.error('Get analysis error:', error)
      return res.status(500).json({ message: 'Ошибка получения анализа' })
    }
  })

  const httpServer = createServer(app)
  return httpServer
}
