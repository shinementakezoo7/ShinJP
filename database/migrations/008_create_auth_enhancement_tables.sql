-- Create API Keys Table
CREATE TABLE api_keys (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  key_prefix TEXT NOT NULL,
  hashed_key TEXT NOT NULL,
  permissions TEXT[], -- Array of permissions granted to this key
  expires_at TIMESTAMP WITH TIME ZONE,
  last_used_at TIMESTAMP WITH TIME ZONE,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for API keys
CREATE INDEX idx_api_keys_user_id ON api_keys(user_id);
CREATE INDEX idx_api_keys_key_prefix ON api_keys(key_prefix);
CREATE INDEX idx_api_keys_expires_at ON api_keys(expires_at);
CREATE INDEX idx_api_keys_is_active ON api_keys(is_active);

-- RLS for api_keys table
ALTER TABLE api_keys ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can view their own API keys" ON api_keys FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert their own API keys" ON api_keys FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update their own API keys" ON api_keys FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete their own API keys" ON api_keys FOR DELETE USING (auth.uid() = user_id);

-- Create OAuth Sessions Table
CREATE TABLE oauth_sessions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  provider TEXT NOT NULL, -- google, github, etc.
  provider_user_id TEXT NOT NULL, -- User ID from the OAuth provider
  access_token TEXT NOT NULL, -- Encrypted access token
  refresh_token TEXT, -- Encrypted refresh token
  id_token TEXT, -- Encrypted ID token
  expires_at TIMESTAMP WITH TIME ZONE NOT NULL,
  scope TEXT, -- Scopes granted
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for OAuth sessions
CREATE INDEX idx_oauth_sessions_user_id ON oauth_sessions(user_id);
CREATE INDEX idx_oauth_sessions_provider ON oauth_sessions(provider);
CREATE INDEX idx_oauth_sessions_provider_user_id ON oauth_sessions(provider_user_id);
CREATE INDEX idx_oauth_sessions_expires_at ON oauth_sessions(expires_at);

-- RLS for oauth_sessions table
ALTER TABLE oauth_sessions ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can view their own OAuth sessions" ON oauth_sessions FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert their own OAuth sessions" ON oauth_sessions FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update their own OAuth sessions" ON oauth_sessions FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete their own OAuth sessions" ON oauth_sessions FOR DELETE USING (auth.uid() = user_id);

-- Create Security Events Table
CREATE TABLE security_events (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  event_type TEXT NOT NULL, -- login, logout, failed_login, password_change, etc.
  ip_address TEXT,
  user_agent TEXT,
  details JSONB, -- Additional event details
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for security events
CREATE INDEX idx_security_events_user_id ON security_events(user_id);
CREATE INDEX idx_security_events_event_type ON security_events(event_type);
CREATE INDEX idx_security_events_created_at ON security_events(created_at);
CREATE INDEX idx_security_events_ip_address ON security_events(ip_address);

-- RLS for security_events table
ALTER TABLE security_events ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Admins can view security events" ON security_events FOR SELECT USING (
  EXISTS (
    SELECT 1 FROM users WHERE id = auth.uid() AND role = 'admin'
  )
);

-- Create Rate Limits Table
CREATE TABLE rate_limits (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  identifier TEXT NOT NULL, -- IP address, user ID, or API key
  endpoint TEXT NOT NULL, -- API endpoint
  count INTEGER DEFAULT 1,
  reset_time TIMESTAMP WITH TIME ZONE NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for rate limits
CREATE INDEX idx_rate_limits_identifier ON rate_limits(identifier);
CREATE INDEX idx_rate_limits_endpoint ON rate_limits(endpoint);
CREATE INDEX idx_rate_limits_reset_time ON rate_limits(reset_time);

-- RLS for rate_limits table
ALTER TABLE rate_limits ENABLE ROW LEVEL SECURITY;
CREATE POLICY "System can manage rate limits" ON rate_limits FOR ALL USING (
  EXISTS (
    SELECT 1 FROM users WHERE id = auth.uid() AND role = 'admin'
  )
);

-- Create User Security Table
CREATE TABLE user_security (
  user_id UUID PRIMARY KEY REFERENCES users(id) ON DELETE CASCADE,
  failed_login_attempts INTEGER DEFAULT 0,
  is_locked BOOLEAN DEFAULT false,
  lock_reason TEXT,
  lock_expires_at TIMESTAMP WITH TIME ZONE,
  last_failed_login_at TIMESTAMP WITH TIME ZONE,
  last_failed_login_ip TEXT,
  password_changed_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  two_factor_enabled BOOLEAN DEFAULT false,
  two_factor_secret TEXT,
  two_factor_backup_codes TEXT[],
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- RLS for user_security table
ALTER TABLE user_security ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can view their own security settings" ON user_security FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can update their own security settings" ON user_security FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Admins can view user security settings" ON user_security FOR SELECT USING (
  EXISTS (
    SELECT 1 FROM users WHERE id = auth.uid() AND role = 'admin'
  )
);

-- Add role column to users table if it doesn't exist
ALTER TABLE users ADD COLUMN IF NOT EXISTS role TEXT DEFAULT 'user' CHECK (role IN ('admin', 'user', 'pending', 'moderator'));

-- Create indexes for users role
CREATE INDEX IF NOT EXISTS idx_users_role ON users(role);

-- Update existing users to have appropriate roles
-- First user becomes admin, others remain as user
UPDATE users
SET role = 'admin'
WHERE id = (SELECT id FROM users ORDER BY created_at ASC LIMIT 1)
AND role = 'user';

-- Create updated_at trigger function
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create triggers for updated_at
CREATE TRIGGER update_api_keys_updated_at BEFORE UPDATE ON api_keys
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_oauth_sessions_updated_at BEFORE UPDATE ON oauth_sessions
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_user_security_updated_at BEFORE UPDATE ON user_security
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON users
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();