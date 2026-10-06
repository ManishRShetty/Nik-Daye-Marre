# Campus Spatial AI

A next-generation, AI-powered centralized platform for campus management. Students can seamlessly request services, report issues, and track requests through an immersive 3D spatial interface powered by an Agentic bridge.

## 🚀 Features

- **Immersive 3D Campus Map:** Visualize real-time support tickets physically mapped onto a fully interactive 3D model of your campus using React Three Fiber.
- **Agentic AI Interface:** Powered by Gemini, the system translates natural language (e.g., "There's a broken chair in the library") into actionable Support Tickets, instantly locating them on the 3D map.
- **Auto-categorization & Triage:** The AI automatically detects the priority, department, and location of any issue without manual form filling.
- **Real-time Supabase Database:** Tickets instantly sync across the database, appearing dynamically on the right-hand dashboard and 3D map.
- **Role-based Access Control:** Toggle between Student Views (personal history) and Admin/Faculty Views (system-wide management).
- **Admin Management Dashboard:** Admins can filter by priority, search tickets, and instantly change a ticket's status. Marking a ticket as "Completed" immediately clears it from the 3D map view!
- **Sleek Apple-style Dark Mode:** Built with Framer Motion, Tailwind CSS, and `backdrop-blur` for a premium, buttery-smooth UX.

## 🛠️ Tech Stack

- **Frontend:** Next.js 14, React, Tailwind CSS, Framer Motion
- **3D Rendering:** Three.js, React Three Fiber, React Three Drei
- **Backend/Database:** Supabase (PostgreSQL)
- **AI Integration:** Google Gen AI SDK (Gemini 3.1 Pro / 2.5 Flash with fallback heuristics)

## 🏃‍♂️ How to Run

1. Clone the repository.
2. Install dependencies:
   ```bash
   npm install
   ```
3. Set up your `.env` file with your API keys:
   ```env
   NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_key
   GEMINI_API_KEY=your_gemini_key
   ```
4. Run the development server:
   ```bash
   npm run dev
   ```
5. Open `http://localhost:3000` in your browser.

## 💡 Use Case & Impact

Traditionally, reporting campus issues (like a water leak or broken lab equipment) requires navigating clunky portals, selecting categories manually, and hoping it reaches the right department. 

**Campus Spatial AI** revolutionizes this. A student simply types what's wrong. The AI figures out the rest, places a physical marker in a 3D twin of the campus, and alerts the exact right department. Facility managers can visually see clusters of issues (e.g., multiple Wi-Fi complaints in the Library) and manage them directly from the immersive dashboard.
