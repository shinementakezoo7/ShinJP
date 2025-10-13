/**
 * Audio Generator Service
 * Generates Japanese audio using Azure Cognitive Services or Google Cloud TTS
 * Supports multiple speakers, speeds, and dialects
 */

import axios from 'axios'

export interface AudioGenerationParams {
  text: string
  speaker: 'male' | 'female' | 'child' | 'elderly'
  speed: 'slow' | 'normal' | 'fast'
  dialect: string
}

export interface AudioGenerationResult {
  url: string
  duration: number
  sizeKB: number
  provider: string
  voiceId: string
}

// Voice mapping for Azure TTS
const AZURE_VOICES = {
  male: 'ja-JP-KeitaNeural',
  female: 'ja-JP-NanamiNeural',
  child: 'ja-JP-AoiNeural',
  elderly: 'ja-JP-MayuNeural',
}

// Speed mapping
const SPEED_RATES = {
  slow: '-20%',
  normal: '0%',
  fast: '+20%',
}

/**
 * Generate audio using Azure Cognitive Services
 */
export async function generateAudio(params: AudioGenerationParams): Promise<AudioGenerationResult> {
  const provider = process.env.AZURE_SPEECH_KEY ? 'azure' : 'mock'

  if (provider === 'azure') {
    return generateAudioAzure(params)
  } else {
    // Return mock audio for development
    return generateMockAudio(params)
  }
}

async function generateAudioAzure(params: AudioGenerationParams): Promise<AudioGenerationResult> {
  const region = process.env.AZURE_SPEECH_REGION || 'eastus'
  const apiKey = process.env.AZURE_SPEECH_KEY

  if (!apiKey) {
    throw new Error('Azure Speech API key not configured')
  }

  const voiceName = AZURE_VOICES[params.speaker]
  const rateAdjustment = SPEED_RATES[params.speed]

  // Build SSML
  const ssml = `<speak version='1.0' xml:lang='ja-JP'>
    <voice name='${voiceName}'>
      <prosody rate='${rateAdjustment}'>
        ${escapeXml(params.text)}
      </prosody>
    </voice>
  </speak>`

  console.log(`🔊 Generating audio with Azure TTS...`)
  console.log(`   Voice: ${voiceName}`)
  console.log(`   Speed: ${params.speed} (${rateAdjustment})`)

  try {
    const response = await axios.post(
      `https://${region}.tts.speech.microsoft.com/cognitiveservices/v1`,
      ssml,
      {
        headers: {
          'Ocp-Apim-Subscription-Key': apiKey,
          'Content-Type': 'application/ssml+xml',
          'X-Microsoft-OutputFormat': 'audio-16khz-128kbitrate-mono-mp3',
          'User-Agent': 'ShinJP-TTS',
        },
        responseType: 'arraybuffer',
        timeout: 30000,
      }
    )

    const audioBuffer = Buffer.from(response.data)
    const sizeKB = Math.round(audioBuffer.length / 1024)

    // Calculate duration (approximate based on file size and bitrate)
    // 128kbps = 16KB/s, so duration ≈ sizeKB / 16
    const duration = Math.round((sizeKB / 16) * 10) / 10

    // Upload to storage (Supabase Storage or S3)
    const audioUrl = await uploadAudioFile(audioBuffer, generateFileName(params))

    console.log(`✅ Audio generated: ${sizeKB}KB, ~${duration}s`)

    return {
      url: audioUrl,
      duration: duration,
      sizeKB: sizeKB,
      provider: 'azure',
      voiceId: voiceName,
    }
  } catch (error) {
    console.error('❌ Azure TTS error:', error)
    if (axios.isAxiosError(error)) {
      throw new Error(`Azure TTS failed: ${error.response?.status} ${error.response?.statusText}`)
    }
    throw error
  }
}

async function generateMockAudio(params: AudioGenerationParams): Promise<AudioGenerationResult> {
  console.log('🔊 Mock audio generation (Azure key not configured)')

  // Return mock data for development
  const mockDuration = Math.max(2, params.text.length * 0.1)
  const mockSize = Math.round(mockDuration * 16)

  return {
    url: `/mock-audio/${encodeURIComponent(params.text)}.mp3`,
    duration: mockDuration,
    sizeKB: mockSize,
    provider: 'mock',
    voiceId: `mock-${params.speaker}`,
  }
}

/**
 * Upload audio file to Supabase Storage
 */
async function uploadAudioFile(_buffer: Buffer, fileName: string): Promise<string> {
  // For now, return a mock URL
  // In production, implement actual upload to Supabase Storage or S3

  /* 
  // Example Supabase Storage implementation:
  const { createClient } = require('@supabase/supabase-js')
  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  )

  const { data, error } = await supabase.storage
    .from('audio')
    .upload(`tts/${fileName}`, buffer, {
      contentType: 'audio/mpeg',
      cacheControl: '3600',
      upsert: false
    })

  if (error) throw error

  const { data: publicURL } = supabase.storage
    .from('audio')
    .getPublicUrl(`tts/${fileName}`)

  return publicURL.publicUrl
  */

  // For now, return a placeholder URL
  // TODO: Implement actual file upload
  console.log(`📦 Mock upload: ${fileName}`)
  return `https://storage.supabase.co/v1/object/public/audio/tts/${fileName}`
}

/**
 * Generate unique filename for audio file
 */
function generateFileName(params: AudioGenerationParams): string {
  const hash = hashString(params.text)
  const timestamp = Date.now()
  return `${hash}-${params.speaker}-${params.speed}-${timestamp}.mp3`
}

/**
 * Simple string hash function
 */
function hashString(str: string): string {
  let hash = 0
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i)
    hash = (hash << 5) - hash + char
    hash = hash & hash
  }
  return Math.abs(hash).toString(36)
}

/**
 * Escape XML special characters
 */
function escapeXml(unsafe: string): string {
  return unsafe
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;')
}

/**
 * Google Cloud TTS implementation (alternative)
 */
export async function generateAudioGoogle(
  params: AudioGenerationParams
): Promise<AudioGenerationResult> {
  const apiKey = process.env.GOOGLE_CLOUD_TTS_KEY

  if (!apiKey) {
    throw new Error('Google Cloud TTS API key not configured')
  }

  // Voice mapping for Google TTS
  const voiceMap = {
    male: 'ja-JP-Wavenet-C',
    female: 'ja-JP-Wavenet-A',
    child: 'ja-JP-Wavenet-B',
    elderly: 'ja-JP-Wavenet-D',
  }

  const speedMap = {
    slow: 0.85,
    normal: 1.0,
    fast: 1.15,
  }

  try {
    const response = await axios.post(
      `https://texttospeech.googleapis.com/v1/text:synthesize?key=${apiKey}`,
      {
        input: { text: params.text },
        voice: {
          languageCode: 'ja-JP',
          name: voiceMap[params.speaker],
        },
        audioConfig: {
          audioEncoding: 'MP3',
          speakingRate: speedMap[params.speed],
          pitch: 0,
        },
      }
    )

    const audioContent = response.data.audioContent
    const audioBuffer = Buffer.from(audioContent, 'base64')
    const sizeKB = Math.round(audioBuffer.length / 1024)
    const duration = Math.round((sizeKB / 16) * 10) / 10

    const audioUrl = await uploadAudioFile(audioBuffer, generateFileName(params))

    return {
      url: audioUrl,
      duration: duration,
      sizeKB: sizeKB,
      provider: 'google',
      voiceId: voiceMap[params.speaker],
    }
  } catch (error) {
    console.error('Google TTS error:', error)
    throw new Error('Google TTS generation failed')
  }
}

export default generateAudio
