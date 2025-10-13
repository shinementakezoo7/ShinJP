# Enhanced Authentication System Documentation

## Overview

This document describes the enhanced authentication system implemented for the application, which extends the basic Supabase authentication with advanced security features, API key management, OAuth session handling, and role-based access control inspired by the Open WebUI reference implementation.

## Features Implemented

### 1. API Key Management System

#### Key Features:
- Secure API key generation with prefix identification
- Cryptographic hashing for secure storage
- Permission-based access control
- Expiration dates and last-used tracking
- Activation/deactivation controls

#### API Endpoints:
- `POST /api/auth/keys` - Create new API key
- `GET /api/auth/keys` - List user's API keys
- `PATCH /api/auth/keys` - Revoke or delete API key

#### Security Measures:
- API keys are prefixed with `sk-` for easy identification
- Full keys are hashed using SHA-256 before storage
- Only key prefixes are stored in plain text for identification
- Rate limiting on key creation and validation endpoints

### 2. Advanced OAuth Session Management

#### Key Features:
- Secure token encryption using AES-GCM
- Automatic token refresh handling
- Provider-specific session tracking
- Expiration management

#### Supported Providers:
- Google OAuth
- Future extensibility for GitHub, Microsoft, etc.

#### Security Measures:
- OAuth tokens are encrypted before database storage
- Separate encryption key for token protection
- Automatic cleanup of expired sessions
- Session binding to specific users and providers

### 3. Role-Based Access Control (RBAC)

#### Roles Defined:
- `admin` - Full system access
- `moderator` - Content moderation capabilities
- `user` - Standard user privileges
- `pending` - Limited access for new users

#### Permissions System:
- Fine-grained permissions for different resources
- Hierarchical role structure
- Feature-based access control
- Endpoint-level permission checking

#### Key Permissions:
- `read:content` - View educational content
- `write:content` - Create/edit personal content
- `delete:content` - Delete personal content
- `manage:users` - User administration (admin only)
- `manage:settings` - System settings (admin only)
- `access:admin_panel` - Access administrative interface
- `create:api_keys` - Generate personal API keys
- `manage:api_keys` - Manage personal API keys
- `access:analytics` - View analytics dashboards
- `moderate:content` - Moderate community content

### 4. Enhanced Security Features

#### Password Security:
- Strong password requirements (8+ characters, mixed case, numbers, symbols)
- Length validation (72-character bcrypt limit)
- Secure hashing implementation

#### Rate Limiting:
- Configurable request limits per endpoint
- Time-window based rate limiting
- Identifier-based tracking (IP, user, API key)

#### Account Security:
- Failed login attempt tracking
- Automatic account locking after threshold
- Configurable lock duration
- Security event logging

#### Session Management:
- JWT token generation with configurable expiration
- Secure token handling
- Last active timestamp tracking
- Session cleanup procedures

#### Input Validation:
- Email format validation
- XSS prevention through input sanitization
- Parameter validation for all endpoints

## Database Schema

### New Tables Created:

#### `api_keys`
Stores encrypted API keys with associated metadata:
- `id` - Unique identifier
- `user_id` - Owner reference
- `name` - Descriptive name
- `key_prefix` - Public key prefix for identification
- `hashed_key` - Securely hashed full key
- `permissions` - Array of granted permissions
- `expires_at` - Expiration timestamp
- `last_used_at` - Last usage timestamp
- `is_active` - Active status flag
- `created_at`, `updated_at` - Timestamps

#### `oauth_sessions`
Manages OAuth provider sessions with encrypted tokens:
- `id` - Unique identifier
- `user_id` - User reference
- `provider` - OAuth provider name
- `provider_user_id` - Provider's user identifier
- `access_token` - Encrypted access token
- `refresh_token` - Encrypted refresh token
- `id_token` - Encrypted ID token
- `expires_at` - Token expiration timestamp
- `scope` - Granted OAuth scopes
- `created_at`, `updated_at` - Timestamps

#### `security_events`
Logs security-relevant events:
- `id` - Unique identifier
- `user_id` - Associated user (nullable)
- `event_type` - Type of security event
- `ip_address` - Source IP address
- `user_agent` - Client user agent
- `details` - Additional event data
- `created_at` - Event timestamp

#### `rate_limits`
Tracks request rate limiting:
- `id` - Unique identifier
- `identifier` - Rate limit subject (IP, user, API key)
- `endpoint` - Targeted endpoint
- `count` - Request count
- `reset_time` - Window reset timestamp
- `created_at` - Record creation timestamp

#### `user_security`
Enhanced user security settings:
- `user_id` - User reference (primary key)
- `failed_login_attempts` - Count of failed logins
- `is_locked` - Account lock status
- `lock_reason` - Reason for account lock
- `lock_expires_at` - Lock expiration timestamp
- `last_failed_login_at` - Last failed login timestamp
- `last_failed_login_ip` - Last failed login IP
- `password_changed_at` - Last password change timestamp
- `two_factor_enabled` - 2FA status (future feature)
- `two_factor_secret` - 2FA secret (future feature)
- `two_factor_backup_codes` - Backup codes (future feature)
- `created_at`, `updated_at` - Timestamps

## Implementation Details

### Authentication Flow

1. **User Login:**
   - Credentials validated through enhanced authentication function
   - Failed attempts tracked in `user_security` table
   - Account locked after threshold reached
   - Successful login generates JWT token
   - Last active timestamp updated

2. **API Key Authentication:**
   - Key prefix extracted from Authorization header
   - Full key hashed for database lookup
   - Permissions and expiration checked
   - Last used timestamp updated
   - User context injected into request

3. **OAuth Flow:**
   - Provider authentication through NextAuth.js
   - Session tokens encrypted before storage
   - User profile synchronized with local database
   - Session linked to user account

### Security Measures

1. **Data Encryption:**
   - OAuth tokens encrypted with AES-GCM
   - API keys hashed with SHA-256
   - Environment-based encryption keys
   - Secure key storage practices

2. **Access Control:**
   - Role-based permission checking
   - Endpoint-specific authorization
   - Feature access validation
   - Hierarchical role inheritance

3. **Monitoring:**
   - Security event logging
   - Rate limit tracking
   - Failed login monitoring
   - Account lock notifications

## Configuration

### Environment Variables Required:

```bash
# Core Authentication
NEXTAUTH_SECRET=your_nextauth_secret_here
NEXTAUTH_URL=http://localhost:3000

# OAuth Providers
GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret

# Security Settings
OAUTH_TOKEN_ENCRYPTION_SECRET=your_oauth_encryption_secret_32_chars
MAX_FAILED_LOGIN_ATTEMPTS=5
ACCOUNT_LOCK_DURATION=3600  # 1 hour in seconds

# Rate Limiting
DEFAULT_RATE_LIMIT_MAX_REQUESTS=100
DEFAULT_RATE_LIMIT_WINDOW_SECONDS=3600  # 1 hour
```

## API Usage Examples

### Creating an API Key:
```bash
curl -X POST /api/auth/keys \
  -H "Authorization: Bearer YOUR_SESSION_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Mobile App Key",
    "permissions": ["read:content", "write:content"],
    "expiresAt": "2024-12-31T23:59:59Z"
  }'
```

### Using an API Key:
```bash
curl -H "Authorization: Bearer sk-abc123def456..." \
  /api/content/lessons
```

### Checking User Permissions:
```typescript
import { hasPermission } from '@/lib/auth/roles'

// Check if user can manage API keys
if (hasPermission(userRole, 'manage:api_keys')) {
  // Show API key management interface
}
```

## Future Enhancements

### Planned Features:
1. Two-Factor Authentication (2FA)
2. Session Management Interface
3. Advanced Audit Logging
4. IP Whitelisting
5. Password Complexity Policies
6. Account Recovery System
7. Device Trust Management
8. Single Sign-Out (SSO) Support

## Best Practices

### For Developers:
1. Always validate permissions before sensitive operations
2. Use API keys for server-to-server communication
3. Implement proper error handling for authentication failures
4. Log security-relevant events
5. Regularly rotate encryption secrets
6. Monitor rate limit exceptions
7. Keep dependencies updated

### For Administrators:
1. Regularly review API key usage
2. Monitor security event logs
3. Configure appropriate rate limits
4. Set up account lock policies
5. Maintain backup encryption keys
6. Conduct periodic security audits
7. Implement proper secret management

## Troubleshooting

### Common Issues:

1. **API Key Not Working:**
   - Verify key prefix matches database record
   - Check expiration date
   - Confirm key is active
   - Validate permissions for requested endpoint

2. **OAuth Login Failures:**
   - Check provider configuration
   - Verify encryption secret availability
   - Review session expiration settings
   - Examine security event logs

3. **Account Lockouts:**
   - Check failed login attempt count
   - Verify lock expiration time
   - Review security event logs
   - Contact administrator for manual unlock if needed

## Conclusion

This enhanced authentication system provides a robust, secure foundation for user authentication and authorization with enterprise-grade security features while maintaining ease of use for developers and end users. The implementation follows security best practices and provides extensive customization options for different deployment scenarios.