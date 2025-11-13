CREATE TABLE "financial_analyses" (
	"id" varchar PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"file_name" text NOT NULL,
	"file_type" text NOT NULL,
	"uploaded_at" timestamp DEFAULT now() NOT NULL,
	"analysis_data" jsonb,
	"status" text DEFAULT 'pending' NOT NULL,
	"error_message" text
);
