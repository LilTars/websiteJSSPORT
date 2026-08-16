---
name: laravel-inertia-react-structure
description: Frontend structure conventions for Laravel Inertia React applications based on production-ready practices. Use when creating, scaffolding, or reviewing frontend code in a Laravel Inertia React project. Triggers on creating React components, pages, modules, organizing frontend directories, setting up Inertia pages, structuring a React frontend within Laravel, implementing forms, validating page props, and frontend state management.
---

# Laravel Inertia React Frontend Structure

Production-focused frontend structure conventions for Laravel + Inertia + React applications. The goal is predictable architecture, clear boundaries, and long-term maintainability.

## Core Principles

- Keep pages focused on composition and orchestration.
- Keep domain and reusable logic in modules, not scattered across pages.
- Prefer explicit types and explicit data contracts between Laravel and React.
- Build UI with simple, readable components that do one thing well.

## Directory Structure

Use four base directories under `resources/js`:

```text
resources/js/
├── common/       # Generic, reusable code portable across projects
├── modules/      # Project-specific code shared across multiple pages
├── pages/        # Inertia page components
└── shadcn/       # Auto-generated shadcn/ui components (if used)
```

Decision rule:
- If code is domain- or feature-specific, place it in `modules/`.
- If code is project-agnostic and generic, place it in `common/`.

## Naming Conventions

- Components and contexts: `PascalCase` (example: `UserCard.tsx`, `AuthContext.tsx`)
- Hooks, helpers, constants, stores: `camelCase` (example: `useAuth.ts`, `formatDate.ts`)
- Directories: `kebab-case` (example: `user-management/`, `date-picker/`)
- Inertia pages: suffix with `Page` (example: `IndexPage.tsx`, `ShowPage.tsx`)

## Module Organization

Small modules can be flat. Larger modules should be grouped by type:

```text
modules/orders/
├── components/
├── constants/
├── helpers/
├── hooks/
├── stores/
└── types.ts
```

Use the same organization style in `common/` when it grows.

## Pages Directory

Pages should mirror URL structure and keep page-only partials near each page.

```text
pages/
├── layouts/
├── admin/
│   ├── layouts/
│   ├── users/
│   │   ├── components/
│   │   ├── helpers/
│   │   ├── IndexPage.tsx
│   │   └── EditPage.tsx
│   └── DashboardPage.tsx
└── auth/
    ├── LoginPage.tsx
    └── RegisterPage.tsx
```

## React Component Conventions

- Use function declarations and named exports.
- Keep one component per file.
- Avoid barrel exports (`index.ts`) for component re-exports.
- Group imports into two blocks:
1. Third-party/library imports
2. Application imports using alias paths (for example `@/`)

## Forms and Validation

- Always use Inertia's `useForm` for submitting data to the Laravel backend.
- Avoid custom form state management with `useState` unless absolutely necessary.
- Display backend validation errors directly from the `errors` object returned by `useForm`.

## Type Safety for Inertia Props

- Define strict TypeScript interfaces for all page component props based on data passed from Laravel controllers.
- Place shared model types (for example `User`, `Order`) in `resources/js/types/index.ts` or in each module's `types.ts`.
- Do not use `any` or `unknown` for page props.

## State Management Rules

- Use local `useState` only for simple UI state (for example modal open/close).
- Use URL parameters through the Inertia router for filter, sort, and pagination state.
- Use Zustand in `stores/` only for complex cross-module client-side state.

## Error Handling

- Do not wrap standard Inertia form submissions in manual `try/catch` blocks.
- Use Inertia callbacks such as `onSuccess` and `onError` to drive submission flow.

## Styles

- Prefer Tailwind utility classes for styling.
- Keep shared tokens/utilities centralized and avoid ad-hoc duplication.

## PR Review Checklist (Frontend)

### Do

- Ensure new pages follow URL-to-pages directory mapping.
- Ensure forms use `useForm` and surface backend validation errors.
- Ensure Inertia page props are strictly typed.
- Ensure shared logic is extracted to `modules/` or `common/` appropriately.
- Ensure state location is correct (`useState` vs URL params vs Zustand).

### Don't

- Do not place reusable domain logic directly inside page files.
- Do not use `any` for Inertia props.
- Do not use custom form state when `useForm` already fits.
- Do not use Zustand for trivial local state.
- Do not send oversized, unshaped payloads from backend to frontend pages.
