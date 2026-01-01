# Saswata Dey - Cinematic 3D Portfolio

A next-generation personal portfolio web application built with Next.js, Three.js, and Framer Motion. This project showcases QA engineering skills and computer vision expertise in a cinematic, interactive 3D environment.

## 🚀 Technlogy Stack

- **Frontend Framework**: Next.js 14 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS (with custom Glassmorphism design system)
- **3D Graphics**: Three.js / React Three Fiber
- **Animations**: Framer Motion & GSAP
- **Database**: Supabase
- **Deployment**: Vercel

## 🎨 Key Features

1.  **3D Hero Section**: Immersive particle system with mouse-based parallax.
2.  **Interactive Skills Galaxy**: Visual representation of QA and Tech skills.
3.  **Experience Timeline**: Animated vertical timeline of professional journey.
4.  **3D Project Cards**: Glassmorphic cards with tilt effects and problem-solution details.
5.  **QA Mindset Visualization**: Interactive detailed breakdown of testing philosophy and bug lifecycle.
6.  **Dark Glassmorphism UI**: Premium aesthetic with neon accents and blur effects.

## 🛠️ Getting Started

1.  **Install Dependencies**:
    ```bash
    npm install
    ```

2.  **Run Development Server**:
    ```bash
    npm run dev
    ```

3.  **Build for Production**:
    ```bash
    npm run build
    ```

## 📂 Project Structure

- `src/app`: App Router pages and layout
- `src/components/3d`: Three.js 3D components
- `src/components/sections`: Main page sections (Hero, About, Skills, etc.)
- `src/lib`: Utility functions (Supabase client)
- `public`: Static assets

## 🔧 Environment Setup

Create a `.env.local` file with your Supabase credentials:

```env
NEXT_PUBLIC_SUPABASE_URL=your_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key
```

## 📄 License

This project is licensed under the MIT License.
