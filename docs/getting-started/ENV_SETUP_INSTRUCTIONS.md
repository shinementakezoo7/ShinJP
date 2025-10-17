# 🔧 Environment Variables Setup Instructions

## ✅ What You Need to Do

Your `.env.local` file is **missing some required variables**. Follow these steps:

---

## 📝 Step 1: Copy the Complete Configuration

I've created a complete `.env.local` file for you: **`.env.local.complete`**

**Option A: Replace your current file**
```bash
# Backup your current file
cp .env.local .env.local.backup

# Use the complete file
cp .env.local.complete .env.local
```

**Option B: Add missing variables manually**

Add these lines to your existing `.env.local`:

```env
# =======================
# Application Configuration
# =======================
NODE_ENV=development
NEXT_PUBLIC_APP_URL=http://localhost:3000

# =======================
# NextAuth Configuration (REQUIRED)
# =======================
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=shinmen-takezo-secret-key-change-this-in-production-minimum-32-chars

# =======================
# NVIDIA API Configuration (OPTIONAL)
# =======================
NVIDIA_ENDPOINT_1=https://integrate.api.nvidia.com/v1/chat/completions
NVIDIA_ENDPOINT_2=https://integrate.api.nvidia.com/v1
```

---

## 🔑 Step 2: Add AI Provider Keys (Optional but Recommended)

To enable AI features, uncomment and add your API keys:

### **NVIDIA (Recommended)**
1. Visit: https://build.nvidia.com/
2. Sign up / Log in
3. Generate API keys
4. Add to `.env.local`:
   ```env
   NVIDIA_API_KEY_1=nvapi-xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
   NVIDIA_API_KEY_2=nvapi-yyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyy
   ```

### **OpenAI (Fallback)**
1. Visit: https://platform.openai.com/api-keys
2. Create API key
3. Add to `.env.local`:
   ```env
   OPENAI_API_KEY=sk-xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
   ```

---

## ✅ Step 3: Verify Configuration

Run the environment checker:

```bash
npm run check-env
```

**Expected output**:
```
✅ Ready to run! Use: npm run dev
```

Or:
```
⚠️  Ready but no AI configured
```
(This is OK - the platform will work without AI features)

---

## 🚀 Step 4: Start Development Server

```bash
npm run dev
```

Visit: http://localhost:3000

---

## 📊 Current Status

### ✅ Already Configured
- ✅ Supabase database connection
- ✅ PostgreSQL credentials
- ✅ JWT secret

### ⚠️ Missing (Required)
- ❌ `NEXTAUTH_URL` - Required for authentication
- ❌ `NEXTAUTH_SECRET` - Required for session security

### ⚠️ Missing (Optional - AI Features)
- ❌ `NVIDIA_API_KEY_1` - For AI-powered content generation
- ❌ `NVIDIA_API_KEY_2` - For load balancing
- ❌ `OPENAI_API_KEY` - For AI fallback

---

## 🎯 Quick Fix (Copy & Paste)

**Replace your entire `.env.local` with this:**

```env
# Shinmen Takezo Configuration

# Application
NODE_ENV=development
NEXT_PUBLIC_APP_URL=http://localhost:3000

# NextAuth (REQUIRED)
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=shinmen-takezo-secret-key-change-this-in-production-minimum-32-chars

# Supabase (Already configured)
SUPABASE_URL=https://zsehtkeycyapjevgbzrd.supabase.co
NEXT_PUBLIC_SUPABASE_URL=https://zsehtkeycyapjevgbzrd.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InpzZWh0a2V5Y3lhcGpldmdienJkIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTg3MDUzNTQsImV4cCI6MjA3NDI4MTM1NH0.tYvimaOGjq4NNjhF3-_DU90JTK8yVmX-JewnN5yDr2A
SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InpzZWh0a2V5Y3lhcGpldmdienJkIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc1ODcwNTM1NCwiZXhwIjoyMDc0MjgxMzU0fQ.efBSMg7PKP6V0eUzZ5OtOGQzsLtv5HCgKgMPgRgg4wo
SUPABASE_JWT_SECRET=FVr2Lsopo57zHpaLc+tK0VmyYfaAvfVThR4zs7QfUq0dcoi3Rp7jCsjQogzv/wdAr+Imxw+9d9hx4q+tWPkq8g==

# Database
POSTGRES_HOST=db.zsehtkeycyapjevgbzrd.supabase.co
POSTGRES_USER=postgres
POSTGRES_PASSWORD=Woc2vDYW6Gae3aOK
POSTGRES_DATABASE=postgres
POSTGRES_URL=postgres://postgres.zsehtkeycyapjevgbzrd:Woc2vDYW6Gae3aOK@aws-1-us-east-1.pooler.supabase.com:6543/postgres?sslmode=require&supa=base-pooler.x
POSTGRES_PRISMA_URL=postgres://postgres.zsehtkeycyapjevgbzrd:Woc2vDYW6Gae3aOK@aws-1-us-east-1.pooler.supabase.com:6543/postgres?sslmode=require&pgbouncer=true
POSTGRES_URL_NON_POOLING=postgres://postgres.zsehtkeycyapjevgbzrd:Woc2vDYW6Gae3aOK@aws-1-us-east-1.pooler.supabase.com:5432/postgres?sslmode=require

# NVIDIA (Optional - uncomment and add keys)
# NVIDIA_API_KEY_1=your_key_here
# NVIDIA_API_KEY_2=your_key_here
NVIDIA_ENDPOINT_1=https://integrate.api.nvidia.com/v1/chat/completions
NVIDIA_ENDPOINT_2=https://integrate.api.nvidia.com/v1

# OpenAI (Optional - uncomment and add key)
# OPENAI_API_KEY=your_key_here
```

---

## 🆘 Need Help?

### Error: "NEXTAUTH_URL is required"
**Fix**: Add `NEXTAUTH_URL=http://localhost:3000` to `.env.local`

### Error: "NEXTAUTH_SECRET is required"
**Fix**: Add `NEXTAUTH_SECRET=shinmen-takezo-secret-key-change-this-in-production-minimum-32-chars` to `.env.local`

### Warning: "No AI providers configured"
**This is OK!** The platform will work without AI. To enable AI:
1. Get NVIDIA or OpenAI keys
2. Add to `.env.local`
3. Restart server

---

## ✅ Verification Checklist

- [ ] `.env.local` file exists
- [ ] `NEXTAUTH_URL` is set
- [ ] `NEXTAUTH_SECRET` is set
- [ ] All Supabase variables are present
- [ ] Run `npm run check-env` successfully
- [ ] Run `npm run dev` successfully
- [ ] Visit http://localhost:3000 without errors

---

## 🎉 You're Ready!

Once you've added the required variables:

```bash
npm run dev
```

Then visit: **http://localhost:3000/demo**

---

<div align="center">

**Need the AI features?**

Get keys from:
- NVIDIA: https://build.nvidia.com/
- OpenAI: https://platform.openai.com/api-keys

</div>
