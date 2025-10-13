# Project Structure

This document outlines the directory structure and organization of the Japanese Learning Platform.

## Main Directories

```
japanese-learning-platform/
├── .github/                 # GitHub configurations
│   └── workflows/          # CI/CD workflows
├── .next/                  # Next.js build output (auto-generated)
├── .vscode/                # VS Code settings and configurations
├── config/                 # Configuration files
├── database/               # Database schemas and migrations
├── docs/                   # Documentation files
├── node_modules/           # Node.js dependencies (auto-generated)
├── public/                 # Static assets
├── scripts/                # Utility scripts
├── src/                    # Source code
│   ├── app/                # Next.js App Router pages
│   ├── components/         # Reusable React components
│   ├── hooks/              # Custom React hooks
│   ├── lib/                # Library and utility functions
│   └── stores/             # State management (Zustand stores)
├── tests/                  # Test files
└── ...
```

## Source Code Structure (`src/`)

```
src/
├── app/                    # Next.js App Router
│   ├── (auth)/            # Authentication pages (route groups)
│   ├── api/               # API routes
│   ├── dashboard/         # Dashboard pages
│   ├── layout.tsx         # Root layout
│   └── page.tsx           # Home page
├── components/            # Shared components
│   ├── dashboard/         # Dashboard-specific components
│   └── ui/                # Generic UI components
├── hooks/                 # Custom hooks
├── lib/                   # Libraries and utilities
│   ├── ai/                # AI service integrations
│   ├── database/          # Database functions and types
│   └── supabase/          # Supabase client configuration
└── stores/                # Zustand stores for state management
```

## Key Files

- `package.json` - Project dependencies and scripts
- `next.config.ts` - Next.js configuration
- `tsconfig.json` - TypeScript configuration
- `eslint.config.mjs` - ESLint configuration
- `.env.local` - Local environment variables
- `.gitignore` - Git ignore patterns