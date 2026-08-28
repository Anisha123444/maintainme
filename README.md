# MM — Maintain Me 🍓

> **Maintain your money. Maintain your month. Maintain yourself.**

**MM** is a personal monthly finance organizer designed as a single-device finance journal with a distinctive **pastel warm green + pop pink + butter yellow** stationery aesthetic.

![MM Journal](https://img.shields.io/badge/MM-Maintain%20Me-FF3860?style=for-the-badge)
![React](https://img.shields.io/badge/React-18-61DAFB?style=for-the-badge&logo=react)
![TypeScript](https://img.shields.io/badge/TypeScript-5-3178C6?style=for-the-badge&logo=typescript)
![TailwindCSS](https://img.shields.io/badge/Tailwind-3-38BDF8?style=for-the-badge&logo=tailwindcss)
![IndexedDB](https://img.shields.io/badge/Storage-IndexedDB-FFE866?style=for-the-badge)

---

## ✨ Features

- **Interactive 3D Coin Landing Experience**: Centered MM logo and 3D flipping coin ("Tap to Track").
- **Dominant Pastel Warm Green Aesthetic**: Smooth glassmorphism cards, Pop Pink text highlights, and Butter Yellow CTAs.
- **Privacy-First Local Storage**: Powered by IndexedDB (`expenses`, `recurring`, `goals`) and `localStorage` — 100% offline, zero backend or account required.
- **Data Safety & Backup / Restore**: Export timestamped `.json` backups (`MM-backup-YYYY-MM-DD.json`) and restore previously saved data with schema validation and overwrite safety prompts.
- **Custom Financial Month Logic**: Supports custom month start days (e.g., 15th to 14th) across dashboard balances, calendar heatmaps, activity timeline, and analytics.
- **Expense Journal**: Quick Add expense bottom sheet with coin-into-wallet micro-animations (`"Money logged"`).
- **Calendar Heatmap View**: Monthly financial calendar displaying spending intensity and daily expense dots (`26 ● ● ●`).
- **Insights & Analytics**: Recharts Donut Breakdown ("Where did your money go?"), daily spending trend chart, month-over-month comparison, and smart rule-based financial advice ("MM Suggests").
- **Recurring Payments & Savings Goals**: Manage monthly bills with due date indicators and track savings goals with contribution progress bars and celebration overlays ("You did it!").

---

## 🚀 Quick Start

### Prerequisites
- Node.js (v18 or higher)
- npm or yarn

### Installation

```bash
# Clone the repository
git clone https://github.com/Anisha123444/maintainme.git

# Navigate into the project directory
cd maintainme

# Install dependencies
npm install

# Start local development server
npm run dev
```

The application will be running at `http://localhost:3000/`.

---

## 🛠️ Tech Stack

- **Framework**: Vite + React 18 + TypeScript
- **Styling**: Tailwind CSS + Custom CSS Theme Engine
- **Animations**: Framer Motion & Canvas Confetti
- **Charts**: Recharts
- **Icons**: Lucide React
- **Local Persistence**: `idb` (IndexedDB) + `localStorage`

---

## 📄 License

MIT License © 2026 MM — Maintain Me
