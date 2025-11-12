import { sql } from "drizzle-orm";
import { pgTable, text, varchar, timestamp, jsonb } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

// Financial Analysis Schema
export const financialAnalyses = pgTable("financial_analyses", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  fileName: text("file_name").notNull(),
  fileType: text("file_type").notNull(),
  uploadedAt: timestamp("uploaded_at").defaultNow().notNull(),
  analysisData: jsonb("analysis_data"),
  status: text("status").notNull().default("pending"),
  errorMessage: text("error_message"),
});

// Zod schemas for the OpenAI response structure
export const mainIndicatorsSchema = z.object({
  revenue: z.string().nullable(),
  net_profit: z.string().nullable(),
  ebitda: z.string().nullable(),
  profit_margin: z.string().nullable(),
});

export const section1Schema = z.object({
  title: z.string(),
  main_indicators: mainIndicatorsSchema,
  dynamics: z.string().nullable(),
  industry_position: z.string().nullable(),
});

export const section2Schema = z.object({
  title: z.string(),
  red_flags_summary: z.string().nullable(),
  risk_severity: z.string().nullable(),
  additional_check_recommendations: z.string().nullable(),
});

export const section3Schema = z.object({
  title: z.string(),
  financial_health: z.string().nullable(),
  opportunities_and_threats: z.string().nullable(),
  investment_conclusion: z.string().nullable(),
  investment_grade: z.enum(["Покупать", "Держать", "Продавать"]).nullable(),
});

export const analysisDataSchema = z.object({
  section_1: section1Schema,
  section_2: section2Schema,
  section_3: section3Schema,
});

export const insertFinancialAnalysisSchema = createInsertSchema(financialAnalyses).omit({
  id: true,
  uploadedAt: true,
});

export type InsertFinancialAnalysis = z.infer<typeof insertFinancialAnalysisSchema>;
export type FinancialAnalysis = typeof financialAnalyses.$inferSelect;
export type AnalysisData = z.infer<typeof analysisDataSchema>;
export type MainIndicators = z.infer<typeof mainIndicatorsSchema>;
export type Section1 = z.infer<typeof section1Schema>;
export type Section2 = z.infer<typeof section2Schema>;
export type Section3 = z.infer<typeof section3Schema>;
