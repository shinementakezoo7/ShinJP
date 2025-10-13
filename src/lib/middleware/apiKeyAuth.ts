import { type NextFetchEvent, NextRequest, NextResponse } from 'next/server'
import { validateApiKey } from '../auth'

// API key authentication middleware
export async function apiKeyAuth(req: NextRequest, _event: NextFetchEvent) {
  // Check if API key is provided in Authorization header
  const authHeader = req.headers.get('authorization')

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return NextResponse.json({ error: 'Missing or invalid API key' }, { status: 401 })
  }

  const apiKey = authHeader.substring(7) // Remove 'Bearer ' prefix

  // Validate API key
  const validationResult = await validateApiKey(apiKey)

  if (!validationResult) {
    return NextResponse.json({ error: 'Invalid or expired API key' }, { status: 401 })
  }

  // Check endpoint permissions if configured
  const endpoint = req.nextUrl.pathname
  const allowedEndpoints = process.env.API_KEY_ALLOWED_ENDPOINTS?.split(',') || []

  if (allowedEndpoints.length > 0) {
    const isAllowed = allowedEndpoints.some((allowed) => endpoint.startsWith(allowed.trim()))

    if (!isAllowed) {
      return NextResponse.json(
        { error: 'API key not authorized for this endpoint' },
        { status: 403 }
      )
    }
  }

  // Add user info to request headers for downstream handlers
  const requestHeaders = new Headers(req.headers)
  requestHeaders.set('x-user-id', validationResult.userId)
  requestHeaders.set('x-user-permissions', validationResult.permissions.join(','))

  // Clone the request with new headers
  const newReq = new NextRequest(req, {
    headers: requestHeaders,
  })

  return newReq
}
