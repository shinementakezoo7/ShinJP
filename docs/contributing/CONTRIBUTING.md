# Contributing to ShinJP (新日本)

First off, thank you for considering contributing to ShinJP! 🎌 It's people like you that make ShinJP such a great tool for Japanese language learners worldwide.

## 📋 Table of Contents

- [Code of Conduct](#code-of-conduct)
- [How Can I Contribute?](#how-can-i-contribute)
- [Development Setup](#development-setup)
- [Coding Guidelines](#coding-guidelines)
- [Commit Message Guidelines](#commit-message-guidelines)
- [Pull Request Process](#pull-request-process)
- [Project Structure](#project-structure)
- [Testing Guidelines](#testing-guidelines)

---

## 📜 Code of Conduct

This project and everyone participating in it is governed by our Code of Conduct. By participating, you are expected to uphold this code. Please report unacceptable behavior to the project maintainers.

### Our Standards

**Examples of behavior that contributes to a positive environment:**
- ✅ Using welcoming and inclusive language
- ✅ Being respectful of differing viewpoints and experiences
- ✅ Gracefully accepting constructive criticism
- ✅ Focusing on what is best for the community
- ✅ Showing empathy towards other community members

**Examples of unacceptable behavior:**
- ❌ The use of sexualized language or imagery
- ❌ Trolling, insulting/derogatory comments, and personal attacks
- ❌ Public or private harassment
- ❌ Publishing others' private information without permission
- ❌ Other conduct which could reasonably be considered inappropriate

---

## 🤝 How Can I Contribute?

### 🐛 Reporting Bugs

Before creating bug reports, please check the existing issues to avoid duplicates.

**When you create a bug report, include:**
- **Clear title and description**
- **Steps to reproduce** the behavior
- **Expected behavior** vs **actual behavior**
- **Screenshots** if applicable
- **Environment details** (OS, browser, Node version)
- **Error messages** or console logs

**Use this template:**

```markdown
**Describe the bug**
A clear and concise description of what the bug is.

**To Reproduce**
Steps to reproduce the behavior:
1. Go to '...'
2. Click on '....'
3. Scroll down to '....'
4. See error

**Expected behavior**
A clear and concise description of what you expected to happen.

**Screenshots**
If applicable, add screenshots to help explain your problem.

**Environment:**
- OS: [e.g. Windows 10, macOS 13, Ubuntu 22.04]
- Browser: [e.g. Chrome 120, Firefox 121]
- Node Version: [e.g. 20.10.0]
- Project Version: [e.g. 1.0.0]

**Additional context**
Add any other context about the problem here.
```

### ✨ Suggesting Enhancements

Enhancement suggestions are tracked as GitHub issues.

**When suggesting an enhancement:**
- **Use a clear and descriptive title**
- **Provide step-by-step description** of the suggested enhancement
- **Explain why this enhancement would be useful**
- **List examples** of how it works in other applications (if applicable)

### 🎨 Your First Code Contribution

Unsure where to begin? Look for issues labeled:
- `good first issue` - Good for newcomers
- `help wanted` - Issues that need attention
- `documentation` - Documentation improvements

### 📝 Pull Requests

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'feat: add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

---

## 🛠️ Development Setup

### Prerequisites

```bash
# Required
Node.js 20.0.0+
npm or yarn
Git

# Recommended
VS Code with extensions:
  - ESLint
  - Prettier
  - TypeScript and JavaScript Language Features
```

### Installation

1. **Fork and clone the repository**
```bash
git clone https://github.com/YOUR-USERNAME/shinjp.git
cd shinjp
```

2. **Install dependencies**
```bash
npm install
```

3. **Set up environment variables**
```bash
cp .env.example .env.local
# Edit .env.local with your credentials
```

4. **Set up database**
```bash
# Go to Supabase Dashboard → SQL Editor
# Run migrations from database/migrations/ in order
```

5. **Start development server**
```bash
npm run dev
```

6. **Open your browser**
```
http://localhost:3000
```

### Running Tests

```bash
# Run all tests
npm test

# Run tests in watch mode
npm run test:watch

# Run tests with coverage
npm run test:coverage

# Type checking
npm run type-check

# Linting
npm run lint

# Fix linting issues
npm run lint:fix
```

---

## 📐 Coding Guidelines

### TypeScript

- **Always use TypeScript** - No plain JavaScript files
- **Enable strict mode** - Already configured in tsconfig.json
- **Define types** - Avoid `any`, use proper types or `unknown`
- **Use interfaces** for objects, **types** for unions/intersections

```typescript
// ✅ Good
interface User {
  id: string;
  name: string;
  email: string;
}

// ❌ Bad
const user: any = { ... };
```

### React Components

- **Use functional components** with hooks
- **Use TypeScript** for props
- **Extract complex logic** to custom hooks
- **Keep components focused** - Single responsibility
- **Use Server Components** when possible (Next.js 15)

```typescript
// ✅ Good - Functional component with TypeScript
interface ButtonProps {
  label: string;
  onClick: () => void;
  variant?: 'primary' | 'secondary';
}

export function Button({ label, onClick, variant = 'primary' }: ButtonProps) {
  return (
    <button 
      onClick={onClick} 
      className={`btn btn-${variant}`}
    >
      {label}
    </button>
  );
}
```

### Naming Conventions

- **Files**: `kebab-case.tsx` (e.g., `user-profile.tsx`)
- **Components**: `PascalCase` (e.g., `UserProfile`)
- **Functions**: `camelCase` (e.g., `getUserData`)
- **Constants**: `UPPER_SNAKE_CASE` (e.g., `MAX_RETRY_COUNT`)
- **Interfaces/Types**: `PascalCase` (e.g., `UserData`)

### Code Style

- **Use Prettier** for formatting (configured)
- **Use ESLint** rules (configured)
- **2 spaces** for indentation
- **Single quotes** for strings
- **Semicolons** required
- **Trailing commas** for multi-line

```typescript
// ✅ Good
const config = {
  name: 'ShinJP',
  version: '1.0.0',
  features: ['JLPT', 'SSW', 'Kanji'],
};

// ❌ Bad
const config = {
  name: "ShinJP",
  version: "1.0.0",
  features: ["JLPT", "SSW", "Kanji"]
}
```

### Comments

- **Write self-documenting code** - Good names reduce need for comments
- **Use JSDoc** for functions and components
- **Explain WHY, not WHAT** - Code shows what, comments explain why

```typescript
// ✅ Good
/**
 * Generates SSW textbook for a specific sector.
 * Uses NVIDIA's stockmark-2-100b model for Japanese language generation.
 * 
 * @param sector - Target SSW sector (e.g., 'caregiving', 'construction')
 * @param chapterCount - Number of chapters to generate (3-20)
 * @returns Generated textbook with chapters and metadata
 */
async function generateSSWTextbook(sector: string, chapterCount: number) {
  // Using stockmark-2 because it's trained on Japanese workplace contexts
  const model = 'stockmark-2-100b-instruct';
  // ...
}
```

### Database Queries

- **Use parameterized queries** - Prevent SQL injection
- **Use Supabase client methods** when possible
- **Handle errors** properly
- **Use transactions** for multi-step operations

```typescript
// ✅ Good
const { data, error } = await supabase
  .from('textbooks')
  .select('*')
  .eq('ssw_type', 'SSW1')
  .order('created_at', { ascending: false });

if (error) {
  console.error('Failed to fetch textbooks:', error);
  throw new Error('Database query failed');
}

// ❌ Bad
const data = await supabase.from('textbooks').select('*');
// No error handling
```

---

## 📝 Commit Message Guidelines

We follow [Conventional Commits](https://www.conventionalcommits.org/) specification.

### Format

```
<type>(<scope>): <subject>

<body>

<footer>
```

### Types

- `feat`: New feature
- `fix`: Bug fix
- `docs`: Documentation only
- `style`: Code style changes (formatting, no code change)
- `refactor`: Code refactoring
- `perf`: Performance improvement
- `test`: Adding or updating tests
- `chore`: Build process or auxiliary tool changes
- `ci`: CI/CD changes

### Examples

```bash
# Feature
git commit -m "feat(ssw): add caregiving sector vocabulary"

# Bug fix
git commit -m "fix(audio): resolve playback issue on Safari"

# Documentation
git commit -m "docs(readme): add deployment guide section"

# Performance
git commit -m "perf(kanji): optimize stroke order rendering"

# With body and footer
git commit -m "feat(ai): integrate NVIDIA stockmark-2-100b model

- Add model router for intelligent selection
- Implement fallback to backup models
- Add rate limiting and caching

Closes #123"
```

---

## 🔀 Pull Request Process

### Before Submitting

1. ✅ **Update documentation** if you changed functionality
2. ✅ **Add or update tests** for your changes
3. ✅ **Ensure all tests pass**: `npm test`
4. ✅ **Run linter**: `npm run lint`
5. ✅ **Check types**: `npm run type-check`
6. ✅ **Test in browser** - Verify your changes work
7. ✅ **Update CHANGELOG.md** if applicable

### Pull Request Template

```markdown
## Description
Brief description of what this PR does.

## Type of Change
- [ ] 🐛 Bug fix (non-breaking change which fixes an issue)
- [ ] ✨ New feature (non-breaking change which adds functionality)
- [ ] 💥 Breaking change (fix or feature that would cause existing functionality to not work as expected)
- [ ] 📝 Documentation update

## Related Issues
Closes #(issue number)

## How Has This Been Tested?
Describe the tests you ran to verify your changes.

## Screenshots (if applicable)
Add screenshots to demonstrate the changes.

## Checklist
- [ ] My code follows the project's style guidelines
- [ ] I have performed a self-review of my own code
- [ ] I have commented my code, particularly in hard-to-understand areas
- [ ] I have made corresponding changes to the documentation
- [ ] My changes generate no new warnings or errors
- [ ] I have added tests that prove my fix is effective or that my feature works
- [ ] New and existing unit tests pass locally with my changes
- [ ] Any dependent changes have been merged and published
```

### Review Process

1. **Automated Checks** - CI/CD runs tests, linting, type checking
2. **Code Review** - Maintainer reviews within 48 hours
3. **Feedback** - Address any requested changes
4. **Approval** - Once approved, maintainer merges
5. **Deployment** - Changes go live on next deployment

---

## 📂 Project Structure

```
shinjp/
├── src/
│   ├── app/              # Next.js app router (pages + API routes)
│   ├── components/       # React components
│   ├── lib/              # Utilities, helpers, services
│   ├── hooks/            # Custom React hooks
│   ├── stores/           # State management (Zustand)
│   └── types/            # TypeScript type definitions
├── database/
│   └── migrations/       # SQL migration files
├── docs/                 # Documentation
├── tests/                # Test files
├── public/               # Static assets
└── scripts/              # Build and utility scripts
```

### Where to Add Code

- **New page**: `src/app/[route]/page.tsx`
- **New API endpoint**: `src/app/api/[route]/route.ts`
- **New component**: `src/components/[category]/[name].tsx`
- **New service**: `src/lib/[service-name]/[file].ts`
- **New hook**: `src/hooks/use-[hook-name].ts`
- **Database schema**: `database/migrations/[number]_[description].sql`
- **Documentation**: `docs/[category]/[file].md`

---

## 🧪 Testing Guidelines

### Test Structure

```typescript
import { render, screen, fireEvent } from '@testing-library/react';
import { Button } from '@/components/ui/button';

describe('Button Component', () => {
  it('renders with correct label', () => {
    render(<Button label="Click me" onClick={() => {}} />);
    expect(screen.getByText('Click me')).toBeInTheDocument();
  });

  it('calls onClick when clicked', () => {
    const handleClick = jest.fn();
    render(<Button label="Click me" onClick={handleClick} />);
    
    fireEvent.click(screen.getByText('Click me'));
    expect(handleClick).toHaveBeenCalledTimes(1);
  });
});
```

### What to Test

- ✅ **Component rendering** - Does it display correctly?
- ✅ **User interactions** - Click, type, submit work?
- ✅ **State changes** - Does state update correctly?
- ✅ **Edge cases** - Empty data, errors, loading states
- ✅ **API calls** - Mock external services
- ✅ **Utility functions** - Pure functions are easy to test

---

## 🎯 Contribution Areas

### High Priority

- 🐛 **Bug fixes** - Check GitHub issues
- 🌍 **Translations** - Vietnamese, Indonesian, Filipino, Nepali, English
- 📚 **Content** - More vocabulary, grammar, workplace scenarios
- 🧪 **Tests** - Improve test coverage

### Medium Priority

- ✨ **Features** - Speech recognition, flashcards, spaced repetition
- 🎨 **UI/UX** - Design improvements, mobile optimization
- 📖 **Documentation** - Tutorials, guides, API docs
- ⚡ **Performance** - Optimization, caching, bundle size

### Future Ideas

- 🎮 **Gamification** - Points, badges, achievements
- 👥 **Social features** - Study groups, leaderboards
- 📱 **Mobile app** - React Native version
- 🔊 **Speech recognition** - Practice pronunciation
- 🤖 **Chatbot tutor** - AI conversation practice

---

## 📞 Getting Help

- 📖 **Documentation**: Check `/docs` folder
- 💬 **Discussions**: [GitHub Discussions](https://github.com/yourusername/shinjp/discussions)
- 🐛 **Issues**: [GitHub Issues](https://github.com/yourusername/shinjp/issues)
- 📧 **Email**: support@shinjp.app

---

## 🏆 Recognition

Contributors will be:
- ✨ Listed in the project README
- 🎉 Credited in release notes
- 💖 Forever appreciated by the community!

---

## 📄 License

By contributing, you agree that your contributions will be licensed under the MIT License.

---

<div align="center">

**Thank you for contributing to ShinJP!** 🎌

*Together, we're making Japanese learning accessible to everyone.*

</div>
