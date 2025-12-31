# TableSnap Project Instructions

## Project Overview
TableSnap is a MicroSaaS application that converts images of tables/invoices into editable spreadsheets using AI (Google Gemini 3.0 Flash).

## Tech Stack
- **Framework**: Next.js 15 with App Router
- **Language**: TypeScript
- **Styling**: Tailwind CSS with custom fintech color palette
- **UI**: Custom shadcn-style components
- **Animations**: Framer Motion
- **Image Handling**: react-zoom-pan-pinch
- **Data Grid**: TanStack React Table
- **CSV Export**: PapaParse
- **AI**: Google Gemini 3.0 Flash via @google/generative-ai

## Key Files
- `src/app/page.tsx` - Main application with state management
- `src/app/api/extract/route.ts` - Gemini API integration
- `src/components/dropzone.tsx` - File upload with animations
- `src/components/workspace.tsx` - Split view layout
- `src/components/editable-table.tsx` - TanStack editable table
- `src/components/image-viewer.tsx` - Zoomable image viewer
- `src/components/status-stepper.tsx` - Processing progress indicator

## Color Palette
- Primary: Deep blues (#1e3a5f)
- Accent: Bright blue (#0066ff)
- Success: Green (#10b981)
- Warning: Amber (#f59e0b)
- Error: Red (#ef4444)

## Running the Project
```bash
npm run dev    # Development server with Turbopack
npm run build  # Production build
npm start      # Production server
```

## Environment Variables
- `GOOGLE_GENERATIVE_AI_API_KEY` - Required for Gemini AI
