export interface User {
  id: string
  name: string
  email: string
  avatar?: string
  status: 'online' | 'away' | 'offline'
  lastSeen?: Date
  role?: 'admin' | 'moderator' | 'user'
  isTyping?: boolean
}

export interface Message {
  id: string
  content: string
  type: 'text' | 'file' | 'emoji' | 'system'
  sender: User
  roomId: string
  timestamp: Date
  editedAt?: Date
  readBy: string[]
  reactions: Record<string, string[]> // emoji -> userIds
  threadCount?: number
  parentId?: string
  file?: {
    name: string
    size: number
    type: string
    url: string
    thumbnail?: string
  }
}

export interface ChatRoom {
  id: string
  name: string
  description?: string
  type: 'direct' | 'group' | 'channel'
  participants: User[]
  createdAt: Date
  lastMessage?: Message
  unreadCount: number
  isPrivate: boolean
  avatar?: string
}

export interface TypingIndicator {
  userId: string
  roomId: string
  timestamp: Date
  isTyping: boolean
}

export interface UserPresence {
  userId: string
  status: 'online' | 'away' | 'offline'
  lastSeen: Date
  currentRoom?: string
}

export interface CreateMessageRequest {
  content: string
  type: 'text' | 'file' | 'emoji'
  roomId: string
  parentId?: string
}

export interface FileUploadRequest {
  file: File
  roomId: string
  messageId?: string
}

export interface ChatEvent {
  type: 'message' | 'typing' | 'presence' | 'reaction' | 'read'
  data: any
  timestamp: Date
}

export interface WebSocketMessage {
  event: string
  data: any
  timestamp: number
}
