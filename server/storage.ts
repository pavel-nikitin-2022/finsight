import { db, financialAnalyses } from './db'
import {
  type FinancialAnalysis,
  type InsertFinancialAnalysis,
} from '@shared/schema'
import { eq } from 'drizzle-orm'

export interface IStorage {
  // Financial Analysis methods
  createAnalysis(analysis: InsertFinancialAnalysis): Promise<FinancialAnalysis>
  getAnalysis(id: string): Promise<FinancialAnalysis | undefined>
  getAllAnalyses(): Promise<FinancialAnalysis[]>
  updateAnalysis(
    id: string,
    updates: Partial<FinancialAnalysis>
  ): Promise<FinancialAnalysis | undefined>
}

export class PostgresStorage implements IStorage {
  async createAnalysis(
    insertAnalysis: InsertFinancialAnalysis
  ): Promise<FinancialAnalysis> {
    const [created] = await db
      .insert(financialAnalyses)
      .values(insertAnalysis)
      .returning()

    return created
  }

  async getAnalysis(id: string): Promise<FinancialAnalysis | undefined> {
    const analysis = await db
      .select()
      .from(financialAnalyses)
      .where(eq(financialAnalyses.id, id))
      .limit(1)

    return analysis[0]
  }

  async getAllAnalyses(): Promise<FinancialAnalysis[]> {
    return await db
      .select()
      .from(financialAnalyses)
      .orderBy(financialAnalyses.uploadedAt, 'desc')
  }

  async updateAnalysis(
    id: string,
    updates: Partial<FinancialAnalysis>
  ): Promise<FinancialAnalysis | undefined> {
    const [updated] = await db
      .update(financialAnalyses)
      .set(updates)
      .where(eq(financialAnalyses.id, id))
      .returning()

    return updated
  }
}

export const storage = new PostgresStorage();
