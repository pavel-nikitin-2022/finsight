# Design Guidelines: Financial Report Analysis Platform

## Design Approach
**System-Based Approach**: VKUI Design System (as specified)
- Rationale: Enterprise financial tool requiring consistency, data-heavy displays, and professional aesthetic
- VKUI provides robust components for Russian market alignment and data visualization

## Core Design Principles
1. **Data Clarity**: Financial metrics must be immediately scannable with clear hierarchy
2. **Progressive Disclosure**: Guide users from upload → analysis → detailed insights
3. **Trust Signals**: Professional, authoritative presentation befitting financial analysis
4. **Action-Oriented**: Clear CTAs for each workflow stage

## Typography System
- **Primary Font**: -apple-system, BlinkMacSystemFont, Roboto (VKUI default stack)
- **Headline**: 28px bold for page titles, 20px semibold for section headers
- **Body**: 15px regular for content, 13px for metadata
- **Numbers/Metrics**: 32px bold for key indicators, tabular figures enabled

## Layout & Spacing
**Spacing Units**: Use Tailwind units of 3, 4, 6, 8, 12, 16 (p-3, m-4, gap-6, h-8, py-12, px-16)
- Page padding: px-4 mobile, px-6 desktop
- Card spacing: p-6
- Section gaps: gap-8 between major sections
- Metric cards: p-4 internal spacing

## Page-Specific Layouts

### Home/Upload Page
- **Hero Section** (60vh): Centered content zone with upload dropzone
  - Large icon (96px) representing document analysis
  - Headline: "Анализ финансовых отчетов" (28px bold)
  - Subheadline explaining AI-powered analysis (15px regular, max-w-xl)
  - Primary upload button (56px height, px-8)
  - Supported formats indicator below button

- **History Section**: Below fold
  - Grid layout: 1 column mobile, 2 columns tablet, 3 columns desktop
  - Each history card: Document name, date, investment grade badge, thumbnail preview
  - Hover state reveals quick actions

### Dashboard/Results Page
- **Header Bar**: Sticky top navigation
  - Document name (truncated), analysis timestamp, back button
  
- **Investment Grade Banner** (full-width, py-6):
  - Centered large badge with investment verdict
  - Color coding: Green (Покупать), Yellow (Держать), Red (Продавать)
  - Background blur treatment for depth

- **Key Metrics Grid** (4 columns desktop, 2 mobile):
  - Large metric cards with icon, label, value, comparison indicator
  - Revenue, Net Profit, EBITDA, Margin displayed prominently
  - Each card: min-height 160px, shadow-md elevation

- **Analysis Sections** (3 vertical stacked sections):
  - Each section: Full-width card with py-8, px-6
  - Section title (20px semibold), content in readable columns
  - Risk severity uses visual indicators (icons + color dots)

## Component Specifications

### Upload Dropzone
- Dashed border (2px), rounded-2xl
- Drag-active state with background color shift
- Icon + text centered vertically
- Minimum height: 320px

### Metric Cards
- Rounded-xl corners
- Shadow elevation for depth
- Icon (32px) top-left
- Metric value (32px bold) centered
- Label below (13px, opacity-70)
- Percentage change badge (if applicable)

### History Cards
- Rounded-lg, border treatment
- Thumbnail preview (80px square) left aligned
- Content flex column: title, date, grade badge
- Hover: subtle shadow increase

### Investment Grade Badge
- Pill shape (rounded-full)
- Padding: px-6 py-3
- Font: 15px semibold uppercase tracking-wide
- Icon prefix matching verdict

## Color Application (VKUI Palette)
- Use VKUI's semantic color tokens
- Success (green) for "Покупать"
- Warning (yellow/orange) for "Держать"  
- Destructive (red) for "Продавать"
- Accent blue for primary actions
- Neutral grays for backgrounds and borders

## Data Visualization
- Use simple, readable formats for financial data
- Tabular layout for risk assessments
- Progress indicators for severity levels
- Comparison arrows/icons for dynamics

## Navigation
- Top app bar (VKUI PanelHeader) on all pages
- Back navigation on dashboard
- Breadcrumb trail for context

## States & Feedback
- Loading: VKUI Spinner during API calls with "Анализируем документ..." message
- Error: Alert card with clear error message and retry option
- Success: Smooth transition to dashboard
- Empty history: Illustration + "Загрузите первый отчет" message

## Accessibility
- Proper heading hierarchy (h1 → h2 → h3)
- ARIA labels for metric cards
- Keyboard navigation for all interactive elements
- Sufficient color contrast (WCAG AA minimum)

## Images
**Hero Section Illustration**: Abstract financial/data visualization graphic (charts, graphs, documents) - positioned as background or adjacent to upload zone, subtle opacity treatment

**Empty State**: Simple line illustration of documents/charts for empty history view

This design creates a professional, data-focused experience that balances VKUI's systematic approach with the need for impactful financial data presentation.