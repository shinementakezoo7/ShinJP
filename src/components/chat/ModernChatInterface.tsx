'use client'

import React, { useState, useEffect, useCallback, useMemo } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useTheme } from 'next-themes'
import { useSocketConnection, useUserPresence } from '@/lib/websocket/socket-client'
import MessageList from '@/components/chat/MessageList'
import ModernChatInput from '@/components/chat/ModernChatInput'
import ChatSidebar from '@/components/chat/ChatSidebar'
import UserPresence from '@/components/chat/UserPresence'
import { User, ChatRoom } from '@/lib/websocket/types'
import {
  MessageCircle,
  Users,
  Settings,
  Moon,
  Sun,
  PanelRightClose,
  PanelRightOpen,
  Bell,
  BellOff,
} from 'lucide-react'

const CURRENT_USER: User = {
  id: 'current-user-123',
  name: 'あなた',
  email: 'user@example.com',
  avatar: '/api/placeholder/40/40',
  status: 'online',
}

const DEFAULT_ROOM: ChatRoom = {
  id: 'main-chat-room',
  name: 'メインチャット',
  type: 'channel',
  participants: [],
  isPrivate: false,
  unreadCount: 0,
  createdAt: new Date(),
}

export default function ModernChatInterface() {
  const { theme, setTheme } = useTheme()
  const [activeRoom, setActiveRoom] = useState<ChatRoom>(DEFAULT_ROOM)
  const [sidebarOpen, setSidebarOpen] = useState(true)
  const [replyingTo, setReplyingTo] = useState<any>(null)
  const [notificationsEnabled, setNotificationsEnabled] = useState(true)
  const [inputHeight, setInputHeight] = useState(60)
  const [currentTheme, setCurrentTheme] = useState(theme)

  const { isConnected, connect, disconnect } = useSocketConnection()
  const { users, userPresence, updateUserPresence } = useUserPresence()

  // Initialize connection
  useEffect(() => {
    if (!isConnected) {
      connect(CURRENT_USER.id, activeRoom.id)
    }
  }, [isConnected, connect, activeRoom.id])

  // Handle theme changes
  const toggleTheme = useCallback(() => {
    const newTheme = theme === 'dark' ? 'light' : 'dark'
    setTheme(newTheme)
    setCurrentTheme(newTheme)
  }, [theme, setTheme])

  // Handle replies
  const handleReply = useCallback((message: any) => {
    setReplyingTo(message)
  }, [])

  const handleCancelReply = useCallback(() => {
    setReplyingTo(null)
  }, [])

  // Handle room changes
  const handleRoomChange = useCallback((room: ChatRoom) => {
    setActiveRoom(room)
    setReplyingTo(null)
  }, [])

  // Handle notifications toggle
  const toggleNotifications = useCallback(() => {
    setNotificationsEnabled((prev) => !prev)

    if ('Notification' in window) {
      if (notificationsEnabled) {
        Notification.requestPermission()
      }
    }
  }, [notificationsEnabled])

  // Memoized presence stats
  const presenceStats = useMemo(() => {
    const online = Object.values(userPresence).filter((p) => p.status === 'online').length
    const away = Object.values(userPresence).filter((p) => p.status === 'away').length
    const total = users.length

    return { online, away, total }
  }, [users, userPresence])

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50/30 via-purple-50/30 to-pink-50/30 dark:from-gray-900/90 dark:via-gray-800/90 dark:to-gray-900/90">
      <div className="flex h-screen bg-white/10 dark:bg-gray-900/10 backdrop-blur-sm">
        {/* Sidebar */}
        <AnimatePresence>
          {sidebarOpen && (
            <motion.aside
              initial={{ width: 0, opacity: 0 }}
              animate={{ width: 320, opacity: 1 }}
              exit={{ width: 0, opacity: 0 }}
              transition={{ type: 'spring', stiffness: 300, damping: 30 }}
              className="w-80 bg-white/80 dark:bg-gray-800/80 backdrop-blur-xl border-r border-gray-200/50 dark:border-gray-700/50 shadow-lg overflow-hidden"
            >
              {/* Sidebar Header */}
              <div className="p-6 border-b border-gray-200/50 dark:border-gray-700/50">
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center gap-3">
                    <motion.div
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center"
                    >
                      <MessageCircle className="w-4 h-4 text-white" />
                    </motion.div>
                    <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
                      チャット
                    </h2>
                  </div>

                  <div className="flex items-center gap-2">
                    {/* Theme Toggle */}
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={toggleTheme}
                      className="p-2 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 rounded-lg hover:bg-gray-100/50 dark:hover:bg-gray-700/50 transition-colors"
                      title="トグルテーマ"
                    >
                      {currentTheme === 'dark' ? (
                        <Sun className="w-4 h-4" />
                      ) : (
                        <Moon className="w-4 h-4" />
                      )}
                    </motion.button>

                    {/* Notifications Toggle */}
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={toggleNotifications}
                      className={`p-2 rounded-lg transition-colors ${
                        notificationsEnabled
                          ? 'text-blue-500 hover:text-blue-600 bg-blue-50/50 dark:bg-blue-900/20'
                          : 'text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 hover:bg-gray-100/50 dark:hover:bg-gray-700/50'
                      }`}
                      title={notificationsEnabled ? '通知を無効にする' : '通知を有効にする'}
                    >
                      {notificationsEnabled ? (
                        <Bell className="w-4 h-4" />
                      ) : (
                        <BellOff className="w-4 h-4" />
                      )}
                    </motion.button>
                  </div>
                </div>

                {/* User Presence Stats */}
                <UserPresence />
              </div>

              {/* Room List */}
              <ChatSidebar
                activeRoom={activeRoom}
                onRoomChange={handleRoomChange}
                currentUser={CURRENT_USER}
              />
            </motion.aside>
          )}
        </AnimatePresence>

        {/* Main Chat Area */}
        <div className="flex-1 flex flex-col overflow-hidden">
          {/* Header */}
          <motion.header
            initial={{ y: -20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            className="p-4 bg-white/60 dark:bg-gray-800/60 backdrop-blur-xl border-b border-gray-200/50 dark:border-gray-700/50 shadow-sm"
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                {/* Sidebar Toggle */}
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setSidebarOpen(!sidebarOpen)}
                  className="p-2 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 rounded-lg hover:bg-gray-100/50 dark:hover:bg-gray-700/50 transition-colors"
                  title={sidebarOpen ? 'サイドバーを閉じる' : 'サイドバーを開く'}
                >
                  {sidebarOpen ? (
                    <PanelRightClose className="w-5 h-5" />
                  ) : (
                    <PanelRightOpen className="w-5 h-5" />
                  )}
                </motion.button>

                {/* Room Info */}
                <div className="flex items-center gap-3">
                  <motion.div
                    whileHover={{ scale: 1.05 }}
                    className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center shadow-md"
                  >
                    <span className="text-white font-semibold">{activeRoom.name.charAt(0)}</span>
                  </motion.div>
                  <div>
                    <h3 className="font-semibold text-gray-900 dark:text-white">
                      {activeRoom.name}
                    </h3>
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      {presenceStats.online} 人がオンライン • {presenceStats.total} 人が参加
                    </p>
                  </div>
                </div>
              </div>

              {/* Header Actions */}
              <div className="flex items-center gap-2">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="p-2 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 rounded-lg hover:bg-gray-100/50 dark:hover:bg-gray-700/50 transition-colors"
                  title="参加者"
                >
                  <Users className="w-5 h-5" />
                </motion.button>

                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="p-2 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 rounded-lg hover:bg-gray-100/50 dark:hover:bg-gray-700/50 transition-colors"
                  title="設定"
                >
                  <Settings className="w-5 h-5" />
                </motion.button>
              </div>
            </div>
          </motion.header>

          {/* Messages */}
          <div className="flex-1 overflow-hidden">
            <MessageList
              currentUser={CURRENT_USER}
              onReply={handleReply}
              selectedThread={replyingTo?.id}
            />
          </div>

          {/* Chat Input */}
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="p-4 bg-white/90 dark:bg-gray-900/90 backdrop-blur-xl border-t border-gray-200/50 dark:border-gray-700/50"
          >
            <ModernChatInput
              currentUser={CURRENT_USER}
              replyingTo={replyingTo}
              onCancelReply={handleCancelReply}
              onHeightChange={setInputHeight}
              className="transition-all duration-200"
            />
          </motion.div>
        </div>
      </div>
    </div>
  )
}
