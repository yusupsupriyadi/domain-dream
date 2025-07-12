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
- **API Framework**: ElysiaJS for type-safe API routes

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
│   ├── api/         # API routes
│   │   └── [[...slugs]]/
│   │       ├── route.ts  # Main ElysiaJS API handler
│   │       └── modules/  # Modular API structure
│   │           ├── health/
│   │           │   ├── index.ts    # Controller
│   │           │   ├── service.ts  # Business logic
│   │           │   └── model.ts    # Types & validation
│   │           └── domains/
│   │               ├── index.ts    # Controller
│   │               ├── service.ts  # Business logic
│   │               └── model.ts    # Types & validation
│   ├── layout.tsx    # Root layout with providers
│   ├── page.tsx      # Home page
│   └── globals.css   # Global styles and Tailwind imports
├── components/       # React components
│   └── ui/          # shadcn/ui components
├── hooks/           # Custom React hooks
│   ├── use-api.ts   # API hooks (useCheckDomain)
│   └── use-mobile.ts # Mobile detection hook
└── lib/             # Utilities and providers
    ├── axios.ts     # Axios instance configuration
    ├── domain-checker.ts # RDAP domain checking
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

### Prettier Configuration (.prettierrc)

```json
{
	"semi": true,
	"trailingComma": "es5",
	"singleQuote": true,
	"printWidth": 80,
	"tabWidth": 4,
	"useTabs": true,
	"bracketSpacing": true,
	"arrowParens": "always",
	"endOfLine": "lf",
	"bracketSameLine": false,
	"jsxSingleQuote": true,
	"plugins": ["prettier-plugin-tailwindcss"]
}
```

**IMPORTANT**: All code must follow this Prettier configuration. Key points:

- **Semicolons**: Always use semicolons
- **Quotes**: Single quotes for strings and JSX
- **Indentation**: Tabs with width 4
- **Line width**: Maximum 80 characters
- **Tailwind CSS Plugin**: Automatically sorts Tailwind classes

### Pre-commit Hooks

- **Husky**: Manages git hooks
- **lint-staged**: Runs tasks on staged files before commit
    - Prettier formatting for all supported files
    - ESLint fixing for JS/TS files

## Testing

### Test Framework

- **Test Runner**: Bun's built-in test runner (Jest-like API)
- **Test Location**: `test/` directory
- **Test Commands**:
    - `bun test` - Run all tests
    - `bun test:watch` - Run tests in watch mode

### Test Structure

```
test/
├── api/
│   ├── api.test.ts         # Integration tests
│   └── modules/
│       ├── health/
│       │   └── health.test.ts
│       └── domains/
│           └── domains.test.ts
```

### Writing Tests

```typescript
import { describe, expect, it } from 'bun:test';
import { Elysia } from 'elysia';

describe('Module Name', () => {
	it('should test something', async () => {
		const app = new Elysia().get('/', () => 'hi');
		const response = await app.handle(new Request('http://localhost/'));
		expect(response.status).toBe(200);
	});
});
```

## Important Notes

- Tailwind CSS v4 doesn't require a config file
- The project uses Google Fonts (Geist and Geist Mono)
- NextTopLoader provides page transition feedback
- Pre-commit hooks automatically format and lint code
- No CI/CD workflows exist yet

## API Development with ElysiaJS

### API Structure

- All API routes are handled by ElysiaJS in `src/app/api/[[...slugs]]/route.ts`
- The catch-all route pattern allows ElysiaJS to handle all `/api/*` requests
- Type-safe API with automatic validation using Elysia's schema

### Available Endpoints

- `GET /api/` - API welcome message
- `GET /api/health` - Health check endpoint
- `POST /api/domains/check` - Check domain availability (defaults to TLDs: ["com", "id", "org"] if not specified)

### API Structure (ElysiaJS Best Practices)

The API follows a modular structure based on ElysiaJS best practices:

#### Module Organization

Each feature module contains:

- **index.ts** (Controller): Handles routing and HTTP concerns
- **service.ts** (Service): Contains business logic
- **model.ts** (Model): Defines types, validation schemas, and response models

#### Adding New API Modules

1. Create a new module folder in `src/app/api/[[...slugs]]/modules/`
2. Implement the three-file structure (index, service, model)
3. Import and mount the module in main `route.ts`
4. Follow separation of concerns:
    - Controllers only handle routing
    - Services contain business logic
    - Models define data structures

#### Type Safety

- Use Elysia's `t` object for validation schemas
- Export TypeScript types using `typeof Schema.static`
- Define explicit response models for all endpoints

### API Hooks

- **useCheckDomain**: React Query mutation hook for domain checking
    - Accepts: `{ name: string, tlds?: string[] }`
    - Returns: Domain availability results

## Domain Checking Implementation

### RDAP Integration

The project uses RDAP (Registration Data Access Protocol) for checking domain availability:

- Implementation in `src/lib/domain-checker.ts`
- Checks multiple TLDs concurrently
- Returns registration status, registrar info, and dates
- Default TLDs when not specified: ["com", "id", "org"]

### Domain Check Request Format

```typescript
{
  name: string,      // Domain keyword (e.g., "mysite") or full domain (e.g., "mysite.com")
  tlds?: string[]    // Optional TLDs (defaults to ["com", "id", "org"] or extracted from name)
}
```

When a full domain is provided in the `name` field:

- The domain name and TLD are automatically separated
- Example: "myawesomesite.com" → name: "myawesomesite", tld: "com"
- If `tlds` array is empty, the extracted TLD is used
- Supports subdomains: "api.example.com" → name: "api.example", tld: "com"

## Important Reminders

- ALWAYS follow the Prettier configuration defined in .prettierrc for all code
- Use tabs with width 4, single quotes, semicolons
- Follow ElysiaJS modular structure for API development
- Maintain separation of concerns (controller, service, model)
