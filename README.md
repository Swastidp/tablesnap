# TableSnap 📊

> **Transform images of tables, invoices, and financial documents into editable spreadsheets instantly.**

Built for a 48-hour hackathon, TableSnap solves "The Data Trap" - the painful process of manually converting tabular data from images into Excel/CSV format.

![TableSnap](https://via.placeholder.com/800x400?text=TableSnap+Demo)

## ✨ Features

- **🎯 AI-Powered Extraction** - Powered by Google Gemini 2.5 Flash for accurate table detection
- **📋 Split View Interface** - Original image on the left, extracted data on the right
- **✏️ Edit Before Export** - Fix any AI errors visually before downloading
- **🔍 Zoom & Pan** - Examine your original image with full zoom/pan controls
- **📥 One-Click CSV Export** - Download your verified data instantly
- **✨ Editable Headers** - Rename column headers with a click
- **🎨 Polished UX** - Animated dropzone, status stepper, and professional fintech design

## 🚀 Quick Start

### Prerequisites

- Node.js 18+ 
- A Google Gemini API key ([Get one here](https://aistudio.google.com/app/apikey))

### Installation

1. **Clone the repository**
   ```bash
   cd tablesnap
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   ```bash
   cp .env.example .env.local
   ```
   
   Edit `.env.local` and add your Gemini API key:
   ```
   GOOGLE_GENERATIVE_AI_API_KEY=your_api_key_here
   ```

4. **Start the development server**
   ```bash
   npm run dev
   ```

5. **Open your browser**
   Navigate to [http://localhost:3000](http://localhost:3000)

## 🛠️ Tech Stack

- **Framework**: Next.js 15 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **UI Components**: Custom shadcn-style components
- **Animations**: Framer Motion
- **Image Viewer**: react-zoom-pan-pinch
- **Data Grid**: TanStack Table
- **CSV Export**: PapaParse
- **AI**: Google Gemini 2.5 Flash

## 📁 Project Structure

```
tablesnap/
├── src/
│   ├── app/
│   │   ├── api/
│   │   │   └── extract/
│   │   │       └── route.ts      # Gemini API integration
│   │   ├── globals.css           # Global styles
│   │   ├── layout.tsx            # Root layout
│   │   └── page.tsx              # Main page component
│   ├── components/
│   │   ├── ui/                   # Base UI components
│   │   │   ├── button.tsx
│   │   │   ├── card.tsx
│   │   │   ├── input.tsx
│   │   │   ├── scroll-area.tsx
│   │   │   └── table.tsx
│   │   ├── dropzone.tsx          # File upload dropzone
│   │   ├── editable-table.tsx    # TanStack editable table
│   │   ├── image-viewer.tsx      # Zoom/pan image viewer
│   │   ├── status-stepper.tsx    # Loading progress stepper
│   │   └── workspace.tsx         # Split view workspace
│   └── lib/
│       └── utils.ts              # Utility functions
├── .env.local                    # Environment variables
├── tailwind.config.ts            # Tailwind configuration
└── package.json
```

## 🎨 Design Philosophy

TableSnap was built with a "Fintech" design aesthetic:
- Clean whites and grays as base colors
- Deep blue accent (#0066ff) for primary actions
- Subtle animations for delightful micro-interactions
- Professional typography with Inter font
- Generous whitespace and rounded corners

## 🔧 How It Works

1. **Upload** - Drop or select an image containing a table (PNG, JPG, WEBP, HEIC)
2. **Process** - Gemini 2.5 Flash analyzes the image and extracts structured data
3. **Verify** - Review the extracted data side-by-side with the original image
4. **Edit** - Click any cell or header to fix errors (AI uncertainty marked with [?])
5. **Export** - Download as CSV with one click

## 📝 AI System Prompt

The extraction uses a carefully crafted prompt to ensure accurate results:

```
You are an expert Data Extraction AI. Your job is to look at the provided image 
(which contains a table, invoice, or financial document) and extract the data 
into a strict JSON format.

RULES:
1. Identify the headers of the table. If no headers exist, generate logical ones.
2. Return a JSON Object with "headers" and "rows" keys.
3. If a cell is unclear, flag it with "[?]" suffix.
4. Return raw JSON only (no markdown formatting).
5. If no table detected, return {"error": "No table detected"}.
```

## 🚀 Deployment

### Vercel (Recommended)

1. Push your code to GitHub
2. Import the project in Vercel
3. Add `GOOGLE_GENERATIVE_AI_API_KEY` to environment variables
4. Deploy!

### Other Platforms

```bash
npm run build
npm start
```

## 📄 License

MIT License - feel free to use this for your own projects!

---

**Built with ❤️ for the hackathon**
