# ⚡ Quick Start - Tech Stack Upgrades

## 🎯 TL;DR - Just Tell Me What to Install

### Option 1: Install EVERYTHING Critical (Recommended)
```bash
# One command to rule them all! 🚀
npm install \
  @tanstack/react-query \
  @tanstack/react-query-devtools \
  @sentry/nextjs \
  drizzle-orm \
  postgres \
  framer-motion \
  @upstash/ratelimit \
  next-secure-headers \
  sonner \
  next-seo

npm install -D drizzle-kit

# Initialize shadcn/ui (interactive)
npx shadcn@latest init

# Initialize Sentry (interactive)
npx @sentry/wizard@latest -i nextjs

# Add essential UI components
npx shadcn@latest add button input card dialog select
```

**Time:** 5 minutes  
**Impact:** Massive! 🔥

---

### Option 2: Start Small (Baby Steps)
```bash
# Week 1: UI Components Only
npx shadcn@latest init
npx shadcn@latest add button input card

# Week 2: Add Data Fetching
npm install @tanstack/react-query

# Week 3: Add Error Tracking
npm install @sentry/nextjs
npx @sentry/wizard@latest -i nextjs

# Week 4: Add Animations
npm install framer-motion
```

---

## 📊 What Each Tool Does (In 1 Sentence)

| Tool | What It Does | Why You Need It |
|------|-------------|-----------------|
| **shadcn/ui** | 50+ beautiful, accessible UI components | Stop building buttons from scratch |
| **TanStack Query** | Smart data fetching with caching | Reduce API calls by 70% |
| **Sentry** | Error tracking & monitoring | Know when things break in production |
| **Drizzle ORM** | Type-safe database queries | Catch SQL bugs at compile time |
| **Framer Motion** | Animation library | Make kanji strokes & transitions smooth |
| **@upstash/ratelimit** | API rate limiting | Prevent API abuse & high bills |
| **next-secure-headers** | Security headers | Pass security audits |
| **sonner** | Toast notifications | Beautiful alerts in 3KB |
| **next-seo** | SEO optimization | Better Google rankings |

---

## 🚀 Post-Installation Setup

### 1. TanStack Query Setup (2 minutes)

Create `src/app/providers.tsx`:
```tsx
'use client'

import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { ReactQueryDevtools } from '@tanstack/react-query-devtools'
import { useState } from 'react'

export function Providers({ children }: { children: React.ReactNode }) {
  const [queryClient] = useState(() => new QueryClient({
    defaultOptions: {
      queries: {
        staleTime: 60 * 1000, // 1 minute
        refetchOnWindowFocus: false,
      },
    },
  }))

  return (
    <QueryClientProvider client={queryClient}>
      {children}
      <ReactQueryDevtools initialIsOpen={false} />
    </QueryClientProvider>
  )
}
```

Update `src/app/layout.tsx`:
```tsx
import { Providers } from './providers'

export default function RootLayout({ children }) {
  return (
    <html>
      <body>
        <Providers>
          <ThemeProvider>
            {children}
          </ThemeProvider>
        </Providers>
        <Analytics />
        <SpeedInsights />
      </body>
    </html>
  )
}
```

---

### 2. shadcn/ui Setup (Interactive)

Run and follow prompts:
```bash
npx shadcn@latest init
```

**Choose:**
- Style: Default
- Base color: Slate (or your preference)
- CSS variables: Yes

Then add components as needed:
```bash
# Add a button
npx shadcn@latest add button

# Use it
import { Button } from "@/components/ui/button"
<Button variant="default">Click me</Button>
```

---

### 3. Drizzle ORM Setup (5 minutes)

Create `drizzle.config.ts`:
```ts
import type { Config } from 'drizzle-kit'

export default {
  schema: './src/drizzle/schema.ts',
  out: './drizzle/migrations',
  driver: 'pg',
  dbCredentials: {
    connectionString: process.env.DATABASE_URL!,
  },
} satisfies Config
```

Create `src/drizzle/schema.ts`:
```ts
import { pgTable, serial, text, timestamp } from 'drizzle-orm/pg-core'

export const textbooks = pgTable('textbooks', {
  id: serial('id').primaryKey(),
  title: text('title').notNull(),
  sswType: text('ssw_type'),
  createdAt: timestamp('created_at').defaultNow(),
})
```

Create `src/drizzle/db.ts`:
```ts
import { drizzle } from 'drizzle-orm/postgres-js'
import postgres from 'postgres'

const connectionString = process.env.DATABASE_URL!
const client = postgres(connectionString)
export const db = drizzle(client)
```

**Use it:**
```ts
import { db } from '@/drizzle/db'
import { textbooks } from '@/drizzle/schema'
import { eq } from 'drizzle-orm'

// Type-safe queries!
const books = await db.select().from(textbooks).where(eq(textbooks.sswType, 'SSW1'))
```

---

### 4. Rate Limiting Setup (3 minutes)

Create `src/lib/rate-limit.ts`:
```ts
import { Ratelimit } from '@upstash/ratelimit'
import { Redis } from '@upstash/redis'

export const ratelimit = new Ratelimit({
  redis: Redis.fromEnv(),
  limiter: Ratelimit.slidingWindow(10, '1 m'),
  analytics: true,
})
```

**Use in API routes:**
```ts
// app/api/textbooks/generate-ssw/route.ts
import { ratelimit } from '@/lib/rate-limit'

export async function POST(request: Request) {
  const ip = request.headers.get('x-forwarded-for') ?? 'anonymous'
  const { success, limit, reset, remaining } = await ratelimit.limit(ip)

  if (!success) {
    return NextResponse.json(
      { error: 'Rate limit exceeded' },
      { 
        status: 429,
        headers: {
          'X-RateLimit-Limit': limit.toString(),
          'X-RateLimit-Remaining': remaining.toString(),
          'X-RateLimit-Reset': reset.toString(),
        }
      }
    )
  }

  // Your logic here...
}
```

---

### 5. Sonner (Toast) Setup (1 minute)

Add to `layout.tsx`:
```tsx
import { Toaster } from 'sonner'

export default function RootLayout({ children }) {
  return (
    <html>
      <body>
        {children}
        <Toaster position="top-right" />
      </body>
    </html>
  )
}
```

**Use anywhere:**
```tsx
import { toast } from 'sonner'

toast.success('Textbook generated!')
toast.error('Something went wrong')
toast.loading('Generating textbook...')

// With promise
toast.promise(generateTextbook(), {
  loading: 'Generating...',
  success: 'Done!',
  error: 'Failed!'
})
```

---

### 6. Framer Motion - Page Transitions (2 minutes)

Create `src/components/PageTransition.tsx`:
```tsx
'use client'

import { motion } from 'framer-motion'

export function PageTransition({ children }: { children: React.ReactNode }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.3 }}
    >
      {children}
    </motion.div>
  )
}
```

**Wrap your pages:**
```tsx
export default function Page() {
  return (
    <PageTransition>
      <h1>My Page</h1>
      {/* content */}
    </PageTransition>
  )
}
```

---

## 🎯 Real-World Examples

### Example 1: Fetch Textbooks with Caching

**Before (Your current code):**
```tsx
const [textbooks, setTextbooks] = useState([])
const [loading, setLoading] = useState(true)

useEffect(() => {
  fetch('/api/textbooks')
    .then(res => res.json())
    .then(data => {
      setTextbooks(data)
      setLoading(false)
    })
}, [])
```

**After (With TanStack Query):**
```tsx
import { useQuery } from '@tanstack/react-query'

function TextbooksList() {
  const { data: textbooks, isLoading } = useQuery({
    queryKey: ['textbooks'],
    queryFn: async () => {
      const res = await fetch('/api/textbooks')
      return res.json()
    },
  })

  if (isLoading) return <div>Loading...</div>
  return <div>{textbooks.map(/* ... */)}</div>
}
```

**Benefits:**
- ✅ Automatic caching (fetch once, use everywhere)
- ✅ Automatic refetching
- ✅ Loading/error states handled
- ✅ DevTools to debug

---

### Example 2: Generate Textbook with Loading State

**Before:**
```tsx
const [generating, setGenerating] = useState(false)

async function generate() {
  setGenerating(true)
  try {
    await fetch('/api/generate', { method: 'POST' })
    alert('Success!')
  } catch {
    alert('Failed!')
  } finally {
    setGenerating(false)
  }
}
```

**After (With Sonner + TanStack Query):**
```tsx
import { useMutation } from '@tanstack/react-query'
import { toast } from 'sonner'

function GenerateButton() {
  const mutation = useMutation({
    mutationFn: async () => {
      const res = await fetch('/api/generate', { method: 'POST' })
      return res.json()
    },
    onSuccess: () => toast.success('Textbook generated!'),
    onError: () => toast.error('Generation failed'),
  })

  return (
    <Button 
      onClick={() => mutation.mutate()}
      disabled={mutation.isPending}
    >
      {mutation.isPending ? 'Generating...' : 'Generate'}
    </Button>
  )
}
```

---

### Example 3: Type-Safe Database Query

**Before (Raw Supabase):**
```tsx
const { data } = await supabase
  .from('textbooks')
  .select('*')
  .eq('ssw_type', 'SSW1') // Typo risk!

// data is 'any' type 😢
```

**After (With Drizzle):**
```tsx
import { db } from '@/drizzle/db'
import { textbooks } from '@/drizzle/schema'
import { eq } from 'drizzle-orm'

const books = await db
  .select()
  .from(textbooks)
  .where(eq(textbooks.sswType, 'SSW1'))
  //            ^^^ Auto-complete! ✨

// books is fully typed! 🎉
```

---

## 📦 Component Library Examples

### shadcn/ui Components You'll Use Most:

```bash
# Install these first
npx shadcn@latest add button      # Buttons (all variants)
npx shadcn@latest add input       # Text inputs
npx shadcn@latest add card        # Card layouts
npx shadcn@latest add dialog      # Modals
npx shadcn@latest add select      # Dropdowns
npx shadcn@latest add textarea    # Multi-line text
npx shadcn@latest add label       # Form labels
npx shadcn@latest add badge       # Tags/badges
npx shadcn@latest add toast       # Notifications (with sonner)
npx shadcn@latest add progress    # Progress bars
```

**Usage:**
```tsx
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

<Card>
  <CardHeader>
    <CardTitle>Generate SSW Textbook</CardTitle>
  </CardHeader>
  <CardContent>
    <Input placeholder="Enter title..." />
    <Button>Generate</Button>
  </CardContent>
</Card>
```

---

## 🔥 Pro Tips

### 1. TanStack Query DevTools
See all your queries in real-time:
```tsx
import { ReactQueryDevtools } from '@tanstack/react-query-devtools'

<ReactQueryDevtools initialIsOpen={false} />
// Opens with button in bottom corner
```

### 2. Invalidate Cache After Mutations
```tsx
const queryClient = useQueryClient()

useMutation({
  mutationFn: createTextbook,
  onSuccess: () => {
    queryClient.invalidateQueries({ queryKey: ['textbooks'] })
    // Refetches textbooks list automatically!
  },
})
```

### 3. Optimistic Updates
```tsx
useMutation({
  mutationFn: updateTextbook,
  onMutate: async (newData) => {
    // Cancel refetches
    await queryClient.cancelQueries({ queryKey: ['textbooks'] })
    
    // Optimistically update cache
    const previous = queryClient.getQueryData(['textbooks'])
    queryClient.setQueryData(['textbooks'], (old) => [...old, newData])
    
    // Return context
    return { previous }
  },
  onError: (err, newData, context) => {
    // Rollback on error
    queryClient.setQueryData(['textbooks'], context.previous)
  },
})
```

### 4. Parallel Queries
```tsx
// Fetch multiple things at once
const textbooksQuery = useQuery({ queryKey: ['textbooks'], ... })
const progressQuery = useQuery({ queryKey: ['progress'], ... })
const statsQuery = useQuery({ queryKey: ['stats'], ... })

// All fetch in parallel! ⚡
```

---

## ✅ Verification Checklist

After installation, verify everything works:

```bash
# 1. Check TanStack Query
# Open app, should see React Query devtools button (bottom corner)

# 2. Check shadcn/ui
# Should have components in src/components/ui/

# 3. Check Drizzle
npm run drizzle-kit generate  # Should work without errors

# 4. Check Sentry
# Make an error, should see it in Sentry dashboard

# 5. Test Rate Limiting
# Call an API endpoint 11 times quickly, 11th should fail with 429
```

---

## 🆘 Troubleshooting

### "Module not found" errors
```bash
rm -rf node_modules package-lock.json
npm install
```

### shadcn components not working
Check `components.json` exists:
```bash
npx shadcn@latest init  # Run again if needed
```

### Drizzle not connecting
Check `DATABASE_URL` in `.env.local`:
```bash
DATABASE_URL="postgresql://user:pass@host:5432/db"
```

### Rate limiting not working
Check Upstash Redis env vars:
```bash
UPSTASH_REDIS_REST_URL=...
UPSTASH_REDIS_REST_TOKEN=...
```

---

## 📚 What to Read Next

1. **Full Details:** `ADVANCED_TECH_STACK_RECOMMENDATIONS.md`
2. **Phase 1 (Done):** `TECH_STACK_ENHANCEMENTS.md`
3. **Component Docs:** https://ui.shadcn.com/
4. **Query Docs:** https://tanstack.com/query/latest

---

## 🎯 Your Next Steps

1. ✅ Read this document
2. ✅ Choose Option 1 or 2 above
3. ✅ Run the install commands
4. ✅ Follow post-installation setup
5. ✅ Test one feature (e.g., TanStack Query)
6. ✅ Gradually migrate existing code

---

**Total Setup Time:** 30 minutes  
**Time Saved Long-Term:** 100+ hours  
**Worth It?** Absolutely! 🚀

---

*Questions? See full details in `ADVANCED_TECH_STACK_RECOMMENDATIONS.md`*
