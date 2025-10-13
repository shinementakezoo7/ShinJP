# AI-Powered Japanese Learning Platform 🇯🇵

[![Next.js](https://img.shields.io/badge/Next.js-15+-black?style=flat&logo=next.js)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-Strict-blue?style=flat&logo=typescript)](https://www.typescriptlang.org/)
[![Supabase](https://img.shields.io/badge/Supabase-PostgreSQL-3ECF8E?style=flat&logo=supabase)](https://supabase.io/)
[![OpenAI](https://img.shields.io/badge/OpenAI-GPT--4-412991?style=flat&logo=openai)](https://openai.com/)
[![License](https://img.shields.io/github/license/your-username/japanese-learning-platform?style=flat)](LICENSE)

<div align="center">
  <img src="https://raw.githubusercontent.com/simple-icons/simple-icons/develop/icons/nextdotjs.svg" width="60" height="60" alt="Next.js" />
  <img src="https://raw.githubusercontent.com/simple-icons/simple-icons/develop/icons/supabase.svg" width="60" height="60" alt="Supabase" />
  <img src="https://raw.githubusercontent.com/simple-icons/simple-icons/develop/icons/openai.svg" width="60" height="60" alt="OpenAI" />
  <h3>An advanced, AI-powered platform for mastering Japanese through personalized learning, spaced repetition, and gamified experiences.</h3>
</div>

## 🌟 Key Features

### 🤖 AI-Powered Personalization
- **Intelligent Tutoring**: Conversational AI partner with contextual memory
- **Adaptive Content Generation**: Personalized lessons and stories based on your interests
- **Pronunciation Analysis**: Speech recognition for accurate pronunciation feedback
- **Handwriting Recognition**: Stroke-by-stroke kanji writing evaluation

### 🔐 Enhanced Authentication System
- **Multi-Factor Authentication**: API keys with permission-based access
- **Secure OAuth Integration**: Encrypted session management for Google login
- **Role-Based Access Control**: Admin, Moderator, User, and Pending roles
- **Advanced Security**: Rate limiting, account lockout, and security event logging

### 🧠 Smart Learning Algorithms
- **Spaced Repetition System**: Modified SM-2 algorithm with ML-enhanced retention prediction
- **Adaptive Difficulty**: Dynamic adjustment based on your performance
- **Progressive Learning Path**: Curated curriculum that adapts to your strengths and weaknesses

### 🎮 Gamified Experience
- **Achievement System**: Badges, XP progression, and leaderboard rankings
- **Interactive Exercises**: Drills, quizzes, and mini-games for active learning
- **Social Learning**: Study groups, forums, and peer-to-peer practice
- **Virtual Environments**: Immersive scenarios for real-world practice

### 📚 Rich Content Library
- **Interactive Books**: AI-generated stories with embedded learning tools
- **Comprehensive Curriculum**: From hiragana to JLPT N1 preparation
- **Multimedia Integration**: Audio narration, visual aids, and interactive elements
- **Progress Tracking**: Detailed analytics and mastery predictions

## 🏗️ Enhanced System Architecture

<div align="center">

```mermaid
graph TD
    A[📱 Client Frontend] --> B{🔐 API Gateway}
    B --> C[Next.js App Router]
    B --> D[Server Actions]
    B --> E[Edge Functions]

    C --> F[⚛️ React Components]
    C --> G[🖥️ Server Components]
    D --> H[🧠 Business Logic]
    E --> I[⚙️ Background Tasks]

    H --> J[(🗄️ Supabase PostgreSQL)]
    H --> K[🤖 AI Services]
    H --> L[☁️ Cloudinary Storage]

    K --> M[🧠 OpenAI GPT-4]
    K --> N[🎤 Google Speech-to-Text]
    K --> O[👁️ Azure Cognitive Services]
    K --> P[🔊 ElevenLabs TTS]

    J --> Q[🛡️ Row Level Security]
    J --> R[⚡ Realtime Subscriptions]

    F --> S[🎨 Tailwind CSS]
    F --> T[🧩 shadcn/ui]
    F --> U[🔄 Zustand State]

    subgraph "🎨 Frontend"
        A
        F
        S
        T
        U
    end

    subgraph "⚙️ Backend"
        B
        C
        D
        E
        H
        I
    end

    subgraph "🔒 Security Layer"
        V[🔑 Enhanced Auth]
        W[📱 API Key Mgmt]
        X[🔒 OAuth Sessions]
        Y[🎭 RBAC System]
        Z[🛡️ Rate Limiting]

        V --> W
        V --> X
        V --> Y
        V --> Z
    end

    subgraph "☁️ Services"
        J
        K
        L
        M
        N
        O
        P
        Q
        R
    end

    H --> V
```

</div>

## 🔐 Advanced Authentication Architecture

<div align="center">

```mermaid
graph LR
    A[👤 User] --> B{Authentication<br/>Methods}

    B --> C[📧 Email/Password]
    B --> D[🌐 Google OAuth]
    B --> E[📱 API Keys]

    C --> F[NextAuth.js]
    D --> F
    E --> G[API Key<br/>Validation]

    F --> H[JWT Token<br/>Generation]
    G --> I[Permission<br/>Checking]

    H --> J[🛡️ Security<br/>Middleware]
    I --> J

    J --> K[RBAC<br/>System]
    K --> L[Database<br/>Integration]

    L --> M[(Users Table)]
    L --> N[(API Keys Table)]
    L --> O[(OAuth Sessions)]
    L --> P[(Security Events)]
    L --> Q[(Rate Limits)]
    L --> R[(User Security)]

    subgraph "🔐 Authentication Flow"
        F
        G
        H
        I
        J
        K
    end

    subgraph "🗄️ Database Schema"
        M
        N
        O
        P
        Q
        R
    end

    style A fill:#4F46E5,stroke:#000,color:white
    style B fill:#7C3AED,stroke:#000,color:white
    style C fill:#0EA5E9,stroke:#000,color:white
    style D fill:#3B82F6,stroke:#000,color:white
    style E fill:#8B5CF6,stroke:#000,color:white
    style F fill:#EC4899,stroke:#000,color:white
    style G fill:#F43F5E,stroke:#000,color:white
    style H fill:#F59E0B,stroke:#000,color:white
    style I fill:#10B981,stroke:#000,color:white
    style J fill:#EF4444,stroke:#000,color:white
    style K fill:#8B5CF6,stroke:#000,color:white
    style L fill:#6366F1,stroke:#000,color:white
    style M fill:#A78BFA,stroke:#000,color:white
    style N fill:#A78BFA,stroke:#000,color:white
    style O fill:#A78BFA,stroke:#000,color:white
    style P fill:#A78BFA,stroke:#000,color:white
    style Q fill:#A78BFA,stroke:#000,color:white
    style R fill:#A78BFA,stroke:#000,color:white
```

</div>

## 🗄️ Enhanced Database Schema

<div align="center">

```mermaid
erDiagram
    USERS ||--o{ SRS_CARDS : has
    USERS ||--o{ USER_PERFORMANCE : tracks
    USERS ||--o{ USER_LESSON_PROGRESS : progresses
    USERS ||--o{ AI_CONTENT_INTERACTIONS : interacts
    USERS ||--o{ BOOK_READING_PROGRESS : reads
    USERS ||--o{ USER_EXERCISE_ATTEMPTS : attempts
    USERS ||--o{ GROUP_MEMBERSHIPS : joins
    USERS ||--o{ USER_ACHIEVEMENTS : earns
    USERS ||--o{ CONVERSATIONS : has
    USERS ||--o{ STUDY_SESSIONS : logs
    USERS ||--o{ API_KEYS : owns
    USERS ||--o{ OAUTH_SESSIONS : linked
    USERS ||--|| USER_SECURITY : secured

    CHARACTERS ||--o{ SRS_CARDS : "content"
    WORDS ||--o{ SRS_CARDS : "content"
    GRAMMAR_POINTS ||--o{ SRS_CARDS : "content"

    CHARACTERS ||--o{ USER_PERFORMANCE : tracked
    WORDS ||--o{ USER_PERFORMANCE : tracked
    GRAMMAR_POINTS ||--o{ USER_PERFORMANCE : tracked

    LESSON_MODULES ||--o{ LESSON_ITEMS : contains
    LESSON_MODULES ||--o{ USER_LESSON_PROGRESS : tracks

    LESSON_ITEMS ||--|| CHARACTERS : references
    LESSON_ITEMS ||--|| WORDS : references
    LESSON_ITEMS ||--|| GRAMMAR_POINTS : references

    AI_GENERATED_CONTENT ||--o{ AI_CONTENT_INTERACTIONS : tracks

    BOOKS ||--o{ BOOK_READING_PROGRESS : tracks

    EXERCISE_TYPES ||--o{ EXERCISES : defines
    EXERCISES ||--o{ USER_EXERCISE_ATTEMPTS : records

    STUDY_GROUPS ||--o{ GROUP_MEMBERSHIPS : has
    STUDY_GROUPS ||--o{ FORUM_POSTS : contains

    FORUM_POSTS ||--o{ FORUM_POSTS : replies

    CONVERSATIONS ||--o{ MESSAGES : contains

    ACHIEVEMENTS ||--o{ USER_ACHIEVEMENTS : unlocks

    SECURITY_EVENTS ||--o{ USERS : logs
    RATE_LIMITS ||--o{ USERS : tracks

    USERS {
        UUID id PK
        TEXT email
        TEXT username
        TEXT full_name
        TEXT role
        INTEGER jlpt_level
        TIMESTAMP created_at
    }

    CHARACTERS {
        SERIAL id PK
        TEXT character
        TEXT type
        TEXT[] meaning
        INTEGER jlpt_level
        INTEGER frequency_rank
    }

    WORDS {
        SERIAL id PK
        TEXT word
        TEXT reading
        JSONB meanings
        INTEGER jlpt_level
        TEXT[] part_of_speech
    }

    GRAMMAR_POINTS {
        SERIAL id PK
        TEXT title
        TEXT structure
        TEXT meaning
        INTEGER jlpt_level
    }

    API_KEYS {
        UUID id PK
        UUID user_id FK
        TEXT name
        TEXT key_prefix
        TEXT hashed_key
        TEXT[] permissions
        TIMESTAMP expires_at
        TIMESTAMP last_used_at
        BOOLEAN is_active
    }

    OAUTH_SESSIONS {
        UUID id PK
        UUID user_id FK
        TEXT provider
        TEXT provider_user_id
        TEXT access_token
        TEXT refresh_token
        TIMESTAMP expires_at
    }

    USER_SECURITY {
        UUID user_id PK
        INTEGER failed_login_attempts
        BOOLEAN is_locked
        TEXT lock_reason
        TIMESTAMP lock_expires_at
        TIMESTAMP last_failed_login_at
        TEXT last_failed_login_ip
    }
```

</div>

## 🤖 AI Integration Flow

<div align="center">

```mermaid
flowchart LR
    A[👤 User Input] --> B{Content Type}

    B -->|💬 Conversation| C[🗣️ Conversation Partner]
    B -->|📚 Lesson Request| D[📖 Content Generator]
    B -->|🎤 Pronunciation| E[👂 Pronunciation Analyzer]
    B -->|✍️ Handwriting| F[👁️ Handwriting Recognizer]

    C --> G[🧠 GPT-4 Turbo]
    D --> G
    E --> H[🎤 Google Speech-to-Text]
    F --> I[👁️ Azure Cognitive Services]

    G --> J{📊 Response Quality}
    H --> J
    I --> J

    J -->|✅ High Quality| K[💾 Cache Result]
    J -->|🔧 Needs Improvement| L[🔄 Fallback Services]

    K --> M[📢 User Feedback]
    L --> M

    M --> N[🔊 ElevenLabs TTS]
    M --> O[💾 Store Interaction]

    N --> P[🔊 Audio Response]
    O --> Q[📈 Update Analytics]

    subgraph "🤖 AI Services"
        G
        H
        I
        N
    end

    subgraph "⚙️ Processing"
        J
        K
        L
    end

    subgraph "📤 Output"
        M
        P
        Q
    end

    style A fill:#4F46E5,stroke:#000,color:white
    style B fill:#7C3AED,stroke:#000,color:white
    style C fill:#0EA5E9,stroke:#000,color:white
    style D fill:#3B82F6,stroke:#000,color:white
    style E fill:#8B5CF6,stroke:#000,color:white
    style F fill:#F43F5E,stroke:#000,color:white
    style G fill:#F59E0B,stroke:#000,color:white
    style H fill:#10B981,stroke:#000,color:white
    style I fill:#EF4444,stroke:#000,color:white
    style J fill:#8B5CF6,stroke:#000,color:white
    style K fill:#A78BFA,stroke:#000,color:white
    style L fill:#6366F1,stroke:#000,color:white
    style M fill:#EC4899,stroke:#000,color:white
    style N fill:#F59E0B,stroke:#000,color:white
    style O fill:#10B981,stroke:#000,color:white
    style P fill:#0EA5E9,stroke:#000,color:white
    style Q fill:#3B82F6,stroke:#000,color:white
```

</div>

## 🔐 Authentication & Security Features

### 🗝️ API Key Management
```mermaid
sequenceDiagram
    participant U as 👤 User
    participant F as 🌐 Frontend
    participant A as 🔐 Auth API
    participant D as 🗄️ Database

    U->>F: Request API Key
    F->>A: POST /api/auth/keys
    A->>A: Generate Secure Key
    A->>D: Store Hashed Key
    D-->>A: Success
    A-->>F: Return API Key
    F-->>U: Display Key (⚠️ One Time Only!)

    U->>F: Use API Key
    F->>A: Request with Bearer Token
    A->>D: Lookup by Prefix
    D-->>A: Key Data
    A->>A: Validate Permissions
    A->>D: Update Last Used
    D-->>A: Success
    A-->>F: Authorized Response
```

### 🛡️ Security Layers
```mermaid
graph TB
    A[📥 Incoming Request] --> B[🔐 Rate Limiting]
    B --> C[🛡️ API Key Validation]
    C --> D[🎭 Role-Based Access]
    D --> E[🔑 Permission Check]
    E --> F[✅ Authorized Access]

    B -->|Blocked| G[🚫 429 Too Many Requests]
    C -->|Invalid| H[🚫 401 Unauthorized]
    D -->|Insufficient| I[🚫 403 Forbidden]
    E -->|Denied| J[🚫 403 Forbidden]

    style A fill:#4F46E5,stroke:#000,color:white
    style B fill:#F59E0B,stroke:#000,color:white
    style C fill:#8B5CF6,stroke:#000,color:white
    style D fill:#7C3AED,stroke:#000,color:white
    style E fill:#6366F1,stroke:#000,color:white
    style F fill:#10B981,stroke:#000,color:white
    style G fill:#EF4444,stroke:#000,color:white
    style H fill:#EF4444,stroke:#000,color:white
    style I fill:#EF4444,stroke:#000,color:white
    style J fill:#EF4444,stroke:#000,color:white
```

## 🚀 Getting Started

### Prerequisites
- Node.js 18+
- npm or yarn
- Supabase account
- OpenAI API key

### Supabase Configuration

The application requires the following Supabase environment variables:

```bash
# Supabase Connection
SUPABASE_URL="https://zsehtkeycyapjevgbzrd.supabase.co"
NEXT_PUBLIC_SUPABASE_URL="https://zsehtkeycyapjevgbzrd.supabase.co"
POSTGRES_HOST="db.zsehtkeycyapjevgbzrd.supabase.co"

# Authentication Keys
NEXT_PUBLIC_SUPABASE_ANON_KEY="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InpzZWh0a2V5Y3lhcGpldmdienJkIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTg3MDUzNTQsImV4cCI6MjA3NDI4MTM1NH0.tYvimaOGjq4NNjhF3-_DU90JTK8yVmX-JewnN5yDr2A"
SUPABASE_SERVICE_ROLE_KEY="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InpzZWh0a2V5Y3lhcGpldmdienJkIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc1ODcwNTM1NCwiZXhwIjoyMDc0MjgxMzU0fQ.efBSMg7PKP6V0eUzZ5OtOGQzsLtv5HCgKgMPgRgg4wo"
SUPABASE_JWT_SECRET="FVr2Lsopo57zHpaLc+tK0VmyYfaAvfVThR4zs7QfUq0dcoi3Rp7jCsjQogzv/wdAr+Imxw+9d9hx4q+tWPkq8g=="

# Database Connection URLs
POSTGRES_URL="postgres://postgres.zsehtkeycyapjevgbzrd:Woc2vDYW6Gae3aOK@aws-1-us-east-1.pooler.supabase.com:6543/postgres?sslmode=require&supa=base-pooler.x"
POSTGRES_PRISMA_URL="postgres://postgres.zsehtkeycyapjevgbzrd:Woc2vDYW6Gae3aOK@aws-1-us-east-1.pooler.supabase.com:6543/postgres?sslmode=require&pgbouncer=true"
POSTGRES_URL_NON_POOLING="postgres://postgres.zsehtkeycyapjevgbzrd:Woc2vDYW6Gae3aOK@aws-1-us-east-1.pooler.supabase.com:5432/postgres?sslmode=require"

# Database Credentials
POSTGRES_USER="postgres"
POSTGRES_PASSWORD="Woc2vDYW6Gae3aOK"
POSTGRES_DATABASE="postgres"
```

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/your-username/japanese-learning-platform.git
   cd japanese-learning-platform
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Set up environment variables:
   ```bash
   cp .env.example .env.local
   # Edit .env.local with your configuration
   ```

4. Run database migrations:
   ```bash
   npx supabase migration up
   ```

5. Start the development server:
   ```bash
   npm run dev
   ```

6. Open [http://localhost:3000](http://localhost:3000) in your browser.

## 🛠️ Technologies

### Frontend
- **[Next.js 15+](https://nextjs.org/)** with App Router and Server Components
- **[TypeScript](https://www.typescriptlang.org/)** for type safety
- **[Tailwind CSS](https://tailwindcss.com/)** for styling
- **[shadcn/ui](https://ui.shadcn.com/)** for accessible UI components
- **[Framer Motion](https://www.framer.com/motion/)** for animations
- **[Zustand](https://github.com/pmndrs/zustand)** for state management

### Backend
- **[Supabase](https://supabase.io/)** (PostgreSQL) with Row Level Security
- **[NextAuth.js](https://next-auth.js.org/)** for authentication
- **[Edge Functions](https://vercel.com/docs/concepts/functions/edge-functions)** for serverless computing

### AI Services
- **[OpenAI GPT-4](https://openai.com/)** for content generation and conversation
- **[Google Cloud Speech-to-Text](https://cloud.google.com/speech-to-text)** for pronunciation analysis
- **[Azure Cognitive Services](https://azure.microsoft.com/en-us/services/cognitive-services/)** for handwriting recognition
- **[ElevenLabs](https://elevenlabs.io/)** for text-to-speech synthesis

## 📁 Project Structure

```
src/
├── app/                          # App Router structure
│   ├── (auth)/                   # Authentication flows
│   ├── dashboard/                # User dashboard and analytics
│   ├── lessons/                  # Lesson modules and progression
│   ├── chat/                     # AI conversation partner
│   ├── practice/                 # Interactive drills and games
│   ├── books/                    # AI-generated interactive books
│   ├── community/                # Social features and forums
│   └── api/                      # Internal API endpoints
├── components/                   # Shared UI components
│   ├── ui/                       # Atomic design system
│   ├── layout/                   # Page layouts and wrappers
│   ├── lessons/                  # Lesson-specific components
│   ├── chat/                     # Chat interface elements
│   ├── games/                    # Mini-game components
│   └── books/                    # Book reader and generator UI
├── lib/                          # Business logic and utilities
│   ├── ai/                       # AI service integrations
│   ├── database/                 # Database ORM and queries
│   ├── auth/                     # 🔐 Enhanced authentication system
│   │   ├── apiKeys.ts           # API key management
│   │   ├── oauthSessions.ts     # OAuth session handling
│   │   ├── roles.ts             # RBAC system
│   │   ├── security.ts          # Security features
│   │   └── index.ts             # Main auth functions
│   ├── analytics/                # Learning analytics engine
│   └── utils/                    # General-purpose functions
├── hooks/                        # Custom React hooks
├── stores/                       # Global state management (Zustand)
├── types/                        # TypeScript definitions
└── styles/                       # Global CSS and theme files
```

## 📈 Progressive Learning Engine

Our platform implements a sophisticated learning system combining:

- **Modified SM-2 Algorithm**: Enhanced spaced repetition with adaptive intervals
- **Machine Learning Models**: Predictive analytics for retention and difficulty
- **Adaptive Content Selection**: Personalized item selection based on performance
- **Dynamic Difficulty Adjustment**: Real-time content difficulty calibration
- **Comprehensive Analytics**: Detailed progress tracking and mastery predictions

## 🔐 Security & Privacy

We prioritize your data security and privacy:
- End-to-end encryption for sensitive communications
- Row Level Security (RLS) for database access control
- GDPR and CCPA compliant data handling
- Regular security audits and penetration testing
- Anonymous analytics for platform improvement
- 🔐 **Enhanced Security Features**:
  - 🔑 API Key Management with Permissions
  - 🔒 Encrypted OAuth Session Storage
  - 🛡️ Rate Limiting & Account Lockout
  - 🕵️ Security Event Logging
  - 🎭 Role-Based Access Control

## 🤝 Contributing

We welcome contributions from the community! Please see our [Contributing Guide](CONTRIBUTING.md) for details on how to get started.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a pull request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- Thanks to the [Next.js team](https://nextjs.org/) for the amazing framework
- Gratitude to [Supabase](https://supabase.io/) for the excellent backend services
- Appreciation for [OpenAI](https://openai.com/) for powering our AI features
- Recognition to the Japanese language education community for inspiration

---

<div align="center">
  <strong>Built with ❤️ for Japanese language learners worldwide</strong>
  <br/>
  <br/>
  <img src="https://img.shields.io/badge/Made%20with-Next.js-black?style=flat&logo=next.js" alt="Made with Next.js"/>
  <img src="https://img.shields.io/badge/Powered%20by-AI-blue?style=flat&logo=openai" alt="Powered by AI"/>
  <img src="https://img.shields.io/badge/Deployed%20on-Vercel-black?style=flat&logo=vercel" alt="Deployed on Vercel"/>
  <img src="https://img.shields.io/badge/Secured%20by-Enhanced%20Auth-purple?style=flat&logo=shield" alt="Secured by Enhanced Auth"/>
</div>