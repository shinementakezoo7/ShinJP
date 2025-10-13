# Authentication Library

This directory contains the enhanced authentication system for the application, featuring advanced security measures, API key management, OAuth session handling, and role-based access control.

## Files Overview

### Core Modules

- **`index.ts`** - Main authentication functions and user management
- **`nextauth.ts`** - NextAuth.js configuration with enhanced features
- **`apiKeys.ts`** - API key generation, validation, and management
- **`oauthSessions.ts`** - OAuth session creation, encryption, and token management
- **`roles.ts`** - Role-based access control system with permissions
- **`security.ts`** - Security features including rate limiting, password validation, and event logging

### API Routes

- **`/app/api/auth/keys/route.ts`** - REST API for API key management
- **`/app/api/auth/[...nextauth]/route.ts`** - NextAuth.js handler

### Middleware

- **`/lib/middleware/apiKeyAuth.ts`** - API key authentication middleware

### Database Migrations

- **`/database/migrations/008_create_auth_enhancement_tables.sql`** - Database schema for enhanced auth features

## Key Features

### 1. API Key Management
- Secure key generation with prefix identification
- Permission-based access control
- Expiration and usage tracking
- REST API for key management

### 2. OAuth Session Management
- Encrypted token storage
- Automatic session refresh
- Provider-specific session handling

### 3. Role-Based Access Control
- Hierarchical role system (admin, moderator, user, pending)
- Fine-grained permission model
- Feature and endpoint access control

### 4. Enhanced Security
- Rate limiting implementation
- Account lockout mechanisms
- Password strength validation
- Security event logging
- Input sanitization

## Usage Examples

### User Authentication
```typescript
import { authenticateUser, registerUser } from '@/lib/auth'

// Authenticate user
const result = await authenticateUser(email, password)

// Register new user
const newUser = await registerUser(email, password, username, fullName)
```

### API Key Management
```typescript
import { createApiKey, validateApiKey } from '@/lib/auth'

// Create API key
const key = await createApiKey(userId, 'Mobile App', ['read:content'])

// Validate API key
const user = await validateApiKey('sk-abc123...')
```

### Permission Checking
```typescript
import { hasPermission, canAccessFeature } from '@/lib/auth/roles'

// Check specific permission
if (hasPermission(userRole, 'manage:api_keys')) {
  // Allow API key management
}

// Check feature access
if (canAccessFeature(userRole, 'admin_panel')) {
  // Show admin panel
}
```

## Security Measures

1. **Data Encryption**
   - OAuth tokens encrypted with AES-GCM
   - API keys hashed with SHA-256
   - Secure key derivation

2. **Access Control**
   - Role-based permissions
   - Endpoint authorization
   - Feature gating

3. **Monitoring**
   - Security event logging
   - Rate limit tracking
   - Account security monitoring

## Configuration

Ensure the following environment variables are set:

```bash
NEXTAUTH_SECRET=your_nextauth_secret_here_replace_with_strong_random_string
NEXTAUTH_URL=http://localhost:3000
OAUTH_TOKEN_ENCRYPTION_SECRET=your_oauth_encryption_secret_32_chars
MAX_FAILED_LOGIN_ATTEMPTS=5
ACCOUNT_LOCK_DURATION=3600

# For Google OAuth (optional)
GOOGLE_CLIENT_ID=your_google_client_id_here
GOOGLE_CLIENT_SECRET=your_google_client_secret_here
```

Generate a strong secret for NextAuth:
```bash
openssl rand -base64 32
```

## Database Requirements

Run migration `008_create_auth_enhancement_tables.sql` to create the required tables:

- `api_keys` - API key storage
- `oauth_sessions` - OAuth session management
- `security_events` - Security event logging
- `rate_limits` - Rate limiting tracking
- `user_security` - Enhanced user security settings

## Integration Points

### Next.js API Routes
Use the API key middleware for protecting routes:
```typescript
import { apiKeyAuth } from '@/lib/middleware/apiKeyAuth'

export async function GET(req: Request) {
  const authenticatedReq = await apiKeyAuth(req, new NextFetchEvent(''))
  if (authenticatedReq instanceof Response) {
    return authenticatedReq // Error response
  }

  // Process authenticated request
}
```

### Frontend Integration
Use NextAuth.js with the enhanced configuration:
```typescript
import { authOptions } from '@/lib/auth/nextauth'
import { getServerSession } from 'next-auth'

export default async function MyComponent() {
  const session = await getServerSession(authOptions)
  // Session now includes username and role
  // session.user.username - User's username
  // session.user.role - User's role (user, admin, etc.)
}
```

For client-side usage:
```typescript
import { useSession } from 'next-auth/react'

export default function MyClientComponent() {
  const { data: session, status } = useSession()

  if (status === 'authenticated') {
    // session.user.username - User's username
    // session.user.role - User's role
  }
}
```

## Extensibility

The system is designed to be easily extended:

1. **New Authentication Providers** - Add to NextAuth configuration
2. **Additional Permissions** - Extend the Permission type and ROLE_PERMISSIONS mapping
3. **Custom Security Events** - Use the logSecurityEvent function
4. **Enhanced Rate Limiting** - Modify checkRateLimit parameters
5. **Additional OAuth Providers** - Extend OAuth session management

## Documentation

See `/docs/authentication-enhancements.md` for complete documentation.