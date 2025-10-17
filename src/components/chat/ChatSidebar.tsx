'use client'

import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ChatRoom, User } from '@/lib/websocket/types'
import { formatDistanceToNow } from 'date-fns'
import { ja } from 'date-fns/locale'
import Image from 'next/image'
import { Hash, Lock, Users, Clock, MoreVertical, Pin, Volume2, Search } from 'lucide-react'

interface ChatSidebarProps {
  activeRoom: ChatRoom
  onRoomChange: (room: ChatRoom) => void
  currentUser: User
}

const MOCK_ROOMS: ChatRoom[] = [
  {
    id: 'main-chat-room',
    name: 'メインチャット',
    description: '一般的な日本語学習ディスカッション',
    type: 'channel',
    isPrivate: false,
    unreadCount: 0,
    participants: [],
    createdAt: new Date(),
    avatar: '/api/placeholder/40/40',
  },
  {
    id: 'jlpt-n5',
    name: 'JLPT N5',
    description: '初級日本語学習者のための空間',
    type: 'channel',
    isPrivate: false,
    unreadCount: 3,
    participants: [],
    createdAt: new Date(),
    avatar: '/api/placeholder/40/40',
  },
  {
    id: 'jlpt-n4',
    name: 'JLPT N4',
    description: '基礎日本語学習者のための空間',
    type: 'channel',
    isPrivate: false,
    unreadCount: 0,
    participants: [],
    createdAt: new Date(),
    avatar: '/api/placeholder/40/40',
  },
  {
    id: 'jlpt-n3',
    name: 'JLPT N3',
    description: '中級日本語学習者のための空間',
    type: 'channel',
    isPrivate: false,
    unreadCount: 1,
    participants: [],
    createdAt: new Date(),
    avatar: '/api/placeholder/40/40',
  },
  {
    id: 'jlpt-n2',
    name: 'JLPT N2',
    description: '上級日本語学習者のための空間',
    type: 'channel',
    isPrivate: false,
    unreadCount: 0,
    participants: [],
    createdAt: new Date(),
    avatar: '/api/placeholder/40/40',
  },
  {
    id: 'jlpt-n1',
    name: 'JLPT N1',
    description: '最高級日本語学習者のための空間',
    type: 'channel',
    isPrivate: false,
    unreadCount: 2,
    participants: [],
    createdAt: new Date(),
    avatar: '/api/placeholder/40/40',
  },
  {
    id: 'kanji-club',
    name: '漢字クラブ',
    description: '漢字学習パートナーを探す',
    type: 'group',
    isPrivate: false,
    unreadCount: 0,
    participants: [],
    createdAt: new Date(),
    avatar: '/api/placeholder/40/40',
  },
  {
    id: 'pronunciation-help',
    name: '発音ヘルプ',
    description: '日本語の発音支援',
    type: 'private',
    isPrivate: true,
    unreadCount: 0,
    participants: [],
    createdAt: new Date(),
    avatar: '/api/placeholder/40/40',
  },
]

export default function ChatSidebar({ activeRoom, onRoomChange, currentUser }: ChatSidebarProps) {
  const [searchTerm, setSearchTerm] = useState('')
  const [pinnedRooms, setPinnedRooms] = useState<string[]>(['main-chat-room'])
  const [expandedCategories, setExpandedCategories] = useState<string[]>(['channels'])

  const categories = {
    channels: {
      label: 'チャンネル',
      icon: Hash,
      rooms: MOCK_ROOMS.filter((r) => r.type === 'channel'),
    },
    groups: { label: 'グループ', icon: Users, rooms: MOCK_ROOMS.filter((r) => r.type === 'group') },
    private: {
      label: 'プライベート',
      icon: Lock,
      rooms: MOCK_ROOMS.filter((r) => r.type === 'private' || r.isPrivate),
    },
  }

  const togglePinned = (roomId: string) => {
    setPinnedRooms((prev) =>
      prev.includes(roomId) ? prev.filter((id) => id !== roomId) : [...prev, roomId]
    )
  }

  const toggleCategory = (categoryKey: string) => {
    setExpandedCategories((prev) =>
      prev.includes(categoryKey)
        ? prev.filter((key) => key !== categoryKey)
        : [...prev, categoryKey]
    )
  }

  const filteredRooms = Object.entries(categories)
    .map(([key, category]) => {
      const filtered = category.rooms.filter(
        (room) =>
          room.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          room.description?.toLowerCase().includes(searchTerm.toLowerCase())
      )
      return { key, ...category, rooms: filtered }
    })
    .filter((cat) => cat.rooms.length > 0)

  const isCategoryExpanded = (key: string) => expandedCategories.includes(key)

  return (
    <div className="flex-1 flex flex-col overflow-hidden">
      {/* Search */}
      <div className="p-4">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="チャットを検索..."
            className="w-full pl-10 pr-4 py-2 bg-gray-100/50 dark:bg-gray-700/50 border border-transparent rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
          />
        </div>
      </div>

      {/* Room Categories */}
      <div className="flex-1 overflow-y-auto px-4">
        {filteredRooms.map(({ key, label, icon: Icon, rooms }) => {
          const isExpanded = isCategoryExpanded(key)

          return (
            <div key={key} className="mb-4">
              {/* Category Header */}
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => toggleCategory(key)}
                className="w-full flex items-center justify-between p-2 text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200 transition-colors rounded-lg hover:bg-gray-100/30 dark:hover:bg-gray-800/30"
              >
                <div className="flex items-center gap-2">
                  <Icon className="w-4 h-4" />
                  <span className="text-sm font-medium">{label}</span>
                  <span className="text-xs text-gray-400">({rooms.length})</span>
                </div>
                <motion.div
                  animate={{ rotate: isExpanded ? 90 : 0 }}
                  transition={{ duration: 0.2 }}
                >
                  <MoreVertical className="w-4 h-4" />
                </motion.div>
              </motion.button>

              {/* Rooms List */}
              <AnimatePresence>
                {isExpanded && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.3 }}
                    className="pl-2 space-y-1"
                  >
                    {rooms.map((room, index) => {
                      const isPinned = pinnedRooms.includes(room.id)
                      const isActive = activeRoom.id === room.id
                      const hasUnread = room.unreadCount > 0

                      return (
                        <motion.div
                          key={room.id}
                          initial={{ x: -20, opacity: 0 }}
                          animate={{ x: 0, opacity: 1 }}
                          transition={{ delay: index * 0.05 }}
                        >
                          <motion.button
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                            onClick={() => onRoomChange(room)}
                            className={`w-full p-3 rounded-xl transition-all duration-200 border ${
                              isActive
                                ? 'bg-blue-50/80 dark:bg-blue-900/20 border-blue-500/30 shadow-md'
                                : 'hover:bg-gray-50/50 dark:hover:bg-gray-800/50 border-transparent'
                            }`}
                          >
                            <div className="flex items-start gap-3">
                              {/* Room Avatar */}
                              <div className="relative">
                                {room.avatar ? (
                                  <Image
                                    src={room.avatar}
                                    alt={room.name}
                                    width={40}
                                    height={40}
                                    className="rounded-xl object-cover"
                                  />
                                ) : (
                                  <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center text-white font-semibold">
                                    {room.name.charAt(0)}
                                  </div>
                                )}
                                {room.isPrivate && (
                                  <div className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 rounded-full flex items-center justify-center">
                                    <Lock className="w-3 h-3 text-white" />
                                  </div>
                                )}
                              </div>

                              {/* Room Info */}
                              <div className="flex-1 min-w-0">
                                <div className="flex items-center gap-2 mb-1">
                                  <h4 className="font-semibold text-gray-900 dark:text-white text-sm leading-tight">
                                    {room.name}
                                  </h4>
                                  {hasUnread && (
                                    <motion.div
                                      animate={{ scale: [1, 1.2, 1] }}
                                      transition={{ repeat: Infinity, duration: 2 }}
                                      className="w-2 h-2 bg-red-500 rounded-full"
                                    />
                                  )}
                                </div>
                                <p className="text-xs text-gray-600 dark:text-gray-400 line-clamp-2 leading-relaxed">
                                  {room.description}
                                </p>
                                <div className="flex items-center gap-3 mt-2">
                                  <span className="text-xs text-gray-500">
                                    {formatDistanceToNow(room.createdAt, {
                                      addSuffix: true,
                                      locale: ja,
                                    })}
                                  </span>
                                  {room.unreadCount > 0 && (
                                    <span className="text-xs font-medium px-2 py-1 bg-red-500 text-white rounded-full">
                                      {room.unreadCount}
                                    </span>
                                  )}
                                </div>
                              </div>

                              {/* Actions */}
                              <div className="flex flex-col gap-1">
                                <motion.button
                                  whileHover={{ scale: 1.1 }}
                                  whileTap={{ scale: 0.9 }}
                                  onClick={() => togglePinned(room.id)}
                                  className={`p-1 rounded transition-colors ${
                                    isPinned
                                      ? 'text-yellow-500 hover:text-yellow-600'
                                      : 'text-gray-400 hover:text-yellow-500'
                                  }`}
                                >
                                  <Pin className="w-4 h-4" />
                                </motion.button>
                              </div>
                            </div>
                          </motion.button>
                        </motion.div>
                      )
                    })}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          )
        })}

        {/* Empty State */}
        {searchTerm && filteredRooms.length === 0 && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="text-center py-8"
          >
            <div className="w-16 h-16 bg-gray-100 dark:bg-gray-700 rounded-full flex items-center justify-center mx-auto mb-4">
              <Search className="w-8 h-8 text-gray-400" />
            </div>
            <p className="text-gray-600 dark:text-gray-400 text-sm">
              &quot;{searchTerm}&quot; に一致するチャットが見つかりません
            </p>
          </motion.div>
        )}
      </div>

      {/* Quick Actions */}
      <div className="p-4 border-t border-gray-200/30 dark:border-gray-700/30">
        <div className="flex gap-2">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="flex-1 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm font-medium transition-colors"
          >
            新しいチャット
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="px-4 py-2 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600 rounded-lg text-sm font-medium transition-colors"
          >
            招待
          </motion.button>
        </div>
      </div>
    </div>
  )
}
