import axios, { type AxiosError, type AxiosInstance } from 'axios'

// NVIDIA API Configuration
interface NVIDIAConfig {
  apiKeys: string[]
  endpoints: string[]
  maxRetries: number
  initialBackoffMs: number
  modelEndpointMap?: Record<string, string>
}

interface NVIDIARequest {
  model: string
  messages: Array<{ role: string; content: string }>
  temperature?: number
  max_tokens?: number
  stream?: boolean
}

interface NVIDIAResponse {
  id: string
  choices: Array<{
    message: {
      role: string
      content: string
    }
    finish_reason: string
  }>
  usage: {
    prompt_tokens: number
    completion_tokens: number
    total_tokens: number
  }
}

class NVIDIAClient {
  private config: NVIDIAConfig
  private currentEndpointIndex: number = 0
  private currentKeyIndex: number = 0
  private axiosInstance: AxiosInstance

  constructor(config?: Partial<NVIDIAConfig>) {
    this.config = {
      apiKeys: [process.env.NVIDIA_API_KEY_1 || '', process.env.NVIDIA_API_KEY_2 || ''].filter(
        (key) => key.length > 0
      ),
      endpoints: [
        process.env.NVIDIA_ENDPOINT_1 || 'https://integrate.api.nvidia.com/v1/chat/completions',
        process.env.NVIDIA_ENDPOINT_2 || 'https://integrate.api.nvidia.com/v1/chat/completions',
      ],
      maxRetries: config?.maxRetries || 3,
      initialBackoffMs: config?.initialBackoffMs || 1000,
      modelEndpointMap: {
        'stockmark/stockmark-2-100b-instruct':
          'https://integrate.api.nvidia.com/v1/chat/completions',
      },
    }

    if (this.config.apiKeys.length === 0) {
      console.warn('⚠️  No NVIDIA API keys configured. Fallback to OpenAI will be used.')
    }

    this.axiosInstance = axios.create({
      timeout: 60000,
      headers: {
        'Content-Type': 'application/json',
      },
    })
  }

  /**
   * Get next endpoint in round-robin fashion
   */
  private getNextEndpoint(model?: string): string {
    // Check if model has a specific endpoint mapping
    if (model && this.config.modelEndpointMap?.[model]) {
      console.log(`📍 Using dedicated endpoint for model: ${model}`)
      return this.config.modelEndpointMap[model]
    }

    // Otherwise use round-robin
    const endpoint = this.config.endpoints[this.currentEndpointIndex]
    this.currentEndpointIndex = (this.currentEndpointIndex + 1) % this.config.endpoints.length
    return endpoint
  }

  /**
   * Get current API key and rotate if needed
   */
  private getCurrentApiKey(): string {
    if (this.config.apiKeys.length === 0) {
      throw new Error('No NVIDIA API keys available')
    }
    return this.config.apiKeys[this.currentKeyIndex]
  }

  /**
   * Rotate to next API key
   */
  private rotateApiKey(): void {
    this.currentKeyIndex = (this.currentKeyIndex + 1) % this.config.apiKeys.length
    console.log(`🔄 Rotated to API key ${this.currentKeyIndex + 1}/${this.config.apiKeys.length}`)
  }

  /**
   * Calculate exponential backoff delay
   */
  private getBackoffDelay(attempt: number): number {
    return this.config.initialBackoffMs * 2 ** attempt
  }

  /**
   * Sleep for specified milliseconds
   */
  private sleep(ms: number): Promise<void> {
    return new Promise((resolve) => setTimeout(resolve, ms))
  }

  /**
   * Check if error should trigger key rotation
   */
  private shouldRotateKey(error: AxiosError): boolean {
    if (!error.response) return false
    const status = error.response.status
    return status === 429 || status >= 500
  }

  /**
   * Make request to NVIDIA API with retry logic
   */
  async chatCompletion(request: NVIDIARequest): Promise<NVIDIAResponse> {
    let lastError: Error | null = null

    for (let attempt = 0; attempt < this.config.maxRetries; attempt++) {
      try {
        const endpoint = this.getNextEndpoint(request.model)
        const apiKey = this.getCurrentApiKey()

        console.log(`🚀 NVIDIA API Request (Attempt ${attempt + 1}/${this.config.maxRetries})`)
        console.log(`   Endpoint: ${endpoint}`)
        console.log(`   Model: ${request.model}`)

        const response = await this.axiosInstance.post<NVIDIAResponse>(endpoint, request, {
          headers: {
            Authorization: `Bearer ${apiKey}`,
          },
        })

        console.log('✅ NVIDIA API Success')
        return response.data
      } catch (error) {
        const axiosError = error as AxiosError
        lastError = axiosError

        console.error(`❌ NVIDIA API Error (Attempt ${attempt + 1}):`, {
          status: axiosError.response?.status,
          message: axiosError.message,
        })

        // Check if we should rotate key
        if (this.shouldRotateKey(axiosError) && this.config.apiKeys.length > 1) {
          this.rotateApiKey()
        }

        // Don't retry on client errors (except 429)
        if (
          axiosError.response?.status &&
          axiosError.response.status < 500 &&
          axiosError.response.status !== 429
        ) {
          throw axiosError
        }

        // Wait with exponential backoff before retry
        if (attempt < this.config.maxRetries - 1) {
          const delay = this.getBackoffDelay(attempt)
          console.log(`⏳ Waiting ${delay}ms before retry...`)
          await this.sleep(delay)
        }
      }
    }

    console.error('💥 All NVIDIA API retry attempts exhausted')
    throw lastError || new Error('NVIDIA API request failed')
  }

  /**
   * Check if NVIDIA API is available
   */
  isAvailable(): boolean {
    return this.config.apiKeys.length > 0
  }

  /**
   * Get current configuration status
   */
  getStatus() {
    return {
      available: this.isAvailable(),
      apiKeysCount: this.config.apiKeys.length,
      endpointsCount: this.config.endpoints.length,
      currentEndpointIndex: this.currentEndpointIndex,
      currentKeyIndex: this.currentKeyIndex,
    }
  }
}

// Export singleton instance
export const nvidiaClient = new NVIDIAClient()

// Export types
export type { NVIDIARequest, NVIDIAResponse, NVIDIAConfig }
