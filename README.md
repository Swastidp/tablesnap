# TableSnap 📊

> **Transform images of tables, invoices, and financial documents into editable spreadsheets instantly.**

<p align="center">
  <a href="https://table-snap.vercel.app/">
    <img src="https://img.shields.io/badge/🚀_Live_Demo-table--snap.vercel.app-ff4757?style=for-the-badge" alt="Live Demo" />
  </a>
</p>

Built for a 48-hour hackathon, TableSnap solves "The Data Trap" - the painful process of manually converting tabular data from images into Excel/CSV format.

👉 **[Try it now → table-snap.vercel.app](https://table-snap.vercel.app/)**

<!-- Add a screenshot here: ![TableSnap Screenshot](./screenshot.png) -->

## ✨ Features

- **🎯 AI-Powered Extraction** - Powered by Google Gemini 2.5 Flash for accurate table detection
- **📋 Split View Interface** - Original image on the left, extracted data on the right
- **✏️ Edit Before Export** - Fix any AI errors visually before downloading
- **🔍 Zoom & Pan** - Examine your original image with full zoom/pan controls
- **📥 One-Click CSV Export** - Download your verified data instantly
- **✨ Editable Headers** - Rename column headers with a click
- **� Industrial Design** - Unique skeuomorphic UI with LED indicators, vent slots, and scan lines

### 🚀 Power User Features

- **📷 Mobile Camera Capture** - "Scan Document" button triggers native camera on iOS/Android
- **📱 Mobile-First Responsive** - Tabbed interface on mobile, split view on desktop
- **⌨️ Excel-Style Keyboard Navigation** - Navigate cells with Arrow keys, Enter to move down or add rows
- **📋 Copy to Clipboard** - One-click copy as TSV for direct paste into Excel/Google Sheets
- **🔢 Smart Column Alignment** - Numeric columns (Price, Qty, Total, etc.) auto-align right
- **🎉 Success Confetti** - Delightful celebration animation on export
- **⚠️ Empty State Handling** - Friendly UI when no table is detected

## 🚀 Quick Start

**Want to skip setup?** 👉 [Try the live demo](https://table-snap.vercel.app/) - no installation required!

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
- **Styling**: Tailwind CSS v4
- **Design System**: Industrial Skeuomorphism
- **UI Components**: Custom shadcn-style components
- **Animations**: Framer Motion (mechanical spring physics)
- **Confetti**: canvas-confetti
- **Image Viewer**: react-zoom-pan-pinch
- **Data Grid**: TanStack Table
- **CSV Export**: PapaParse
- **AI**: Google Gemini 2.5 Flash
- **Fonts**: Inter + JetBrains Mono

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

TableSnap features an **Industrial Skeuomorphism** design system:
- **Device Aesthetic** - UI feels like physical data processing hardware
- **Neumorphic Shadows** - Soft, realistic depth with light/dark shadow pairs
- **Chassis Grey Base** (#e0e5ec) - Industrial equipment-inspired background
- **Safety Orange Accent** (#ff4757) - High-visibility action color
- **LED Indicators** - Status lights with authentic glow effects
- **Manufacturing Details** - Vent slots, corner screws, screen bezels
- **Scan Line Animation** - Always-active oscillating laser effect
- **JetBrains Mono** - Technical monospace font for data displays
- **Mechanical Spring Physics** - Tactile, responsive animations

## 🔧 How It Works

1. **Upload** - Drop an image, browse files, or tap "Scan Document" to use your camera (mobile)
2. **Process** - Gemini 2.5 Flash analyzes the image and extracts structured data
3. **Verify** - Review the extracted data side-by-side with the original image (desktop) or switch between tabs (mobile)
4. **Edit** - Click any cell or header to fix errors (AI uncertainty marked with [?])
   - Use **Arrow keys** to navigate between cells
   - Press **Enter** to move down (auto-adds row at the end)
5. **Export** - Download as CSV or copy to clipboard for direct paste into Excel/Sheets 🎉

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

**Built with ❤️ for the Entrext**
