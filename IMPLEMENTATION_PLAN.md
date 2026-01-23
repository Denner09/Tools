# Implementation Plan: Migration to React.js + Bootstrap

This plan outlines the steps to migrate the existing "Business Tools" logic (currently Vue.js/Vanilla) to a modern React.js application using Vite and Bootstrap.

## 1. Project Setup & Initialization

- [ ] Initialize a new Vite project with React template in the root directory.
- [ ] Install Core Dependencies: `react`, `react-dom`, `react-router-dom`.
- [ ] Install UI Dependencies: `bootstrap`, `react-bootstrap`, `sass` (for custom styles).
- [ ] Install Feature Dependencies (matching legacy):
  - `pdf-lib`, `jspdf`, `html2canvas`, `file-saver`, `jszip` (PDF/File tools)
  - `bpmn-js` (BPMN Modeler)
  - `tesseract.js` (OCR)
  - `@fortawesome/fontawesome-free` (Icons)
  - `browser-image-compression` (Image tools)
  - `mammoth`, `xlsx` (Office tools)

## 2. Architecture & File Structure

- [ ] Configure `src` directory structure:
  - `/components`: Reusable UI components (Navbar, Footer, Sidebar, Cards).
  - `/pages`: Page views (Home, PDFTools, BPMNModeler, TextTools).
  - `/assets`: Static assets (images, logos).
  - `/styles`: Global styles and Bootstrap overrides (`main.scss`).
  - `/hooks`: Custom React hooks for logic reuse.
  - `/utils`: Helper functions (text processing, file handling).
  - `/context`: React Context for global state (Theme, User preferences).

## 3. Styling & Theme Setup

- [ ] Create `src/styles/main.scss`.
- [ ] Import Bootstrap SASS.
- [ ] Implement the "Premium" Dark Mode/Light Mode logic using CSS variables and a React Context (`ThemeContext`).
- [ ] Port existing CSS variables from `legacy_source` to `main.scss`.

## 4. Component Migration Strategy

### A. Core Layout

- [ ] **App.jsx**: Setup `BrowserRouter` and Routes.
- [ ] **Layout Component**: Create a layout wrapper containing the Navbar and Footer to wrap all pages.
- [ ] **Navbar**: Port the responsive Bootstrap navbar, integrate `react-router-dom` Links.

### B. HomePage

- [ ] Create `Home.jsx`.
- [ ] Port the "Hero" section and Feature Cards.

### C. Text Tools (Editor/Converter)

- [ ] Create `TextTools.jsx`.
- [ ] Port logic for:
  - Uppercase/Lowercase/TitleCase functions.
  - CNJ Formatter.
  - Stats (Word/Char count).
  - Removal of line breaks.
- [ ] create UI for input/output text areas using React state.

### D. PDF Tools

- [ ] Create `PDFTools.jsx` (Dashboard for PDF tools).
- [ ] Create granular components or routes for specific PDF actions if complex (e.g., `PDFMerge`, `PDFCompress`), or keep as a single tool suite page with tabs/modals.
- [ ] **Important**: Port `pdf-lib` and `Ghostscript` integration. _Note: Ghostscript WASM might need specific static file handling in Vite `public` folder._

### E. BPMN Modeler

- [ ] Create `BPMNModeler.jsx`.
- [ ] Initialize `bpmn-js` modeler inside a `useEffect` hook, attaching it to a DOM ref.
- [ ] Port Import/Export (XML, SVG, PDF) logic.
- [ ] Handle resizing and property panel logic.

## 5. Logic Refactoring & Optimization

- [ ] Convert direct DOM manipulation (Vanilla JS style) to React State/Refs.
- [ ] Ensure standard `useEffect` usage for third-party libs (BPMN, OCR).

## 6. Final Polish

- [ ] Verify Responsiveness on all pages.
- [ ] Test Dark Mode switching.
- [ ] PWA Setup (optional/later): Configure `vite-plugin-pwa`.
- [ ] Clean up `legacy_source` references.
