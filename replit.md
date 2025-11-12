# Financial Report Analysis Platform

## Overview

This is an AI-powered financial report analysis platform that enables users to upload financial documents (PDF, Word) and receive structured analytical insights. The application processes uploaded documents through OpenAI's GPT API to extract key financial indicators, assess risks, and provide investment recommendations. Users can view analysis history and detailed dashboards displaying financial metrics, risk assessments, and investment grades.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture

**Framework**: React with TypeScript using Vite as the build tool

**Routing**: Client-side routing implemented with Wouter for lightweight navigation between home page, analysis dashboards, and error pages

**UI Component System**: Dual approach combining VKUI (VK Design System) with shadcn/ui (Radix UI primitives)
- VKUI provides the primary component library for panels, cards, placeholders, and navigation, ensuring consistency with Russian market design patterns
- shadcn/ui components (Radix-based) supplement with additional form controls, dialogs, and utility components
- Tailwind CSS for styling with custom design tokens extending the base configuration

**State Management**: TanStack Query (React Query) for server state management
- Handles data fetching, caching, and synchronization
- Implements polling mechanism for real-time status updates on pending analyses
- Centralized query client configuration with custom fetch wrappers

**Key Design Decisions**:
- System-based design approach using VKUI for professional financial tool aesthetics
- Progressive disclosure pattern: upload → analysis → detailed insights
- Responsive grid layouts adapting from single column (mobile) to multi-column (desktop)
- Real-time polling every 2-5 seconds to track document processing status

### Backend Architecture

**Runtime**: Node.js with Express.js framework

**Type Safety**: Full TypeScript implementation across server codebase

**API Design**: RESTful endpoints with multipart form data support for file uploads
- POST `/api/upload` - Document upload and analysis initiation
- GET `/api/analyses` - List all analyses with status
- GET `/api/analyses/:id` - Retrieve specific analysis results

**File Processing Pipeline**:
1. Multer middleware handles file uploads with size limits (10MB) and MIME type validation
2. Document parsers extract text from PDF (pdf-parse) and Word documents (mammoth)
3. Extracted text sent to OpenAI API with structured prompt
4. JSON response validated against Zod schema and stored
5. Asynchronous processing allows immediate response with polling-based status updates

**Data Storage Strategy**: In-memory storage using Map-based implementation (MemStorage class)
- Abstracted through IStorage interface to enable future database migration
- UUID-based identifiers for analyses
- Chronological sorting with most recent analyses first

**Error Handling**: Centralized error responses with Russian language error messages, validation at file type and content levels

### External Dependencies

**AI/ML Services**:
- **OpenAI GPT API**: Core analysis engine for financial document processing
  - Model: Configurable (currently references gpt-5 in comments)
  - Structured prompt engineering for consistent JSON output
  - Financial domain expertise: metrics extraction, risk assessment, investment grading
  - API key stored in environment variable `OPENAI_API_KEY`

**Database**: PostgreSQL with Drizzle ORM
- Schema defined in `shared/schema.ts` with financial_analyses table
- Connection via `@neondatabase/serverless` for Neon Database compatibility
- Drizzle Kit for migrations and schema management
- Environment variable `DATABASE_URL` required for connection
- Note: Current implementation uses in-memory storage; database integration prepared but not active

**Third-Party Libraries**:
- **pdf-parse**: PDF text extraction
- **mammoth**: Microsoft Word document parsing (.docx, .doc)
- **multer**: Multipart form data handling for file uploads
- **Radix UI**: Accessible component primitives (20+ component packages)
- **VKUI**: VKontakte design system components and icons
- **TanStack Query**: Server state management
- **Zod**: Runtime schema validation
- **Drizzle ORM**: Type-safe SQL query builder

**Development Tools**:
- **Vite**: Frontend build tool with HMR and React plugin
- **tsx**: TypeScript execution for development server
- **esbuild**: Production bundling for server code
- **Tailwind CSS**: Utility-first styling with PostCSS processing

**Authentication**: Currently not implemented; session management infrastructure present (connect-pg-simple) but not actively used

**Validation Schema**: Strict JSON structure enforcement via Zod for OpenAI responses
- Three-section analysis format: General Characteristics, Risk Analysis, Investment Attractiveness
- Nullable fields for incomplete data handling
- Enum validation for investment grade (Покупать/Держать/Продавать)