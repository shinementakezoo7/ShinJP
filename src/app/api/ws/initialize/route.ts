import { NextApiRequest, NextApiResponse } from 'next'
import { Server } from 'socket.io'
import { setupWebSocketServer } from '@/lib/websocket/socket-server'
import type { Server as HTTPServer } from 'http'
import type { Socket as NetSocket } from 'net'

interface NextApiResponseWithSocket extends NextApiResponse {
  socket: NetSocket & {
    server: HTTPServer & {
      io?: Server
    }
  }
}

export default async function handler(req: NextApiRequest, res: NextApiResponseWithSocket) {
  try {
    if (req.method !== 'GET') {
      return res.status(405).json({ error: 'Method not allowed' })
    }

    // Initialize WebSocket server if not already initialized
    if (!res.socket.server.io) {
      console.log('🚀 Initializing WebSocket server...')

      const httpServer = res.socket.server
      const cleanup = setupWebSocketServer(httpServer)

      // Store cleanup function for when server stops
      res.socket.server.on('close', cleanup)
    }

    res.status(200).json({
      success: true,
      message: 'WebSocket server is running',
      connected: !!res.socket.server.io,
    })
  } catch (error) {
    console.error('❌ WebSocket server error:', error)
    res.status(500).json({
      error: 'Failed to initialize WebSocket server',
      details: error instanceof Error ? error.message : 'Unknown error',
    })
  }
}
