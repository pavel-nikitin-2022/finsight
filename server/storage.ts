import { type FinancialAnalysis, type InsertFinancialAnalysis } from "@shared/schema";
import { randomUUID } from "crypto";

export interface IStorage {
  // Financial Analysis methods
  createAnalysis(analysis: InsertFinancialAnalysis): Promise<FinancialAnalysis>;
  getAnalysis(id: string): Promise<FinancialAnalysis | undefined>;
  getAllAnalyses(): Promise<FinancialAnalysis[]>;
  updateAnalysis(id: string, updates: Partial<FinancialAnalysis>): Promise<FinancialAnalysis | undefined>;
}

export class MemStorage implements IStorage {
  private analyses: Map<string, FinancialAnalysis>;

  constructor() {
    this.analyses = new Map();
  }

  async createAnalysis(insertAnalysis: InsertFinancialAnalysis): Promise<FinancialAnalysis> {
    const id = randomUUID();
    const analysis: FinancialAnalysis = {
      ...insertAnalysis,
      id,
      uploadedAt: new Date(),
    };
    this.analyses.set(id, analysis);
    return analysis;
  }

  async getAnalysis(id: string): Promise<FinancialAnalysis | undefined> {
    return this.analyses.get(id);
  }

  async getAllAnalyses(): Promise<FinancialAnalysis[]> {
    return Array.from(this.analyses.values()).sort(
      (a, b) => b.uploadedAt.getTime() - a.uploadedAt.getTime()
    );
  }

  async updateAnalysis(id: string, updates: Partial<FinancialAnalysis>): Promise<FinancialAnalysis | undefined> {
    const existing = this.analyses.get(id);
    if (!existing) return undefined;
    
    const updated = { ...existing, ...updates };
    this.analyses.set(id, updated);
    return updated;
  }
}

export const storage = new MemStorage();
