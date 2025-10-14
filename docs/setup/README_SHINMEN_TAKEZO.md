# 侍 Shinmen Takezo | AI-Powered Japanese Learning Platform

<div align="center">
  
  ![License](https://img.shields.io/badge/license-MIT-blue.svg)
  ![Next.js](https://img.shields.io/badge/Next.js-15+-black?logo=next.js)
  ![TypeScript](https://img.shields.io/badge/TypeScript-5+-blue?logo=typescript)
  ![AI Powered](https://img.shields.io/badge/AI-NVIDIA%20%2B%20OpenAI-purple)
  
  **Master Japanese from JLPT N5 to N1 with AI-powered personalized learning**
  
</div>

---

## 🌸 About Shinmen Takezo

Shinmen Takezo is an advanced AI-powered platform designed to guide learners through every stage of Japanese mastery—from absolute beginner (N5) to advanced proficiency (N1). Named after the legendary samurai Miyamoto Musashi (birth name: Shinmen Takezō), our platform embodies the dedication, discipline, and mastery required to truly learn Japanese.

### ⚡ Key Features

- 🤖 **Dual AI Engine**: NVIDIA models for multimodal tasks + OpenAI fallback for reliability
- 🎯 **Smart Model Routing**: Automatically routes tasks to the best AI model
- 🌓 **Dark/Light Mode**: Beautiful theme system with smooth transitions
- 🔤 **Accessibility**: Font size controls, keyboard navigation, screen reader support
- 🔊 **Audio Pronunciation**: Native Japanese TTS with 0.75x, 1.0x, 1.25x speed control
- ✍️ **Kanji Stroke Order**: Animated stroke-by-stroke demonstrations
- 🧠 **Spaced Repetition**: SM-2 algorithm for optimal retention
- 📱 **Progressive Web App**: Install and use offline
- 🎨 **Japanese Aesthetics**: Sakura-themed, culturally immersive design

---

## 🚀 Quick Start

### Prerequisites

- **Node.js** 18+ 
- **npm** or **yarn**
- **Supabase** account (database already configured)
- **NVIDIA API Keys** (get from [build.nvidia.com](https://build.nvidia.com/))
- **OpenAI API Key** (fallback - optional but recommended)

### Installation

1. **Clone the repository**
   ```bash
   git clone <your-repo-url>
   cd JP
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   ```bash
   cp .env.example .env.local
   ```
   
   Edit `.env.local` and add your API keys:
   ```env
   # NVIDIA API Configuration
   NVIDIA_API_KEY_1=your_first_nvidia_key
   NVIDIA_API_KEY_2=your_second_nvidia_key
   
   # OpenAI (Fallback)
   OPENAI_API_KEY=your_openai_key
   
   # Supabase (already configured)
   SUPABASE_URL=https://zsehtkeycyapjevgbzrd.supabase.co
   NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
   ```

4. **Run development server**
   ```bash
   npm run dev
   ```

5. **Open your browser**
   ```
   http://localhost:3000
   ```

---

## 🧠 AI Architecture

### NVIDIA Integration with Load Balancing

Shinmen Takezo uses a sophisticated AI routing system:

```typescript
// Automatic load balancing across NVIDIA endpoints
NVIDIA Endpoint 1 ⟷ Round-Robin Load Balancer ⟷ NVIDIA Endpoint 2
         ↓                                              ↓
    Retry Logic (3 attempts)              Retry Logic (3 attempts)
         ↓                                              ↓
 Exponential Backoff (1s, 2s, 4s)     Exponential Backoff (1s, 2s, 4s)
         ↓                                              ↓
    Key Rotation on 429/5xx            Key Rotation on 429/5xx
                           ↓
                   OpenAI Fallback
```

### Model Routing Strategy

| Task Type | Primary Models | Use Case |
|-----------|---------------|----------|
| **Multimodal Vision** | llama-3.2-11b-vision-instruct<br/>phi-4-multimodal-instruct | Image captioning, OCR, chart analysis |
| **Textbook Generation** | stockmark-2-100b-instruct | Long-form explanations, stories, dialogues |
| **Grammar Explanations** | stockmark-2-100b-instruct | Detailed Japanese grammar breakdowns |
| **Conversation Practice** | stockmark-2-100b-instruct | Natural conversation drills |
| **Quiz Generation** | mistral-medium-3-instruct | Adaptive quizzes, assessments |
| **Role-Play** | mistral-medium-3-instruct | Interactive scenarios |

---

## 🎨 Design System

### Theme Colors

**Light Mode**
- Primary: `#4f46e5` (Indigo)
- Secondary: `#ec4899` (Pink)
- Accent: `#f59e0b` (Amber)
- Sakura Pink: `#ffb7c5`

**Dark Mode**
- Primary: `#6366f1` (Light Indigo)
- Secondary: `#f472b6` (Light Pink)
- Accent: `#fbbf24` (Light Amber)
- Sakura Pink: `#ff8fab`

### Typography

- **Sans-serif**: Geist (Latin) + Noto Sans JP (Japanese)
- **Monospace**: Geist Mono (code blocks)

---

## 📁 Project Structure

```
src/
├── app/
│   ├── (auth)/              # Authentication pages
│   ├── dashboard/           # User dashboard
│   ├── api/                 # API routes
│   │   └── nvidia/          # NVIDIA AI endpoints
│   ├── layout.tsx           # Root layout with theme
│   └── page.tsx             # Landing page
├── components/
│   ├── theme/               # Theme controls
│   │   ├── ThemeToggle.tsx
│   │   └── FontSizeControl.tsx
│   ├── audio/               # Audio components
│   │   └── AudioPlayer.tsx
│   ├── kanji/               # Kanji learning
│   │   └── StrokeAnimator.tsx
│   └── shared/              # Shared components
│       └── PoweredByAIBadge.tsx
├── lib/
│   ├── ai/                  # AI integration
│   │   ├── nvidia-client.ts     # Load balancer & retry logic
│   │   ├── model-router.ts      # Smart task routing
│   │   └── openai.ts           # Fallback provider
│   ├── theme/               # Theme system
│   │   └── theme-context.tsx
│   ├── database/            # Database queries
│   └── auth/                # Authentication
└── types/                   # TypeScript types
```

---

## 🔧 Configuration

### NVIDIA API Setup

1. Visit [build.nvidia.com](https://build.nvidia.com/)
2. Create an account and generate API keys
3. Add keys to `.env.local`:
   ```env
   NVIDIA_API_KEY_1=nvapi-xxxxx
   NVIDIA_API_KEY_2=nvapi-yyyyy
   ```

### Theme Customization

Edit `src/app/globals.css` to customize colors:

```css
:root {
  --primary: #4f46e5;
  --sakura-pink: #ffb7c5;
  /* ... */
}

.dark {
  --primary: #6366f1;
  --sakura-pink: #ff8fab;
  /* ... */
}
```

---

## 🧪 Testing

```bash
# Run unit tests
npm test

# Run e2e tests
npm run test:e2e

# Lighthouse audit
npm run lighthouse
```

---

## 📦 Deployment

### Docker

```bash
# Build optimized image (<200MB)
docker build -t shinmen-takezo:latest .

# Run container
docker run -p 3000:3000 --env-file .env.local shinmen-takezo:latest
```

### Vercel

```bash
# Deploy to Vercel
vercel deploy --prod
```

---

## 🌐 API Documentation

### NVIDIA Chat Endpoint

**POST** `/api/nvidia/chat`

```json
{
  "task": "textbook_generation",
  "messages": [
    {
      "role": "user",
      "content": "Explain the particle は in Japanese"
    }
  ],
  "temperature": 0.7,
  "maxTokens": 2000
}
```

**Response**:
```json
{
  "success": true,
  "data": {
    "content": "...",
    "model": "stockmark/stockmark-2-100b-instruct",
    "provider": "nvidia",
    "usage": { ... }
  }
}
```

---

## 🤝 Contributing

We welcome contributions! Please see [CONTRIBUTING.md](../contributing/CONTRIBUTING.md) for guidelines.

---

## 📄 License

MIT License - see [LICENSE](../../LICENSE) file for details.

---

## 🙏 Acknowledgments

- **NVIDIA** - For providing powerful AI models
- **OpenAI** - For GPT-4 fallback capabilities
- **Supabase** - For database infrastructure
- **Next.js Team** - For the amazing framework
- **Japanese Language Community** - For inspiration and guidance

---

<div align="center">
  
  **Built with ❤️ by the Shinmen Takezo Team**
  
  *Empowering learners on their path to Japanese mastery*
  
  🌸 侍 🌸
  
</div>
