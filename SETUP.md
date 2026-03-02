# CSMS Frontend - Setup Guide

## Overview

This is a modern Charging Station Management System (CSMS) frontend built with Next.js 16, following enterprise-grade best practices and the AI Development Guidelines.

## Tech Stack

- **Framework:** Next.js 16 (App Router)
- **Language:** TypeScript (strict mode)
- **Styling:** Tailwind CSS v4
- **UI Library:** shadcn/ui
- **Data Fetching:** React Query (@tanstack/react-query)
- **Table:** TanStack Table
- **Forms:** React Hook Form + Zod
- **Validation:** Zod
- **Toast System:** Sonner
- **Date Handling:** date-fns
- **Motion Library:** Framer Motion
- **Theme:** next-themes (dark/light mode)

## Environment Variables

Create a `.env.local` file in the root directory with the following variables:

```env
# API Configuration
NEXT_PUBLIC_API_BASE_URL=http://localhost:3000/api
NEXT_PUBLIC_API_TIMEOUT=30000

# Authentication
NEXT_PUBLIC_AUTH_TOKEN_KEY=csms_auth_token
NEXT_PUBLIC_AUTH_USER_KEY=csms_user
NEXT_PUBLIC_AUTH_TENANT_KEY=csms_tenant

# WebSocket (optional)
NEXT_PUBLIC_WS_URL=ws://localhost:3000
```

## Installation

1. **Install dependencies:**
   ```bash
   npm install
   ```

2. **Run development server:**
   ```bash
   npm run dev
   ```

3. **Build for production:**
   ```bash
   npm run build
   npm start
   ```

## Project Structure

```
src/
├── app/                      # Next.js App Router pages
│   ├── dashboard/           # Dashboard and main app pages
│   ├── login/               # Authentication pages
│   ├── register/
│   ├── stations/            # Stations management
│   ├── locations/           # Locations management
│   ├── users/               # User management
│   ├── profile/             # User profile
│   ├── webhooks/            # Webhook management
│   └── tenants/             # Tenant management (Super Admin)
├── components/
│   ├── providers/           # React Query, Theme, Auth providers
│   ├── shared/              # Shared components (Sidebar, Header, etc.)
│   └── ui/                  # shadcn/ui components
├── contexts/                # React contexts (Auth)
├── hooks/
│   ├── get/                 # React Query GET hooks
│   ├── post/                # React Query POST hooks
│   ├── put/                 # React Query PUT hooks
│   └── delete/              # React Query DELETE hooks
├── lib/
│   ├── validations/         # Zod schemas
│   ├── date.ts              # Date utilities (date-fns)
│   ├── permissions.ts       # RBAC utilities
│   ├── motion.ts            # Framer Motion variants
│   ├── error-handler.ts     # Error handling utilities
│   ├── http-service.ts      # Axios HTTP client
│   └── utils.ts             # General utilities
├── services/                # API service layer
│   ├── auth.service.ts
│   ├── user.service.ts
│   ├── station.service.ts
│   ├── location.service.ts
│   ├── session.service.ts
│   ├── dashboard.service.ts
│   ├── tenant.service.ts
│   └── webhook.service.ts
├── types/                   # TypeScript type definitions
└── constants/               # Application constants
```

## Features

### Authentication & Authorization
- ✅ Login / Register
- ✅ Email verification
- ✅ User invitation system
- ✅ Role-based access control (RBAC)
- ✅ Protected routes
- ✅ JWT token management with auto-refresh

### Dashboard
- ✅ Real-time statistics
- ✅ Recent activity feed
- ✅ Station status overview
- ✅ Energy delivery metrics

### Charging Stations
- ✅ Station list with TanStack Table
- ✅ Advanced filtering and search
- ✅ Pagination and sorting
- ✅ Create, edit, delete stations
- ✅ Station details view
- ✅ OCPP configuration management
- ✅ Remote start/stop transactions
- ✅ OCPP logs viewer

### Locations
- ✅ Location management
- ✅ Grid view with cards
- ✅ Create, edit, delete locations
- ✅ Station count per location

### Users
- ✅ User list with search
- ✅ User invitation
- ✅ Role management
- ✅ User profile editing
- ✅ Password change

### Webhooks
- ✅ Webhook configuration
- ✅ Event subscription
- ✅ Delivery logs
- ✅ Retry failed deliveries

### Tenants (Super Admin Only)
- ✅ Multi-tenant support
- ✅ Tenant creation
- ✅ API secret management
- ✅ Tenant activation/deactivation

### UI/UX Features
- ✅ Dark/Light theme with system preference
- ✅ Responsive design (mobile-first)
- ✅ Framer Motion page transitions
- ✅ Loading states (skeletons)
- ✅ Error states with retry
- ✅ Empty states
- ✅ Toast notifications (Sonner)
- ✅ Accessible forms with validation
- ✅ Keyboard navigation

## Architecture Patterns

### Smart/Dumb Component Pattern
- **Smart Components:** Handle data fetching, mutations, and business logic (in `/features` or route-level)
- **Dumb Components:** Pure UI components with typed props (in `/components/ui` and `/components/shared`)

### React Query Best Practices
- All API calls use `useQuery` or `useMutation`
- Stable query keys for caching
- Automatic cache invalidation
- Optimistic updates where appropriate
- Proper loading, error, and empty states

### Form Handling
- React Hook Form for all forms
- Zod schemas for validation
- Type-safe form data
- Accessible error messages

### State Management
- React Query for server state
- React Context for auth state
- Local state with useState/useReducer
- No global state library needed

## API Integration

The application integrates with a NestJS backend providing the following endpoints:

- **Auth:** `/auth/login`, `/auth/register`, `/auth/verify`, `/auth/invite`, `/auth/accept-invitation`
- **Users:** `/users`, `/users/profile`, `/users/change-password`
- **Stations:** `/stations`, `/stations/:id`, `/stations/:id/remote-start`, `/stations/:id/remote-stop`
- **Locations:** `/locations`, `/locations/:id`
- **Sessions:** `/sessions`, `/sessions/station/:id`
- **Dashboard:** `/dashboard`, `/dashboard/stats`, `/dashboard/activity`
- **Tenants:** `/tenants`, `/tenants/:id/activate`, `/tenants/:id/deactivate`
- **Webhooks:** `/webhooks`, `/webhooks/:id`, `/webhooks/deliveries`

## Development Guidelines

### Code Style
- Follow the AI Development Guidelines strictly
- Use TypeScript strict mode
- No `any` types
- Proper error handling
- Accessible components (WCAG AA)

### Performance
- Code splitting with dynamic imports
- Image optimization with Next/Image
- Lazy loading for heavy components
- Debounced search inputs
- Optimized re-renders

### Testing (Recommended)
- Unit tests with Vitest
- Integration tests with React Testing Library
- E2E tests with Playwright
- Visual regression tests

## Deployment

### Vercel (Recommended)
```bash
npm run build
vercel deploy
```

### Docker
```dockerfile
FROM node:20-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build
EXPOSE 3000
CMD ["npm", "start"]
```

## Troubleshooting

### Common Issues

1. **API Connection Failed**
   - Check `NEXT_PUBLIC_API_BASE_URL` in `.env.local`
   - Ensure backend is running
   - Verify CORS settings

2. **Authentication Issues**
   - Clear localStorage
   - Check token expiration
   - Verify backend JWT configuration

3. **Build Errors**
   - Delete `.next` folder and rebuild
   - Clear node_modules and reinstall
   - Check TypeScript errors

## License

MIT

## Support

For issues and questions, please refer to the project documentation or contact the development team.
