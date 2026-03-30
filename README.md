# 🧠 MoodBite

**Food recommendations, guided by how you feel.**

MoodBite is an intelligent cooking and meal discovery application that flips the traditional recipe search on its head. Instead of asking what ingredients you have, it asks: *How are you feeling?* 

Whether you need a comforting soup, an energizing pasta, or a stress-relief dessert, MoodBite curates the perfect dish for your exact emotional state using real-world databases and Gemini AI.

![React](https://img.shields.io/badge/React-18.x-blue?style=flat-square&logo=react)
![Vite](https://img.shields.io/badge/Vite-5.x-646CFF?style=flat-square&logo=vite)
![TypeScript](https://img.shields.io/badge/TypeScript-5.x-3178C6?style=flat-square&logo=typescript)
![Tailwind](https://img.shields.io/badge/Tailwind_CSS-3.x-38B2AC?style=flat-square&logo=tailwind-css)

---

## ✨ Key Features

- **🎭 Mood-Based Curation:** Select your current emotion, and the app cross-references the mood with dietary tags to suggest the perfect meal.
- **🌐 Real-World Recipes (TheMealDB):** Dynamically fetches high-quality, authentic recipes with images and instructions from the crowd-sourced MealDB API.
- **🤖 The AI Chef (Gemini 1.5):** Go beyond standard recipes! Connect your Google Gemini API key securely in the browser to tap into an AI Chef that invents brand-new, mood-specific dishes on the fly.
- **🔒 Secure Client-Side API:** Your API keys are stored entirely locally in your browser leveraging `localStorage`. There is no backend, ensuring your keys stay private.
- **🎨 Beautiful UI:** Built using Radix UI primitives, `framer-motion` animations, and Tailwind CSS for a seamless, glassmorphism-inspired aesthetic.
- **📱 Fully Responsive:** Works perfectly on mobile, tablet, and desktop environments.

## 🚀 Getting Started

To run this project locally, follow these steps:

### Prerequisites
Make sure you have Node.js (version 18+) installed.

### Installation

1. **Clone the repository:**
   ```bash
   git clone https://github.com/jess-icaa/moodbite.git
   cd moodbite
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Start the development server:**
   ```bash
   npm run dev
   ```

4. **Add your API Keys (Optional but Recommended):**
   - Head over to the **Settings** tab in the app.
   - Enter your [Google Gemini API Key](https://aistudio.google.com/app/apikey) to enable the "AI Chef" and dynamic text-generation features.

## 🛠 Tech Stack

- **Frontend Framework:** React + Vite
- **Language:** TypeScript
- **Styling:** Tailwind CSS + Radix UI (shadcn/ui)
- **State & Data Pulls:** React Query + Fetch API
- **AI Integrations:** `@google/generative-ai` SDK
- **Icons:** Lucide React

## 📦 Deployment

MoodBite is fully optimized as a Serverless Static Web Application. It uses GitHub Actions (`.github/workflows/deploy.yml`) to automatically build and deploy new pushes on the `main` branch directly to **GitHub Pages**.

To deploy manually, you can run:
```bash
npm run build -- --base=/moodbite/
```
And deploy the resulting `dist/` folder to any static host (Netlify, Vercel, etc.).

## 🤝 Contributing

Feel free to fork the repository and submit pull requests. If you discover a bug or have a feature request, please open an issue!

---
*Built with ❤️ for better emotional well-being.*
