import type { Metadata } from 'next'
import { Geist, Geist_Mono, Noto_Sans_JP } from 'next/font/google'
import '../globals.css'
import '@/styles/chat-system.css'
import { ThemeProvider } from 'next-themes'

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
})

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
})

const notoSansJP = Noto_Sans_JP({
  variable: '--font-noto-sans-jp',
  subsets: ['latin'],
  weight: ['400', '500', '700'],
})

export const metadata: Metadata = {
  title: '現代的なチャット - Modern Japanese Learning Chat',
  description: '現代的なWebSocketベースのチャットシステムで日本語学習を向上させましょう',
  keywords: ['japanese', 'learning', 'chat', 'websocket', 'ai'],
  viewport: 'width=device-width, initial-scale=1, maximum-scale=5',
  themeColor: '#3B82F6',
}

export default function ChatLayout({ children }: { children: React.ReactNode }) {
  return (
    <html
      lang="en"
      className="${geistSans.variable} ${geistMono.variable} ${notoSansJP.variable}"
      suppressHydrationWarning
    >
      <body className="antialiased font-sans">
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          {children}
        </ThemeProvider>
      </body>
    </html>
  )
}
