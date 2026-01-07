# 🏠 Room Finder - Premium Real Estate Platform

[![Vercel Deployment](https://img.shields.io/badge/Deployed%20on-Vercel-black?style=flat-square&logo=vercel)](https://vercel.com)
[![React](https://img.shields.io/badge/React-19-blue?style=flat-square&logo=react)](https://reactjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.x-blue?style=flat-square&logo=typescript)](https://www.typescriptlang.org/)
[![Tailwind](https://img.shields.io/badge/Tailwind-v4-38b2ac?style=flat-square&logo=tailwind-css)](https://tailwindcss.com/)

**Room Finder** is a premium, high-performance web application designed to connect room owners with potential tenants. Featuring a professional **Glassmorphism 2.0** design and built on a modern serverless architecture, it delivers a secure, fast, and visually stunning real estate discovery experience.

---

## ✨ Key Features

### 🔐 Advanced Privacy & Security
- **Owner Privacy**: Contact details (phone numbers) are strictly protected and only accessible to authenticated users, preventing unauthorized data harvesting.
- **Hardened Auth**: Secure user authentication and session management powered by **Supabase Auth**.

### 🍱 Professional UI/UX
- **Glassmorphism Design System**: A cutting-edge aesthetic utilizing depth, frosted surfaces, and refined HSL-based color palettes.
- **Micro-Animations**: Smooth transitions, hover effects, and animated loading states for a premium "app-like" feel.
- **Mobile First**: Pixel-perfect responsiveness ensuring a high-end experience across all devices.

### 🛠️ Core Functionality
- **Dynamic Property Search**: Real-time filtering by location, budget, and property structure (BHK/RK).
- **Owner Dashboard**: Personalized management console for users to create, view, and delete property listings.
- **High-Performance Media**: Cloud-integrated property gallery with high-speed image uploads and optimized CDN delivery.

---

## 🚀 Tech Stack

| Layer | Technologies |
| :--- | :--- |
| **Frontend Core** | React 19, Vite, TypeScript |
| **Styling** | Tailwind CSS v4 (Modern HSL System) |
| **Backend (BaaS)** | Supabase (PostgreSQL, Auth, Storage) |
| **Icons & Typography** | Lucide React, Outfit (Google Fonts) |
| **UI Components** | Radix UI, Shadcn UI Architecture |
| **Deployment** | Vercel (Production Hosting) |

---

## 🛠️ Getting Started

### 1. Clone & Install
```bash
git clone https://github.com/MDAQUILKHAN963/room-finder-repo.git
cd room-finder-repo
npm install
```

### 2. Environment Variables
Create a `.env` file in the root directory:
```env
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
```

### 3. Launch Development
```bash
npm run dev
```

---

## 🌐 Deployment

The project is pre-configured for **Vercel**:
1. Connect your GitHub repository to a new Vercel project.
2. Add your `.env` variables in the Vercel Dashboard settings.
3. Every push to the `main` branch will automatically build and deploy the latest version.

---

## 📄 License
This project is licensed under the MIT License.

Developed for excellence by **MDAQUILKHAN963**
