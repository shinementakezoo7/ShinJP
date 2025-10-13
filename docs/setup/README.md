# 🚀 Setup & Getting Started

Everything you need to get Shinmen Takezo running on your machine.

---

## 📚 Documentation Files

### [Complete Setup Guide](./COMPLETE_SETUP_GUIDE.md) ⭐
**Comprehensive setup instructions**
- Prerequisites
- Installation steps
- Environment configuration
- Database setup
- Running the application
- Troubleshooting

### [Quick Start](./QUICK_START.md)
**Get up and running in minutes**
- Minimal setup
- Quick commands
- Basic configuration
- Testing the setup

### [Start Here](./START_HERE.md)
**New developer onboarding**
- Project overview
- First steps
- Key concepts
- Where to go next

### [System Ready Guide](./SYSTEM_READY.md)
**Production readiness checklist**
- Environment verification
- Performance checks
- Security audit
- Deployment preparation

### [Environment Setup Instructions](./ENV_SETUP_INSTRUCTIONS.md)
**Environment variables configuration**
- Required variables
- Optional settings
- API keys setup
- Security considerations

### [Instant Fix](./INSTANT_FIX.md)
**Common issues and quick fixes**
- Build errors
- Runtime issues
- Database problems
- Quick solutions

### [Textbook Generator Setup](./TEXTBOOK_GENERATOR_SETUP.md)
**AI textbook generation configuration**
- NVIDIA AI setup
- Generator configuration
- Testing generation
- Troubleshooting

### [Phase 2 Setup Instructions](./PHASE2_SETUP_INSTRUCTIONS.md)
**Advanced features setup**
- Additional dependencies
- Feature flags
- Advanced configuration

---

## ⚡ Quick Start Commands

```bash
# Clone the repository
git clone https://github.com/yourusername/shinmen-takezo.git
cd shinmen-takezo

# Install dependencies
npm install

# Setup environment
cp .env.example .env.local
# Edit .env.local with your credentials

# Run development server
npm run dev

# Open browser
http://localhost:3000
```

---

## 📋 Prerequisites

### Required
- ✅ Node.js 20+ 
- ✅ npm or yarn
- ✅ Git

### Accounts Needed
- ✅ Supabase account (database)
- ✅ NVIDIA AI account (AI features)
- ✅ Vercel account (deployment - optional)

---

## 🔧 Environment Variables

### Required
```env
# Database
DATABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key

# AI
NVIDIA_API_KEY=your_nvidia_key

# NextAuth
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=your_secret
```

### Optional
```env
# Analytics
NEXT_PUBLIC_POSTHOG_KEY=your_key
VERCEL_ANALYTICS_ID=your_id

# Social Auth
GOOGLE_CLIENT_ID=your_id
GOOGLE_CLIENT_SECRET=your_secret
```

---

## 🐛 Common Issues

### Build Errors
```bash
# Clear cache and reinstall
rm -rf node_modules package-lock.json
npm install

# Clear Next.js cache
rm -rf .next
npm run dev
```

### Database Connection
```bash
# Test connection
npm run db:test

# Reset database
npm run db:push
```

### TypeScript Errors
```bash
# Type check
npm run type-check

# Clear TypeScript cache
rm -rf .next tsconfig.tsbuildinfo
```

---

## 📚 Related Documentation

- [Implementation](../implementation/) - Technical details
- [Features](../features/) - Feature guides
- [Tech Stack](../tech-stack/) - Technologies used

---

## 🆘 Need Help?

- 📖 Check [Complete Setup Guide](./COMPLETE_SETUP_GUIDE.md)
- 🐛 See [Instant Fix](./INSTANT_FIX.md)
- 💬 Create a [GitHub Issue](https://github.com/yourusername/shinmen-takezo/issues)

---

**Status**: ✅ Ready to use  
**Last Updated**: October 2025
