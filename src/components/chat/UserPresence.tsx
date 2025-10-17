'use client'

import React from 'react'
import { motion } from 'framer-motion'
import { User } from '@/lib/websocket/types'
import Image from 'next/image'

interface UserPresenceProps {
  users?: User[]
}

export default function UserPresence({ users }: UserPresenceProps) {
  const onlineUsers = users?.filter((user) => user.status === 'online') || []
  const awayUsers = users?.filter((user) => user.status === 'away') || []
  const offlineUsers = users?.filter((user) => user.status === 'offline') || []

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'online':
        return '🟢'
      case 'away':
        return '🟡'
      case 'offline':
        return '🔴'
      default:
        return '⚪'
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'online':
        return 'bg-green-500'
      case 'away':
        return 'bg-yellow-500'
      case 'offline':
        return 'bg-gray-500'
      default:
        return 'bg-gray-400'
    }
  }

  return (
    <div className="p-4 bg-gray-50/50 dark:bg-gray-700/50 rounded-xl border border-gray-200/50 dark:border-gray-700/50">
      <div className="flex items-center justify-between mb-3">
        <h4 className="text-sm font-semibold text-gray-900 dark:text-white">ユーザーオンライン</h4>
        <motion.div
          animate={{ scale: [1, 1.1, 1] }}
          transition={{ repeat: Infinity, duration: 2 }}
          className="w-2 h-2 bg-green-500 rounded-full"
        />
      </div>

      {/* Online Users */}
      <div className="flex items-center gap-2 mb-3">
        <span className="text-xs font-medium text-green-600 dark:text-green-400">
          {getStatusIcon('online')} オンライン ({onlineUsers.length})
        </span>
        {onlineUsers.length > 0 && (
          <div className="flex -space-x-1">
            {onlineUsers.slice(0, 5).map((user, index) => (
              <motion.div
                key={user.id}
                initial={{ opacity: 0, scale: 0.5 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: index * 0.1 }}
                className="relative"
              >
                {user.avatar ? (
                  <Image
                    src={user.avatar}
                    alt={user.name}
                    width={20}
                    height={20}
                    className="rounded-full border border-white dark:border-gray-800 object-cover"
                  />
                ) : (
                  <div className="w-5 h-5 rounded-full bg-gradient-to-br from-pink-500 to-purple-600 flex items-center justify-center text-white text-xs font-semibold border border-white dark:border-gray-800">
                    {user.name.charAt(0)}
                  </div>
                )}
                <div
                  className={`absolute -bottom-0.5 -right-0.5 w-2 h-2 ${getStatusColor(user.status)} rounded-full border border-white dark:border-gray-800`}
                />
              </motion.div>
            ))}
          </div>
        )}
      </div>

      {/* Status Summary */}
      <div className="space-y-2 text-xs">
        <div className="flex justify-between">
          <span className="text-gray-600 dark:text-gray-400">{getStatusIcon('away')} 退席中</span>
          <span className="text-gray-900 dark:text-white font-medium">{awayUsers.length}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-gray-600 dark:text-gray-400">
            {getStatusIcon('offline')} オフライン
          </span>
          <span className="text-gray-900 dark:text-white font-medium">{offlineUsers.length}</span>
        </div>
        <div className="flex justify-between pt-2 border-t border-gray-200 dark:border-gray-600">
          <span className="text-gray-600 dark:text-gray-400 font-semibold">合計ユーザー</span>
          <span className="text-gray-900 dark:text-white font-bold">{users?.length || 0}</span>
        </div>
      </div>

      {/* Recent Activity */}
      <div className="mt-3 pt-3 border-t border-gray-200/30 dark:border-gray-600/30">
        <p className="text-xs text-gray-500 dark:text-gray-400">
          最近の活動{onlineUsers.length > 0 ? ` · ${onlineUsers[0]?.name}がオンライン` : ''}
        </p>
      </div>
    </div>
  )
}
