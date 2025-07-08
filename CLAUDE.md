# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is a Next.js 15.3.5 application called "domain-dream" built with TypeScript and modern React patterns. The project uses Bun as the package manager and includes a comprehensive UI component library based on shadcn/ui.

## Development Commands

```bash
# Install dependencies
bun install

# Run development server with Turbopack
bun run dev

# Build for production
bun run build

# Start production server
bun run start

# Run linting
bun run lint

# Format code with Prettier
bun run format

# Check code formatting
bun run format:check
```

## Architecture & Key Technologies

### Core Stack

- **Framework**: Next.js 15.3.5 with App Router
- **Language**: TypeScript (strict mode enabled)
- **Package Manager**: Bun
- **Styling**: Tailwind CSS v4 with PostCSS
- **Component Library**: shadcn/ui (New York style)
- **Code Formatting**: Prettier with Tailwind CSS plugin
- **Linting**: ESLint with Next.js rules + Prettier integration

### State Management & Data Fetching

- **Server State**: TanStack Query (React Query) configured in `src/lib/providers/query-providers.tsx`
    - Default stale time: 60 seconds
    - Refetch on focus/reconnect disabled
    - Single retry on failed requests
- **Client State**: Zustand (available but not yet implemented)

### UI Components

The project includes 45+ pre-built shadcn/ui components in `src/components/ui/`:

- All components use Radix UI primitives for accessibility
- Components follow the shadcn/ui pattern with customizable variants
- Styling uses `cn()` utility function from `src/lib/utils.ts`

### Form Handling

- **React Hook Form** with Zod validation
- Form component at `src/components/ui/form.tsx` provides integration

### Key Configuration Files

- `components.json`: shadcn/ui configuration
- `tsconfig.json`: TypeScript with path alias `@/*` → `./src/*`
- `eslint.config.mjs`: ESLint with Next.js rules
- `postcss.config.mjs`: PostCSS with Tailwind plugin

## Project Structure

```
src/
├── app/              # Next.js App Router pages
│   ├── layout.tsx    # Root layout with providers
│   ├── page.tsx      # Home page
│   └── globals.css   # Global styles and Tailwind imports
├── components/       # React components
│   └── ui/          # shadcn/ui components
├── hooks/           # Custom React hooks
│   └── use-mobile.ts # Mobile detection hook
└── lib/             # Utilities and providers
    ├── providers/   # React context providers
    └── utils.ts     # Utility functions (cn)
```

## Development Guidelines

### Adding New Features

1. Use existing UI components from `src/components/ui/` when possible
2. Follow the established pattern for client components (use 'use client' directive)
3. Leverage TanStack Query for server state management
4. Use the `cn()` utility for conditional styling

### Component Development

- All new components should follow shadcn/ui patterns
- Use TypeScript interfaces for props
- Implement proper accessibility with Radix UI primitives
- Keep components in `src/components/` directory

### Styling

- Use Tailwind CSS classes
- Leverage CSS variables defined in `globals.css`
- Use `cn()` utility for merging classes
- Follow the New York style theme from shadcn/ui

### State Management

- Use TanStack Query for server-side data
- Consider Zustand for complex client state (already installed)
- Keep component state local when possible

## Code Quality Tools

### Prettier Configuration

- **Tab Width**: 4 spaces (but using tabs)
- **Use Tabs**: true
- **Single Quotes**: true for JS/TS and JSX
- **Trailing Comma**: ES5
- **Tailwind CSS Plugin**: Automatically sorts Tailwind classes

### Pre-commit Hooks

- **Husky**: Manages git hooks
- **lint-staged**: Runs tasks on staged files before commit
    - Prettier formatting for all supported files
    - ESLint fixing for JS/TS files

## Important Notes

- No testing framework is currently configured
- No CI/CD workflows exist yet
- Tailwind CSS v4 doesn't require a config file
- The project uses Google Fonts (Geist and Geist Mono)
- NextTopLoader provides page transition feedback
- Pre-commit hooks automatically format and lint code
