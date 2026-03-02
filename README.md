# Kollabary Base Frontend Template

A premium, production-ready frontend template built with **Next.js 15+** and **Tailwind CSS 4**. This template is designed for high-performance, scalable web applications with a focus on developer experience and modern design aesthetics.

## 🚀 Quick Start

### 1. Installation
```bash
npm install
# or
yarn install
# or
pnpm install
```

### 2. Run the Development Server
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## 🛠 Tech Stack

- **Framework:** [Next.js 15 (App Router)](https://nextjs.org/)
- **Language:** [TypeScript](https://www.typescriptlang.org/)
- **Styling:** [Tailwind CSS 4](https://tailwindcss.com/) with [CSS Variables](https://developer.mozilla.org/en-US/docs/Web/CSS/Using_CSS_custom_properties)
- **UI Components:** [Radix UI](https://www.radix-ui.com/) & [Lucide React](https://lucide.dev/)
- **State Management:** [TanStack React Query v5](https://tanstack.com/query/latest)
- **API Client:** [Axios](https://axios-http.com/)
- **Forms:** [React Hook Form](https://react-hook-form.com/) & [Zod](https://zod.dev/)
- **Utilities:** `clsx`, `tailwind-merge`, `class-variance-authority`
- **Feedback:** [Sonner](https://react-hot-toast.com/) (Toast notifications)

## 📂 Project Structure

```text
├── public/          # Static assets
├── src/
│   ├── app/         # Next.js App Router (Pages, Layouts, API)
│   ├── components/  # Reusable UI components (Shared)
│   ├── hooks/       # Custom React hooks
│   ├── lib/         # Utility functions and shared logic
│   ├── services/    # API services and data fetching
│   ├── types/       # TypeScript definitions
│   └── styles/      # Global CSS and Tailwind configurations
```

## ✨ Key Features

- **Modern Design:** Built with a focus on responsiveness, dark mode support, and premium aesthetics.
- **Type Safety:** Full TypeScript integration for better developer experience and reliability.
- **Form Handling:** Robust form validation and submission using React Hook Form and Zod.
- **Data Fetching:** Efficient and cached data fetching with React Query.
- **Optimized Fonts:** Uses Geist and Geist Mono for professional typography.
- **Linting & Formatting:** Pre-configured ESLint and TypeScript rules.

## 🎨 Styling Guidelines

This project uses **Tailwind CSS 4** which leverages CSS variables for theme management. 
- Use the `cn` utility in `src/lib/utils.ts` for conditional class merging.
- Follow the [Shadcn UI](https://ui.shadcn.com/) patterns for consistent component design.

## 📚 Learn More

To learn more about the tools used in this template:
- [Next.js Documentation](https://nextjs.org/docs)
- [React Query Guide](https://tanstack.com/query/latest/docs/framework/react/overview)
- [Tailwind CSS Docs](https://tailwindcss.com/docs)

## 🚢 Deployment

The easiest way to deploy is using the [Vercel Platform](https://vercel.com/new).

---
Built with ❤️ for the Kollabary ecosystem.

