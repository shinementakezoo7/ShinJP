import { io, Socket } from 'socket.io-client'
import { create } from 'zustand'
import { devtools, persist } from 'zustand/middleware'
import type { User, Message, ChatRoom, TypingIndicator, UserPresence } from './types'

interface SocketState {
  socket: Socket | null
  isConnected: boolean
  isConnecting: boolean
  connectionError: string | null
  reconnectAttempts: number
  users: User[]
  messages: Message[]
  activeRoom: ChatRoom | null
  typingUsers: TypingIndicator[]
  userPresence: Map<string, UserPresence>
}

interface SocketActions {
  connect: (userId: string, roomId?: string) => Promise<void>
  disconnect: () => void
  sendMessage: (content: string, type?: 'text' | 'file' | 'emoji') => Promise<void>
  sendTypingIndicator: (isTyping: boolean) => void
  joinRoom: (roomId: string) => void
  leaveRoom: (roomId: string) => void
  updateUserPresence: (status: 'online' | 'away' | 'offline') => void
  markMessageRead: (messageId: string) => void
  reactToMessage: (messageId: string, emoji: string) => void
  setConnectionError: (error: string | null) => void
  updateUsers: (users: User[]) => void
  addMessage: (message: Message) => void
  updateTypingUsers: (typingUsers: TypingIndicator[]) => void
  updateUserPresenceMap: (presences: Map<string, UserPresence>) => void
}

const initialState: SocketState = {
  socket: null,
  isConnected: false,
  isConnecting: false,
  connectionError: null,
  reconnectAttempts: 0,
  users: [],
  messages: [],
  activeRoom: null,
  typingUsers: [],
  userPresence: new Map(),
}

export const useSocketStore = create<SocketState & SocketActions>()(
  devtools(
    persist(
      (set, get) => ({
        ...initialState,

        connect: async (userId: string, roomId?: string) => {
          const { socket, isConnecting } = get()

          if (socket?.connected || isConnecting) return

          set({ isConnecting: true, connectionError: null })

          try {
            const newSocket = io(process.env.NEXT_PUBLIC_WS_URL || 'ws://localhost:3001', {
              auth: { userId },
              transports: ['websocket', 'polling'],
              timeout: 20000,
              reconnectionAttempts: 5,
              reconnectionDelay: 1000,
              reconnectionDelayMax: 5000,
            })

            newSocket.on('connect', () => {
              console.log('🔌 WebSocket connected')
              set({
                socket: newSocket,
                isConnected: true,
                isConnecting: false,
                reconnectAttempts: 0,
                connectionError: null,
              })
            })

            newSocket.on('disconnect', (reason) => {
              console.log('🔌 WebSocket disconnected:', reason)
              set({
                isConnected: false,
                socket: null,
                isConnecting: false,
              })
            })

            newSocket.on('connect_error', (error) => {
              console.error('❌ WebSocket connection error:', error)
              set({
                connectionError: error.message,
                isConnecting: false,
                reconnectAttempts: get().reconnectAttempts + 1,
              })
            })

            newSocket.on('reconnect_attempt', (attemptNumber) => {
              console.log(`🔄 Reconnection attempt ${attemptNumber}`)
              set({ reconnectAttempts: attemptNumber })
            })

            newSocket.on('users_online', (users: User[]) => {
              set({ users })
            })

            newSocket.on('message_received', (message: Message) => {
              set((state) => ({
                messages: [...state.messages, message],
              }))
            })

            newSocket.on('user_typing', (typingData: TypingIndicator) => {
              set((state) => {
                const existing = state.typingUsers.find((t) => t.userId === typingData.userId)
                if (existing) {
                  return {
                    typingUsers: state.typingUsers.map((t) =>
                      t.userId === typingData.userId ? typingData : t
                    ),
                  }
                }
                return { typingUsers: [...state.typingUsers, typingData] }
              })
            })

            newSocket.on('user_stopped_typing', (userId: string) => {
              set((state) => ({
                typingUsers: state.typingUsers.filter((t) => t.userId !== userId),
              }))
            })

            newSocket.on('user_presence_updated', (presence: UserPresence) => {
              set((state) => {
                const newMap = new Map(state.userPresence)
                newMap.set(presence.userId, presence)
                return { userPresence: newMap }
              })
            })

            newSocket.on('message_read', (data: { messageId: string; readBy: string }) => {
              set((state) => ({
                messages: state.messages.map((msg) =>
                  msg.id === data.messageId ? { ...msg, readBy: [...msg.readBy, data.readBy] } : msg
                ),
              }))
            })

            newSocket.on(
              'message_reaction_added',
              (data: { messageId: string; emoji: string; userId: string }) => {
                set((state) => ({
                  messages: state.messages.map((msg) =>
                    msg.id === data.messageId
                      ? {
                          ...msg,
                          reactions: {
                            ...msg.reactions,
                            [data.emoji]: [...(msg.reactions[data.emoji] || []), data.userId],
                          },
                        }
                      : msg
                  ),
                }))
              }
            )

            if (roomId) {
              newSocket.emit('join_room', roomId)
            }
          } catch (error) {
            console.error('❌ Failed to create socket connection:', error)
            set({
              isConnecting: false,
              connectionError: error instanceof Error ? error.message : 'Connection failed',
            })
          }
        },

        disconnect: () => {
          const { socket } = get()
          if (socket) {
            socket.disconnect()
          }
          set({ ...initialState })
        },

        sendMessage: async (content: string, type = 'text') => {
          const { socket, activeRoom } = get()

          if (!socket?.connected || !activeRoom) {
            throw new Error('Not connected to chat room')
          }

          const message: Partial<Message> = {
            content,
            type,
            roomId: activeRoom.id,
            timestamp: new Date(),
          }

          socket.emit('send_message', message)
        },

        sendTypingIndicator: (isTyping: boolean) => {
          const { socket, activeRoom } = get()

          if (!socket?.connected || !activeRoom) return

          socket.emit(isTyping ? 'typing' : 'stop_typing', { roomId: activeRoom.id })
        },

        joinRoom: (roomId: string) => {
          const { socket } = get()

          if (!socket?.connected) return

          socket.emit('join_room', roomId)
          set({ activeRoom: { id: roomId, name: roomId, participants: [] } })
        },

        leaveRoom: (roomId: string) => {
          const { socket } = get()

          if (!socket?.connected) return

          socket.emit('leave_room', roomId)
          set({ activeRoom: null, typingUsers: [] })
        },

        updateUserPresence: (status: 'online' | 'away' | 'offline') => {
          const { socket } = get()

          if (!socket?.connected) return

          socket.emit('update_presence', { status })
        },

        markMessageRead: (messageId: string) => {
          const { socket } = get()

          if (!socket?.connected) return

          socket.emit('mark_read', { messageId })
        },

        reactToMessage: (messageId: string, emoji: string) => {
          const { socket } = get()

          if (!socket?.connected) return

          socket.emit('add_reaction', { messageId, emoji })
        },

        setConnectionError: (error: string | null) => set({ connectionError: error }),
        updateUsers: (users: User[]) => set({ users }),
        addMessage: (message: Message) =>
          set((state) => ({
            messages: [...state.messages, message],
          })),
        updateTypingUsers: (typingUsers: TypingIndicator[]) => set({ typingUsers }),
        updateUserPresenceMap: (presences: Map<string, UserPresence>) =>
          set({ userPresence: presences }),
      }),
      {
        name: 'socket-storage',
        partialize: (state) => ({
          isConnected: state.isConnected,
          messages: state.messages.slice(-100), // Keep last 100 messages
          userPresence: state.userPresence,
        }),
      }
    )
  )
) as const

// Export utility hooks
export const useSocketConnection = () => {
  const store = useSocketStore()
  return {
    isConnected: store.isConnected,
    isConnecting: store.isConnecting,
    error: store.connectionError,
    connect: store.connect,
    disconnect: store.disconnect,
  }
}

export const useChatMessages = () => {
  const store = useSocketStore()
  return {
    messages: store.messages,
    sendMessage: store.sendMessage,
    markMessageRead: store.markMessageRead,
    reactToMessage: store.reactToMessage,
  }
}

export const useTypingIndicators = () => {
  const store = useSocketStore()
  return {
    typingUsers: store.typingUsers,
    sendTypingIndicator: store.sendTypingIndicator,
  }
}

export const useUserPresence = () => {
  const store = useSocketStore()
  return {
    users: store.users,
    userPresence: store.userPresence,
    updateUserPresence: store.updateUserPresence,
  }
}
