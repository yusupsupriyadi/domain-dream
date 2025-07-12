# Domain Dream

A modern domain availability checker built with Next.js 15, TypeScript, and ElysiaJS.

## Features

- 🔍 **Domain Availability Checking**: Check domain availability across multiple TLDs using RDAP protocol
- ⚡ **Fast & Type-Safe API**: Built with ElysiaJS for maximum performance and type safety
- 🎨 **Modern UI**: Beautiful interface with shadcn/ui components
- 🧪 **Fully Tested**: Comprehensive test coverage with Bun test runner
- 📱 **Responsive Design**: Works seamlessly on all devices

## Tech Stack

- **Framework**: Next.js 15.3.5 with App Router
- **Language**: TypeScript (strict mode)
- **Package Manager**: Bun
- **API**: ElysiaJS with modular architecture
- **UI Components**: shadcn/ui (45+ components)
- **Styling**: Tailwind CSS v4
- **State Management**: TanStack Query + Zustand
- **Testing**: Bun test runner
- **Code Quality**: ESLint + Prettier with pre-commit hooks

## Getting Started

### Prerequisites

- [Bun](https://bun.sh) installed on your machine
- Node.js 18+ (for compatibility)

### Installation

```bash
# Clone the repository
git clone https://github.com/yourusername/domain-dream.git
cd domain-dream

# Install dependencies
bun install

# Run development server
bun run dev
```

The application will be available at [http://localhost:3000](http://localhost:3000).

## Available Scripts

```bash
bun run dev          # Start development server with Turbopack
bun run build        # Build for production
bun run start        # Start production server
bun run lint         # Run ESLint
bun run format       # Format code with Prettier
bun run format:check # Check code formatting
bun test            # Run tests
bun test:watch      # Run tests in watch mode
```

## API Documentation

The API is available at `/api` with Swagger documentation at `/api/swagger`.

### Endpoints

- `GET /api/` - API information
- `GET /api/health` - Health check
- `POST /api/domains/check` - Check domain availability

### Domain Checking

Check domain availability by sending a POST request to `/api/domains/check`:

```json
{
	"name": "example",
	"tlds": ["com", "net", "org"] // Optional, defaults to ["com", "id", "org"]
}
```

You can also provide a full domain name:

```json
{
	"name": "example.com",
	"tlds": [] // Will check only .com (extracted from name)
}
```

The API automatically handles:

- Domain extraction: "example.com" → checks example.com
- Subdomain support: "api.example.com" → checks api.example.com
- Default TLDs: Empty `tlds` array uses extracted TLD or defaults to ["com", "id", "org"]

## Project Structure

```
src/
├── app/                    # Next.js App Router
│   ├── api/               # API routes
│   │   └── [[...slugs]]/  # ElysiaJS catch-all route
│   │       ├── modules/   # Modular API structure
│   │       │   ├── health/
│   │       │   └── domains/
│   │       └── route.ts   # Main API handler
│   ├── layout.tsx         # Root layout
│   └── page.tsx           # Home page
├── components/            # React components
│   └── ui/               # shadcn/ui components
├── hooks/                # Custom React hooks
├── lib/                  # Utilities and services
│   ├── axios.ts          # HTTP client
│   ├── domain-checker.ts # RDAP implementation
│   └── providers/        # React providers
└── test/                 # Test files
```

## Testing

Tests are written using Bun's built-in test runner:

```bash
# Run all tests
bun test

# Run tests in watch mode
bun test:watch
```

## Code Style

This project uses Prettier for code formatting with the following configuration:

- Tabs with width 4
- Single quotes
- Semicolons required
- Trailing comma ES5
- Max line width 80

Pre-commit hooks automatically format and lint code before commits.

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes using conventional commits:
    - `feat:` new feature
    - `fix:` bug fix
    - `docs:` documentation changes
    - `style:` code formatting
    - `refactor:` code refactoring
    - `test:` adding/updating tests
    - `chore:` routine tasks
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License.

## Acknowledgments

- [ElysiaJS](https://elysiajs.com) for the amazing API framework
- [shadcn/ui](https://ui.shadcn.com) for the beautiful components
- [Vercel](https://vercel.com) for Next.js and hosting solutions
