'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Cpu,
  Server,
  Code,
  Palette,
  Wrench,
  Database,
  Shield,
  ArrowRight,
  Sparkles,
  Info,
} from 'lucide-react'

interface AIProvider {
  name: string
  npm: string
  options: {
    baseURL: string
    apiKey: string
    keepAlive: boolean
    connectionPoolSize: number
    maxRetries: number
    streaming: boolean
    timeout: number
  }
  models: Record<
    string,
    {
      name: string
      options: {
        temperature: number
      }
    }
  >
}

interface AIConfig {
  provider: Record<string, AIProvider>
  model: string
  permission: {
    edit: string
    bash: string
    webfetch: string
  }
}

const getProviderIcon = (providerName: string) => {
  const iconMap: Record<string, any> = {
    'Backend/DevOps': Cpu,
    'UI/Frontend': Palette,
    'General/Coding': Code,
    'Hard Logic': Wrench,
    'Duplicate for Manual Switch': Database,
    'StreamLake AI': Server,
  }

  if (providerName.includes('Backend') || providerName.includes('DevOps')) return Cpu
  if (providerName.includes('UI') || providerName.includes('Frontend')) return Palette
  if (providerName.includes('General') || providerName.includes('Coding')) return Code
  if (providerName.includes('Hard Logic')) return Wrench
  if (providerName.includes('Duplicate') || providerName.includes('Backup')) return Database
  if (providerName.includes('StreamLake')) return Server

  return Cpu
}

const getProviderColor = (providerName: string) => {
  const colorMap: Record<string, string> = {
    'Backend/DevOps': 'from-blue-500 to-cyan-600',
    'UI/Frontend': 'from-purple-500 to-pink-600',
    'General/Coding': 'from-green-500 to-emerald-600',
    'Hard Logic': 'from-orange-500 to-red-600',
    'Duplicate for Manual Switch': 'from-gray-500 to-slate-600',
    'StreamLake AI': 'from-indigo-500 to-blue-600',
  }

  if (providerName.includes('Backend') || providerName.includes('DevOps'))
    return 'from-blue-500 to-cyan-600'
  if (providerName.includes('UI') || providerName.includes('Frontend'))
    return 'from-purple-500 to-pink-600'
  if (providerName.includes('General') || providerName.includes('Coding'))
    return 'from-green-500 to-emerald-600'
  if (providerName.includes('Hard Logic')) return 'from-orange-500 to-red-600'
  if (providerName.includes('Duplicate') || providerName.includes('Backup'))
    return 'from-gray-500 to-slate-600'
  if (providerName.includes('StreamLake')) return 'from-indigo-500 to-blue-600'

  return 'from-blue-500 to-cyan-600'
}

export default function EnhancedAIConfig() {
  const [config, setConfig] = useState<AIConfig | null>(null)
  const [selectedProvider, setSelectedProvider] = useState<string | null>(null)
  const [copiedField, setCopiedField] = useState<string | null>(null)
  const [showAllKeys, setShowAllKeys] = useState(false)

  useEffect(() => {
    // Load the config from the JSON file
    fetch('/opencode.json')
      .then((res) => res.json())
      .then((data) => setConfig(data))
      .catch(console.error)
  }, [])

  const copyToClipboard = async (text: string, field: string) => {
    try {
      await navigator.clipboard.writeText(text)
      setCopiedField(field)
      setTimeout(() => setCopiedField(null), 2000)
    } catch (err) {
      console.error('Failed to copy:', err)
    }
  }

  const toggleShowKeys = () => {
    setShowAllKeys(!showAllKeys)
  }

  if (!config) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-blue-50 dark:from-gray-900 dark:via-gray-800 dark:to-blue-950 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600 dark:text-gray-300">Loading AI Configuration...</p>
        </div>
      </div>
    )
  }

  const providers = Object.entries(config.provider)
  const activeModel = config.model

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-blue-50 dark:from-gray-900 dark:via-gray-800 dark:to-blue-950">
      {/* Header */}
      <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-md border-b border-gray-200 dark:border-gray-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <motion.div
                className="w-12 h-12 bg-gradient-to-br from-blue-500 to-cyan-600 rounded-2xl flex items-center justify-center shadow-lg"
                animate={{ rotate: 360 }}
                transition={{ duration: 20, repeat: Infinity, ease: 'linear' }}
              >
                <Sparkles className="w-6 h-6 text-white" />
              </motion.div>
              <div>
                <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
                  AI Configuration Dashboard
                </h1>
                <p className="text-gray-600 dark:text-gray-300 mt-1">
                  Advanced AI Provider Management
                </p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <button
                onClick={toggleShowKeys}
                className="px-4 py-2 bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 rounded-xl font-semibold text-sm hover:bg-blue-200 dark:hover:bg-blue-900/50 transition-colors"
              >
                {showAllKeys ? 'Hide' : 'Show'} API Keys
              </button>
              <div className="text-right">
                <p className="text-sm text-gray-500 dark:text-gray-400">Active Model</p>
                <p className="font-semibold text-gray-900 dark:text-white">{activeModel}</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats Overview */}
        <motion.div
          className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg hover:shadow-xl transition-shadow">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 dark:text-gray-300">
                  Total Providers
                </p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">
                  {providers.length}
                </p>
              </div>
              <Server className="w-8 h-8 text-blue-500" />
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg hover:shadow-xl transition-shadow">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 dark:text-gray-300">Total Models</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">
                  {providers.reduce(
                    (acc, [, provider]) => acc + Object.keys(provider.models).length,
                    0
                  )}
                </p>
              </div>
              <Cpu className="w-8 h-8 text-purple-500" />
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg hover:shadow-xl transition-shadow">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 dark:text-gray-300">
                  Streaming Enabled
                </p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">
                  {providers.filter(([, p]) => p.options.streaming).length}
                </p>
              </div>
              <ArrowRight className="w-8 h-8 text-green-500" />
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg hover:shadow-xl transition-shadow">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 dark:text-gray-300">Permissions</p>
                <div className="flex gap-1 mt-1">
                  {Object.entries(config.permission).map(([key, value]) => (
                    <span
                      key={key}
                      className={`px-2 py-1 text-xs rounded-full ${
                        value === 'allow'
                          ? 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300'
                          : 'bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-300'
                      }`}
                    >
                      {key}: {value}
                    </span>
                  ))}
                </div>
              </div>
              <Shield className="w-8 h-8 text-yellow-500" />
            </div>
          </div>
        </motion.div>

        {/* Providers Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-8">
          {providers.map(([key, provider], index) => {
            const Icon = getProviderIcon(provider.name)
            const gradient = getProviderColor(provider.name)
            const isActive = activeModel.startsWith(key)

            return (
              <motion.div
                key={key}
                className="bg-white dark:bg-gray-800 rounded-3xl overflow-hidden shadow-xl hover:shadow-2xl transition-all duration-300 cursor-pointer group"
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1, duration: 0.5 }}
                whileHover={{ y: -10, scale: 1.02 }}
                onClick={() => setSelectedProvider(selectedProvider === key ? null : key)}
              >
                {/* Header */}
                <div
                  className={`bg-gradient-to-br ${gradient} p-6 text-white relative overflow-hidden`}
                >
                  {isActive && (
                    <div className="absolute top-4 right-4 bg-yellow-400 text-yellow-900 px-3 py-1 rounded-full text-xs font-bold animate-pulse">
                      ACTIVE
                    </div>
                  )}
                  <div className="flex items-center gap-4 relative z-10">
                    <motion.div
                      className="w-12 h-12 bg-white/20 backdrop-blur-sm rounded-2xl flex items-center justify-center"
                      whileHover={{ scale: 1.1 }}
                    >
                      <Icon className="w-6 h-6" />
                    </motion.div>
                    <div className="flex-1 min-w-0">
                      <h3 className="font-bold text-lg truncate">{provider.name}</h3>
                      <p className="text-white/90 text-sm opacity-75 truncate">{key}</p>
                    </div>
                  </div>

                  {/* Animated Background */}
                  <motion.div
                    className="absolute -right-4 -top-4 w-24 h-24 bg-white/10 rounded-full"
                    animate={{ scale: [1, 1.2, 1] }}
                    transition={{ duration: 3, repeat: Infinity }}
                  />
                </div>

                {/* Content */}
                <div className="p-6">
                  {/* Models */}
                  <div className="mb-4">
                    <h4 className="font-semibold text-gray-900 dark:text-white mb-3 flex items-center gap-2">
                      <Code className="w-4 h-4" />
                      Models ({Object.keys(provider.models).length})
                    </h4>
                    <div className="space-y-2">
                      {Object.entries(provider.models).map(([modelKey, model]) => (
                        <div
                          key={modelKey}
                          className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700/50 rounded-xl"
                        >
                          <div>
                            <p className="font-medium text-gray-900 dark:text-white">
                              {model.name}
                            </p>
                            <p className="text-sm text-gray-600 dark:text-gray-400">{modelKey}</p>
                          </div>
                          <div className="text-right">
                            <p className="text-sm font-medium text-blue-600 dark:text-blue-400">
                              Temp: {model.options.temperature}
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Connection Info */}
                  <div className="space-y-3">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-600 dark:text-gray-400">Streaming</span>
                      <span
                        className={`px-2 py-1 rounded-full text-xs font-semibold ${
                          provider.options.streaming
                            ? 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300'
                            : 'bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-300'
                        }`}
                      >
                        {provider.options.streaming ? 'Enabled' : 'Disabled'}
                      </span>
                    </div>

                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-600 dark:text-gray-400">Timeout</span>
                      <span className="text-gray-900 dark:text-white">
                        {provider.options.timeout}ms
                      </span>
                    </div>

                    {selectedProvider === key && (
                      <AnimatePresence>
                        <motion.div
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: 'auto' }}
                          exit={{ opacity: 0, height: 0 }}
                          transition={{ duration: 0.3 }}
                          className="space-y-3 pt-4 border-t border-gray-200 dark:border-gray-700"
                        >
                          {/* API Key */}
                          <div>
                            <label className="block text-sm font-medium text-gray-600 dark:text-gray-400 mb-2">
                              API Key
                            </label>
                            <div className="flex gap-2">
                              <input
                                type={showAllKeys ? 'text' : 'password'}
                                value={provider.options.apiKey}
                                readOnly
                                className="flex-1 bg-gray-50 dark:bg-gray-700/50 border border-gray-300 dark:border-gray-600 rounded-lg px-3 py-2 text-sm"
                              />
                              <button
                                onClick={(e) => {
                                  e.stopPropagation()
                                  copyToClipboard(provider.options.apiKey, `${key}-api-key`)
                                }}
                                className={`px-3 py-2 rounded-lg text-sm font-semibold transition-colors ${
                                  copiedField === `${key}-api-key`
                                    ? 'bg-green-500 text-white'
                                    : 'bg-blue-500 text-white hover:bg-blue-600'
                                }`}
                              >
                                {copiedField === `${key}-api-key` ? 'Copied!' : 'Copy'}
                              </button>
                            </div>
                          </div>

                          {/* Base URL */}
                          <div>
                            <label className="block text-sm font-medium text-gray-600 dark:text-gray-400 mb-2">
                              Base URL
                            </label>
                            <div className="flex gap-2">
                              <input
                                type="text"
                                value={provider.options.baseURL}
                                readOnly
                                className="flex-1 bg-gray-50 dark:bg-gray-700/50 border border-gray-300 dark:border-gray-600 rounded-lg px-3 py-2 text-sm"
                              />
                              <button
                                onClick={(e) => {
                                  e.stopPropagation()
                                  copyToClipboard(provider.options.baseURL, `${key}-base-url`)
                                }}
                                className={`px-3 py-2 rounded-lg text-sm font-semibold transition-colors ${
                                  copiedField === `${key}-base-url`
                                    ? 'bg-green-500 text-white'
                                    : 'bg-blue-500 text-white hover:bg-blue-600'
                                }`}
                              >
                                {copiedField === `${key}-base-url` ? 'Copied!' : 'Copy'}
                              </button>
                            </div>
                          </div>

                          {/* Advanced Options */}
                          <div className="grid grid-cols-2 gap-3 text-xs">
                            <div>
                              <span className="text-gray-500 dark:text-gray-400">Retries:</span>
                              <span className="text-gray-900 dark:text-white ml-1">
                                {provider.options.maxRetries}
                              </span>
                            </div>
                            <div>
                              <span className="text-gray-500 dark:text-gray-400">Pool Size:</span>
                              <span className="text-gray-900 dark:text-white ml-1">
                                {provider.options.connectionPoolSize}
                              </span>
                            </div>
                            <div>
                              <span className="text-gray-500 dark:text-gray-400">Keep Alive:</span>
                              <span className="text-gray-900 dark:text-white ml-1">
                                {provider.options.keepAlive ? 'Yes' : 'No'}
                              </span>
                            </div>
                            <div>
                              <span className="text-gray-500 dark:text-gray-400">NPM Package:</span>
                              <span className="text-gray-900 dark:text-white ml-1">
                                {provider.npm}
                              </span>
                            </div>
                          </div>
                        </motion.div>
                      </AnimatePresence>
                    )}

                    <button
                      onClick={(e) => {
                        e.stopPropagation()
                        setSelectedProvider(selectedProvider === key ? null : key)
                      }}
                      className="w-full mt-2 py-2 bg-gray-100 dark:bg-gray-700/50 rounded-lg text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
                    >
                      {selectedProvider === key ? 'Hide Details' : 'Show Details'}
                    </button>
                  </div>
                </div>
              </motion.div>
            )
          })}
        </div>

        {/* Footer */}
        <motion.div
          className="mt-12 text-center text-gray-500 dark:text-gray-400"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1 }}
        >
          <p className="flex items-center justify-center gap-2">
            <Info className="w-4 h-4" />
            Configuration loaded from opencode.json • Click any provider card to view detailed
            settings
          </p>
        </motion.div>
      </div>
    </div>
  )
}
