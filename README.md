# Charlie Charging - EV Management Platform

Charlie Charging is a premium, production-ready EV Charging Management Platform built with **Next.js 16** and **Tailwind CSS 4**. It provides a comprehensive solution for managing charging locations, stations, tenants, and user access with a focus on real-time monitoring and professional aesthetics.

## 🚀 Quick Start

### 1. Installation
```bash
npm install
```

### 2. Configure Environment
Copy `.env.example` to `.env` and configure your API endpoints:
```bash
NEXT_PUBLIC_API_URL=your_api_url
```

### 3. Run the Development Server
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) to access the dashboard.

## 🛠 Tech Stack

- **Framework:** [Next.js 16 (App Router)](https://nextjs.org/)
- **Styling:** [Tailwind CSS 4](https://tailwindcss.com/) with [Framer Motion](https://www.framer.com/motion/)
- **State Management:** [TanStack React Query v5](https://tanstack.com/query/latest)
- **Tables:** [TanStack Table v8](https://tanstack.com/table/latest)
- **Forms:** [React Hook Form](https://react-hook-form.com/) & [Zod](https://zod.dev/)
- **Real-time:** [Socket.io Client](https://socket.io/)
- **Charts:** [Recharts](https://recharts.org/)
- **UI Components:** Radix UI & Lucide React

## 📂 Project Structure

```text
├── src/
│   ├── app/             # App Router: Auth, Dashboard, Management
│   ├── components/      # Shared UI & Layout components
│   ├── features/        # Business logic modules (Auth, Stations, etc.)
│   ├── services/        # API communication layer (Axios)
│   ├── lib/             # Utilities (Auth guards, session, formatting)
│   ├── hooks/           # Custom React hooks
│   ├── types/           # Global TypeScript definitions
│   └── constants/       # App-wide configuration & navigation
```

## ✨ Core Modules

- **Authentication:** Secure login, registration, and email verification flow.
- **Dashboard:** Interactive analytics and real-time status overview.
- **Location Management:** Manage charging sites and geographical data.
- **Station Management:** Monitor and configure individual charging stations.
- **Tenant Management:** Multi-tenant support for organizational isolation.
- **User Management:** RBAC system for managing platform administrators and users.
- **Webhooks:** Integration layer for external system notifications.

## 🎨 Design System

The platform uses a dark-themed, glassmorphic design system:
- **Glassmorphism:** Elegant use of `backdrop-blur` and translucent layers.
- **Micro-animations:** Smooth transitions powered by Framer Motion.
- **Responsive:** Fully optimized for mobile, tablet, and desktop views.

## 🚢 Deployment

Optimized for deployment on [Vercel](https://vercel.com).

---
Built with ❤️ for the Charlie Charging ecosystem.

