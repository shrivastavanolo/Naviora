# Naviora — Agent Guide

## Commands

- `npm run dev` — dev server (Next.js 16 Turbopack)
- `npm run build` — production build (compiles OK; type-check fails on auto-generated `types/validator.ts` — ignore)
- `npm test` — run all Vitest tests
- `npm test -- <file>` — run single test file
- `npm run lint` — ESLint (Next.js core-web-vitals + typescript configs)

## Package Manager

Uses **pnpm** (`pnpm-workspace.yaml` exists). `npm` is also compatible but prefer pnpm for consistency.

## Auth — Custom JWT (no Clerk/NextAuth)

- Cookie name: `naviora_session` (httpOnly, Secure, SameSite=Lax)
- JWT via `jose` library, 7-day expiry, bcryptjs password hashing
- Client-side auth: `useMe()` hook (React Query, key `["me"]`, retry: false)
- Server-side guard: `requireAuth()` — reads cookie, verifies JWT, returns user or throws `UnauthorizedError`
- No middleware file; auth gating done client-side in route group layouts or server-side per API route
- Auth API routes: `POST /api/auth/signup|login|logout`, `GET /api/auth/me`
- Login/signup invalidate `["me"]` query key and redirect to `/dashboard`

## Architecture

- **Path alias**: `@/*` maps to project root (not `src/`), e.g. `@/components/ui/button`, `@/src/lib/auth`
- **Pattern**: API routes → Services (business logic) → Repositories (Prisma queries)
- **API client**: `lib/api.ts` unwraps `json.data` — mutations receive the typed data directly, not `{success, data}`
- **Maps**: `react-map-gl` + Mapbox GL JS (token from `NEXT_PUBLIC_MAPBOX_TOKEN`)
- **Forms**: react-hook-form + `@hookform/resolvers/zod`
- **State**: TanStack React Query with `QueryProvider` in root layout, `queryClient` singleton in `lib/query-client.ts` (staleTime: 60s, retry: 1)

## Database

- **Prisma** + PostgreSQL (Neon), single migration: `20260709141148_init`
- Models: `User`, `Trip`, `TripMember` (with `OWNER`/`MEMBER` role), `Place` (ordered by `visitOrder`)
- Generate client: `npx prisma generate`, run migration: `npx prisma migrate dev`
- CUIDs for all primary keys

## Testing (Vitest)

- `globals: true` in config — no need to import `describe`/`it`/`expect`
- Standard pattern: `vi.mock()` at module level, `vi.spyOn().mockResolvedValue()` per test
- Factory functions: `makeUser()`, `makeTrip()`, `makePlace()` with spread defaults
- Cleanup: `afterEach(() => vi.clearAllMocks())`
- Tests at `tests/services/*.test.ts`

## Styling (Tailwind v4)

- **Dark-only theme**: `<html className="dark">` hardcoded in root layout. Do not add light mode.
- CSS via `@tailwindcss/postcss` (v4-style config). No `tailwind.config.js`.
- Theme vars in `globals.css`: primary `#6D5EF5` (purple), accent `#34D399` (emerald), background `#0F1221`
- shadcn/ui style: `base-nova`

## Key Conventions

- All pages, layouts, API routes: `"use client"` where hooks needed
- API routes: always wrap body in `try/catch` with `getErrorResponse(error)`
- Error classes: `AppError(statusCode)`, `UnauthorizedError`, `NotFoundError`, `ForbiddenError`, `BadRequestError`, `ConflictError`
- Prisma singleton in `src/lib/prisma.ts` (cached in `globalThis` for dev)
- Image assets in `/public/`, logo at `/logo.svg`
