# 🧠 MoodBite  
**Mood-based food recommendation web app powered by AI**

MoodBite is a frontend web application that personalizes meal recommendations based on a user’s emotional state. Instead of searching by ingredients, users select how they feel, and the app suggests relevant recipes or generates new ones using AI.

---

## Deployed Link

https://moodbite-nine.vercel.app/

---

## ✨ Features

- **Mood-Based Recommendations**  
  Maps user-selected emotions to curated recipe suggestions.

- **Dynamic Recipe Fetching**  
  Integrates with the TheMealDB API to display real-world recipes with images and instructions.

- **AI-Powered Recipe Generation**  
  Uses Google Gemini API to generate custom, mood-specific dishes.

- **Client-Side API Handling**  
  API keys are stored securely in `localStorage`, with no backend involved.

- **Responsive UI**  
  Fully responsive design for mobile, tablet, and desktop.

---

## 🛠 Tech Stack

- **Frontend:** React (Vite)  
- **Language:** TypeScript  
- **Styling:** Tailwind CSS  
- **UI Components:** Radix UI (shadcn/ui)  
- **Data Fetching:** Fetch API / React Query  
- **AI Integration:** Google Gemini API  

---

## 🚀 Getting Started

```bash
git clone https://github.com/jess-icaa/moodbite.git
cd moodbite
npm install
npm run dev
