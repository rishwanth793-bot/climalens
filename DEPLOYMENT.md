# ClimateLens — Vercel Deployment Guide

This guide details how to deploy the **ClimateLens** environmental verification platform to [Vercel](https://vercel.com).

---

## Architecture Overview

ClimateLens uses a dual-layer architecture configured for Vercel:

1. **Frontend**: React 19 + Tailwind CSS + Lucide + Recharts built with **Vite** into static assets (`dist/`), distributed worldwide via Vercel Edge CDN.
2. **Backend API**: Node.js Express serverless function (`api/index.ts`), handling:
   - `/api/health` — Engine health & configuration status
   - `/api/ai/analyze-environmental-text` — Custom PDF / report text extraction
   - `/api/ai/verify-values` — Multi-tier statutory re-verification & math reconciliation
   - `/api/ai/chat` — Gemini AI Assistant with CPCB / GHG Protocol grounding
3. **Routing (`vercel.json`)**:
   - `/api/*` requests route to `api/index.ts`
   - All other routes route to `index.html` (Single-Page Application client routing)

---

## Option 1: Deploy with Vercel CLI (Fastest)

If you have Node.js and npm/npx or Bun installed on your deployment workstation:

1. **Open your terminal in the project directory**:
   ```bash
   cd Remix-Remix-Remix-Remix-Remix-ClimateLens
   ```

2. **Deploy directly with Vercel CLI**:
   ```bash
   npx vercel
   ```
   - Follow the prompts to log in and select/create your Vercel project.
   - For framework preset, select **Vite**.
   - Output directory will automatically be set to **`dist`**.

3. **Deploy to production**:
   ```bash
   npx vercel --prod
   ```

---

## Option 2: Deploy via GitHub / GitLab / Bitbucket (Recommended for CI/CD)

1. **Initialize Git & Push to GitHub**:
   ```bash
   git init
   git add .
   git commit -m "Initial ClimateLens verification platform release"
   git branch -M main
   git remote add origin https://github.com/YOUR_USERNAME/climatelens.git
   git push -u origin main
   ```

2. **Import Project into Vercel**:
   - Navigate to [vercel.com/new](https://vercel.com/new).
   - Select your GitHub repository: `climatelens`.
   - Vercel automatically detects the `vercel.json` configuration:
     - **Framework Preset**: Vite
     - **Build Command**: `vite build`
     - **Output Directory**: `dist`

3. **Configure Environment Variables** (Under *Environment Variables* in Vercel project settings):
   | Variable | Value | Description |
   |---|---|---|
   | `GEMINI_API_KEY` | `AIzaSy...` | Optional. Enables live Google Gemini 2.5/3.8 Flash model generation & search grounding. |
   | `NODE_ENV` | `production` | Recommended. Sets production optimization mode. |

4. **Click Deploy**:
   Vercel will build the frontend assets, bundle the serverless API function, and assign you a live HTTPS URL (e.g., `https://climatelens-yourproject.vercel.app`).

---

## Verification & Post-Deployment Checklist

After deployment succeeds:

1. **Health Check**:
   Open `https://<your-vercel-domain>/api/health` in your browser:
   ```json
   {
     "status": "ok",
     "system": "ClimateLens Environmental Intelligence Engine",
     "hasGeminiKey": true,
     "mode": "AI-Integrated Environmental Verification"
   }
   ```

2. **Frontend Navigation**:
   - Verify all routes load without 404s:
     - `/` (Overview)
     - `/raw-data` (Dense report breakdown)
     - `/clean-data` (Standardized metrics & audit drawer)
     - `/history` (Historical trends & reports archive)
     - `/verification` (Consistency checks & investigate panel)
     - `/flags` (Flag investigation)
     - `/environmental-context` (Zonal CAAQMS ambient telemetry)
     - `/final-report` (Official verification dossier with PDF & CSV export)
     - `/settings` (Governance & threshold configuration)

3. **Interactive Features**:
   - Test **Download PDF** and **Export CSV** on the Final Report page.
   - Open **ClimateLens AI Assistant** (bottom right) and test an environmental inquiry.
