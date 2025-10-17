import { Server as SocketIOServer } from 'socket.io'
import { NextApiRequest } from 'next'
import { Server as HTTPServer } from 'http'
import {
  Message,
  User,
  ChatRoom,
  TypingIndicator,
  UserPresence,
} from '../../../src/lib/websocket/types'

interface SocketWithAuth extends SocketIOClient.Socket {
  userId?: string
  currentRoom?: string
}

export const setupWebSocketServer = (server: HTTPServer) => {
  const io = new SocketIOServer(server, {
    cors: {
      origin: process.env.NEXT_PUBLIC_URL || 'http://localhost:3000',
      methods: ['GET', 'POST'],
      credentials: true,
    },
    transports: ['websocket', 'polling'],
    pingInterval: 25000,
    pingTimeout: 10000,
  })

  // User presence tracking
  const userPresence = new Map<string, UserPresence>()
  const typingUsers = new Map<string, TypingIndicator>()
  const messages: Message[] = []

  // Mock users for development
  const mockUsers: User[] = [
    {
      id: 'user1',
      name: '田中先生',
      email: 'tanaka@example.com',
      avatar: '/api/placeholder/40/40',
      status: 'online',
      role: 'admin',
    },
    {
      id: 'user2',
      name: '山田さん',
      email: 'yamada@example.com',
      avatar: '/api/placeholder/40/40',
      status: 'online',
    },
    {
      id: 'user3',
      name: '佐藤さん',
      email: 'satou@example.com',
      avatar: '/api/placeholder/40/40',
      status: 'away',
    },
    {
      id: 'user4',
      name: '鈴木さん',
      email: 'suzuki@example.com',
      avatar: '/api/placeholder/40/40',
      status: 'offline',
    },
  ]

  io.on('connection', (socket: SocketWithAuth) => {
    console.log('🔌 User connected:', socket.id)

    // Authenticate user
    socket.on('authenticate', (data: { userId: string }) => {
      if (!data.userId) {
        socket.disconnect()
        return
      }

      socket.userId = data.userId
      console.log(`✅ User authenticated: ${data.userId}`)

      // Set user presence
      const presence: UserPresence = {
        userId: data.userId,
        status: 'online',
        lastSeen: new Date(),
        currentRoom: socket.currentRoom,
      }
      userPresence.set(data.userId, presence)

      // Emit updated presence
      io.emit('user_presence_updated', presence)
      socket.emit('users_online', mockUsers)
    })

    // Join room
    socket.on('join_room', (roomId: string) => {
      if (!socket.userId) return

      socket.currentRoom = roomId
      socket.join(`room:${roomId}`)

      // Update presence
      const presence = userPresence.get(socket.userId)
      if (presence) {
        presence.currentRoom = roomId
        userPresence.set(socket.userId, presence)
        io.emit('user_presence_updated', presence)
      }

      console.log(`🏠 User ${socket.userId} joined room: ${roomId}`)

      // Create system message
      const systemMessage: Message = {
        id: `system-${Date.now()}-${socket.userId}`,
        content: 'ユーザーがチャットに参加しました',
        type: 'system',
        sender: mockUsers.find((u) => u.id === socket.userId) || mockUsers[0],
        roomId,
        timestamp: new Date(),
        readBy: [socket.userId],
        reactions: {},
      }

      messages.push(systemMessage)
      io.to(`room:${roomId}`).emit('message_received', systemMessage)
    })

    // Leave room
    socket.on('leave_room', (roomId: string) => {
      if (!socket.userId) return

      socket.leave(`room:${roomId}`)
      socket.currentRoom = undefined

      // Update presence
      const presence = userPresence.get(socket.userId)
      if (presence) {
        presence.currentRoom = undefined
        userPresence.set(socket.userId, presence)
        io.emit('user_presence_updated', presence)
      }

      console.log(`🚪 User ${socket.userId} left room: ${roomId}`)

      // Create system message
      const systemMessage: Message = {
        id: `system-${Date.now()}-${socket.userId}`,
        content: 'ユーザーがチャットから退出しました',
        type: 'system',
        sender: mockUsers.find((u) => u.id === socket.userId) || mockUsers[0],
        roomId,
        timestamp: new Date(),
        readBy: [socket.userId],
        reactions: {},
      }

      messages.push(systemMessage)
      io.to(`room:${roomId}`).emit('message_received', systemMessage)
    })

    // Handle incoming messages
    socket.on('send_message', (messageData: Partial<Message>) => {
      if (!socket.userId || !socket.currentRoom || !messageData.content?.trim()) return

      // Create message
      const message: Message = {
        id: `msg-${Date.now()}-${socket.userId}`,
        content: messageData.content.trim(),
        type: messageData.type || 'text',
        sender: mockUsers.find((u) => u.id === socket.userId) || mockUsers[0],
        roomId: socket.currentRoom,
        timestamp: new Date(),
        readBy: [socket.userId],
        reactions: messageData.reactions || {},
        threadCount: messageData.threadCount || 0,
        parentId: messageData.parentId,
      }

      // Validate message
      if (message.content.length > 2000) {
        socket.emit('error', { message: 'Message too long (max 2000 characters)' })
        return
      }

      messages.push(message)
      console.log(
        `💬 Message sent in room ${socket.currentRoom} by ${socket.userId}: ${message.content}`
      )

      // Broadcast message to room
      io.to(`room:${socket.currentRoom}`).emit('message_received', message)

      // Update typing indicator
      if (typingUsers.has(socket.userId)) {
        typingUsers.delete(socket.userId)
        socket.broadcast.to(`room:${socket.currentRoom}`).emit('user_stopped_typing', socket.userId)
      }
    })

    // Handle typing indicators
    socket.on('typing', (data: { roomId: string }) => {
      if (!socket.userId) return

      const typingData: TypingIndicator = {
        userId: socket.userId,
        roomId: data.roomId,
        timestamp: new Date(),
        isTyping: true,
      }

      typingUsers.set(socket.userId, typingData)
      socket.broadcast.to(`room:${data.roomId}`).emit('user_typing', typingData)
    })

    socket.on('stop_typing', (data: { roomId: string }) => {
      if (!socket.userId) return

      typingUsers.delete(socket.userId)
      socket.broadcast.to(`room:${data.roomId}`).emit('user_stopped_typing', socket.userId)
    })

    // Update user presence
    socket.on('update_presence', (data: { status: 'online' | 'away' | 'offline' }) => {
      if (!socket.userId) return

      const presence: UserPresence = {
        userId: socket.userId,
        status: data.status,
        lastSeen: new Date(),
        currentRoom: socket.currentRoom,
      }

      userPresence.set(socket.userId, presence)
      io.emit('user_presence_updated', presence)
    })

    // Handle message reactions
    socket.on('add_reaction', (data: { messageId: string; emoji: string }) => {
      if (!socket.userId || !socket.currentRoom) return

      // Find and update message
      const message = messages.find(
        (m) => m.id === data.messageId && m.roomId === socket.currentRoom
      )
      if (!message) return

      // Toggle reaction
      if (!message.reactions[data.emoji]) {
        message.reactions[data.emoji] = [] as string[]
      }

      const userIndex = message.reactions[data.emoji].indexOf(socket.userId)
      if (userIndex === -1) {
        message.reactions[data.emoji].push(socket.userId)
      } else {
        message.reactions[data.emoji].splice(userIndex, 1)

        // Remove empty reaction
        if (message.reactions[data.emoji].length === 0) {
          delete message.reactions[data.emoji]
        }
      }

      io.to(`room:${socket.currentRoom}`).emit('message_reaction_added', {
        messageId: data.messageId,
        emoji: data.emoji,
        userId: socket.userId,
      })
    })

    // Handle message read status
    socket.on('mark_read', (data: { messageId: string }) => {
      if (!socket.userId || !socket.currentRoom) return

      const message = messages.find(
        (m) => m.id === data.messageId && m.roomId === socket.currentRoom
      )
      if (!message) return

      if (!message.readBy.includes(socket.userId)) {
        message.readBy.push(socket.userId)

        io.to(`room:${socket.currentRoom}`).emit('message_read', {
          messageId: data.messageId,
          readBy: socket.userId,
        })
      }
    })

    // Handle disconnection
    socket.on('disconnect', () => {
      console.log('🔌 User disconnected:', socket.userId)

      if (socket.userId) {
        // Update presence to offline
        const presence = userPresence.get(socket.userId)
        if (presence) {
          presence.status = 'offline'
          presence.lastSeen = new Date()
          userPresence.set(socket.userId, presence)
          io.emit('user_presence_updated', presence)
        }

        // Clean up typing indicators
        typingUsers.delete(socket.userId)

        if (socket.currentRoom) {
          io.to(`room:${socket.currentRoom}`).emit('user_stopped_typing', socket.userId)
        }
      }
    })

    // Handle errors
    socket.on('error', (error) => {
      console.error('❌ Socket error:', error)
    })
  })

  // Clean up periodically
  const cleanupInterval = setInterval(() => {
    // Remove old typing indicators
    const now = new Date()
    typingUsers.forEach((typing, userId) => {
      if (now.getTime() - typing.timestamp.getTime() > 10000) {
        // 10 seconds
        typingUsers.delete(userId)
      }
    })

    // Remove old messages (keep last 1000)
    if (messages.length > 1000) {
      messages.splice(0, messages.length - 1000)
    }
  }, 30000) // Every 30 seconds

  // Return cleanup function
  return () => {
    clearInterval(cleanupInterval)
    io.close()
  }
}
