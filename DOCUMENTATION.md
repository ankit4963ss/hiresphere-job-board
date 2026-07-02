# HireSphere - Feature & Technical Documentation

Welcome to the documentation for **HireSphere**, a premium, glassmorphic Job Board web application designed for developer recruitment. HireSphere connects world-class developers with remote-first, high-growth technology companies through a responsive, interactive, and high-fidelity interface.

---

## 🛠️ Technology Stack

- **Core Framework**: React 19 (Bootstrapped with Vite)
- **Styling**: Vanilla CSS utilizing modern CSS variables for dual-theme overrides, Flexbox, CSS Grid, and custom keyframe animations.
- **State Management**: React Context API synchronized with `localStorage` to ensure persistence across sessions and page reloads.
- **Animations & Micro-interactions**: `canvas-confetti` (for recruitment application celebrations), custom CSS hover filters, and layout slide-overs.
- **Icons**: Standalone custom SVGs and `lucide-react` for guaranteed rendering.

---

## 🎨 Design System & Aesthetics

HireSphere uses a modern **Glassmorphism** styling theme designed to look premium:
- **HSL Colors**: Fully customizable accent gradients ranging from Electric Indigo to Royal Violet.
- **Adaptive Dark Mode (Default)**: Near-black layouts with soft glass cards, subtle neon borders, and shadow elevates.
- **Light Mode**: Crisp, high-contrast layouts with deep slate typography and clean dividers.
- **Micro-animations**: Button shifts, list item expansions, modal popups, and smooth page shifts.

---

## 🚀 Key Features Documentation

### 1. Unified Dark / Light Theme System
- **How it works**: Swaps the global layout stylesheet variables using the HTML `data-theme` attribute.
- **Implementation**: The header contains a dedicated toggle button. Theme preferences are persisted in `localStorage` (`hiresphere_theme`) and apply instantly on load.

### 2. Dual-Role Persona Switcher (Candidate vs. Employer)
- **How it works**: Allows user role switching via a slider pill in the header.
- **Fidelity**: 
  - **Candidate Mode**: Displays explore pages, split-pane search, bookmarks, and a Kanban progress pipeline.
  - **Employer Mode**: Switches the navigation bar to expose the "Post Job" portal and the Employer Workspace Dashboard, where incoming applicants are managed.

### 3. Interactive Hero & Curation Search
- **How it works**: The Home page hero section hosts a dual-input search bar (query keywords and geographic location) with instant validation.
- **Curation**: Clicking categorized department badges (Tech, Design, Product, Marketing) pre-filters and redirects search filters.

### 4. Advanced Split-Pane Job Directory
- **Layout**: Two-column split-pane layout:
  - **Left Pane**: Dynamic card index showing job titles, companies, salary tags, type badges, and save statuses.
  - **Right Pane**: Sticky, detail page highlighting full descriptions, responsibilities, requirements, and benefits.
- **Mobile Support**: Uses sliding screen logic. In mobile viewports, opening a job hides the listings list and slides the detail pane full-screen with a "← Back" button.

### 5. Multi-Step Job Application Wizard
- **How it works**: Clicking "Apply Now" triggers a 5-step modal drawer:
  1. **Personal Information**: Collects name, email, and phone with validation.
  2. **Credentials & Profiles**: Simulated CV/Resume uploader plus Portfolio/GitHub inputs.
  3. **Introduction**: Custom Cover Letter messaging.
  4. **Review & Confirm**: Displays a summary card of all inputs.
  5. **Submission**: Fires full-screen canvas confetti upon completion.
- **Integrations**: Changes "Apply Now" buttons to "Applied" and updates the candidate pipeline status.

### 6. Employer "Post a Job" Submission Portal
- **How it works**: A multi-step form wizard allowing employers to detail company profiles, choose brand colors, define specifications, and view a live mock rendering of the card before posting.
- **Fidelity**: Instantly indexes the posted job in the database context so it appears in live searches.

### 7. Candidate Kanban Dashboard
- **How it works**: Implements a 4-column Kanban board (Applied, In Review, Interviewing, Offered) tracking candidate applications.
- **Fidelity**: Integrates with the Employer Workspace. Status adjustments made by the employer reflect instantly here.

### 8. Employer Applicant Tracking Workspace
- **How it works**: Displays a list of all incoming job applications.
- **Controls**: Expanding a candidate's profile displays their contact info, portfolio links, cover letter, and attached CV. The employer can toggle the candidate's stage using a drop-down selector.

---

## 📦 Local Setup Instructions

1. **Prerequisites**: Ensure Node.js (v18+) and npm are installed.
2. **Install Dependencies**:
   ```bash
   npm install
   ```
3. **Run Development Server**:
   ```bash
   npm run dev
   ```
4. **Compile Production Build**:
   ```bash
   npm run build
   ```
5. **Preview Production Build**:
   ```bash
   npm run preview
   ```

---

## 🛠️ CI/CD & Deployment Guide

This project is configured for automated deployment to **Vercel** via **GitHub Actions**.

### 1. GitHub Actions Pipeline Configuration
Create a `.github/workflows/deploy.yml` file with the following configuration:
```yaml
name: CI/CD Pipeline

on:
  push:
    branches:
      - main
  pull_request:
    branches:
      - main

jobs:
  build-and-test:
    name: Build & Verify Compilation
    runs-on: ubuntu-latest
    steps:
      - name: Checkout Code
        uses: actions/checkout@v4

      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: 20
          cache: 'npm'

      - name: Install Dependencies
        run: npm ci

      - name: Run Build
        run: npm run build

  deploy-to-vercel:
    name: Deploy to Vercel
    needs: build-and-test
    if: github.ref == 'refs/heads/main' && github.event_name == 'push'
    runs-on: ubuntu-latest
    steps:
      - name: Checkout Code
        uses: actions/checkout@v4

      - name: Install Vercel CLI
        run: npm install --global vercel@latest

      - name: Pull Vercel Project Info
        run: vercel pull --yes --environment=production --token=${{ secrets.VERCEL_TOKEN }}
        env:
          VERCEL_PROJECT_ID: ${{ secrets.VERCEL_PROJECT_ID }}
          VERCEL_ORG_ID: ${{ secrets.VERCEL_ORG_ID }}

      - name: Build Project Artifacts
        run: vercel build --prod --token=${{ secrets.VERCEL_TOKEN }}

      - name: Deploy Project to Vercel
        run: vercel deploy --prebuilt --prod --token=${{ secrets.VERCEL_TOKEN }}
        env:
          VERCEL_TOKEN: ${{ secrets.VERCEL_TOKEN }}
```

### 2. Required GitHub Repository Secrets
To enable automated Vercel deployment, add the following secrets under GitHub Repo Settings > Secrets and Variables > Actions:
- `VERCEL_TOKEN`: Your Vercel Personal Access Token.
- `VERCEL_ORG_ID`: Your Vercel Organization/Team ID.
- `VERCEL_PROJECT_ID`: Your Vercel Project ID.
