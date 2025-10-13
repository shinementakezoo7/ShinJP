-- Chat History Tables
-- Enables conversation persistence and 122K context window support

-- Conversations table (chat sessions)
CREATE TABLE IF NOT EXISTS conversations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id VARCHAR(255),
  title VARCHAR(500) NOT NULL DEFAULT 'New Chat',
  model VARCHAR(100) DEFAULT 'stockmark/stockmark-2-100b-instruct',
  context_window INTEGER DEFAULT 122000,
  total_tokens INTEGER DEFAULT 0,
  message_count INTEGER DEFAULT 0,
  last_message_at TIMESTAMP DEFAULT NOW(),
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Messages table (individual chat messages)
CREATE TABLE IF NOT EXISTS messages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  conversation_id UUID REFERENCES conversations(id) ON DELETE CASCADE,
  role VARCHAR(20) NOT NULL CHECK (role IN ('user', 'assistant', 'system')),
  content TEXT NOT NULL,
  tokens INTEGER DEFAULT 0,
  metadata JSONB DEFAULT '{}',
  created_at TIMESTAMP DEFAULT NOW()
);

-- Indexes for performance
CREATE INDEX IF NOT EXISTS idx_conversations_user_id ON conversations(user_id);
CREATE INDEX IF NOT EXISTS idx_conversations_updated_at ON conversations(updated_at DESC);
CREATE INDEX IF NOT EXISTS idx_messages_conversation_id ON messages(conversation_id);
CREATE INDEX IF NOT EXISTS idx_messages_created_at ON messages(created_at);

-- Function to update conversation timestamp
CREATE OR REPLACE FUNCTION update_conversation_timestamp()
RETURNS TRIGGER AS $$
BEGIN
  UPDATE conversations 
  SET 
    last_message_at = NOW(),
    updated_at = NOW(),
    message_count = message_count + 1
  WHERE id = NEW.conversation_id;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger to auto-update conversation on new message
DROP TRIGGER IF EXISTS trigger_update_conversation ON messages;
CREATE TRIGGER trigger_update_conversation
  AFTER INSERT ON messages
  FOR EACH ROW
  EXECUTE FUNCTION update_conversation_timestamp();

-- Function to generate chat title from first message
CREATE OR REPLACE FUNCTION generate_chat_title(conv_id UUID)
RETURNS VARCHAR AS $$
DECLARE
  first_message TEXT;
  generated_title VARCHAR(500);
BEGIN
  SELECT content INTO first_message
  FROM messages
  WHERE conversation_id = conv_id
    AND role = 'user'
  ORDER BY created_at ASC
  LIMIT 1;
  
  IF first_message IS NOT NULL THEN
    generated_title := SUBSTRING(first_message FROM 1 FOR 50);
    IF LENGTH(first_message) > 50 THEN
      generated_title := generated_title || '...';
    END IF;
    RETURN generated_title;
  ELSE
    RETURN 'New Chat';
  END IF;
END;
$$ LANGUAGE plpgsql;
