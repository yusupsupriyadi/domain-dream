# Domain Dream

A modern domain search and AI-powered domain name generator platform built with Next.js 15, TypeScript, and Magic UI components.

## Features

### ✅ Completed Features

- 🔍 **Domain Availability Checking**: Real-time RDAP-based checking across multiple TLDs
- 🎨 **Modern Minimalist UI**: Black and white theme with Magic UI components
- ✨ **Smooth Animations**: Text animations (blurInUp, slideUp) and shimmer effects
- 🔄 **Mode Toggle**: Switch between Search Domain and AI Generator modes
- ⚡ **Fast & Type-Safe API**: Built with ElysiaJS for maximum performance
- 📱 **Responsive Design**: Optimized for all devices

### 🚧 Upcoming Features

- 📦 **Bulk Domain Checking**: Check up to 50 domains simultaneously (Phase 1)
- 🤖 **AI Domain Generator**: Generate creative domain names (Phase 2)
- 💬 **AI Chat with Memory**: Conversational brainstorming interface (Phase 2)
- 📊 **Domain Analytics**: SEO insights, trends, and valuation (Phase 2)

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
	"tlds": ["com", "net", "org"] // Optional, defaults to ["com", "id", "ai", "org", "net", "io"]
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

- Domain extraction: "example.com" → extracts "example" and ".com"
- Subdomain support: "api.example.com" → extracts "api.example" and ".com"
- Smart TLD handling:
    - Empty `tlds` array uses defaults: ["com", "id", "ai", "org", "net", "io"]
    - If input contains a TLD not in defaults, it's automatically added
    - Example: "yapping.co" → checks 7 domains (6 defaults + .co)

### UI Features

- **Smart Result Display**:
    - Results are organized into two sections:
        - "Searched domain:" - Shows the specific TLD from user input (if provided)
        - "Other results:" - Shows remaining default TLDs
    - Improves UX by prioritizing what the user specifically searched for

## Project Structure

```
src/
├── app/                    # Next.js App Router
│   ├── (home)/            # Homepage with domain search
│   │   ├── page.tsx       # Main search interface
│   │   └── partials/      # Page components
│   ├── api/               # API routes
│   │   └── [[...slugs]]/  # ElysiaJS catch-all route
│   │       ├── modules/   # Modular API structure
│   │       │   ├── health/
│   │       │   └── domains/
│   │       └── route.ts   # Main API handler
│   ├── layout.tsx         # Root layout
│   └── globals.css        # Global styles
├── components/            # React components
│   └── ui/               # shadcn/ui + Magic UI components
│       ├── dot-pattern.tsx      # Background pattern
│       ├── shimmer-button.tsx   # Animated buttons
│       └── text-animate.tsx     # Text animations
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
