import type { Metadata } from 'next'
import { Geist, Geist_Mono, Noto_Sans_JP } from 'next/font/google'
import './globals.css'
import { Analytics } from '@vercel/analytics/react'
import { SpeedInsights } from '@vercel/speed-insights/next'
import { PostHogProvider } from '@/components/providers/PostHogProvider'
import { ThemeProvider } from '@/lib/theme/theme-context'
import { Providers } from './providers'

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
  title: 'Shinmen Takezo | AI-Powered Japanese Learning from N5 to N1',
  description:
    'Master Japanese from JLPT N5 to N1 with Shinmen Takezo. AI-powered personalized learning, spaced repetition, and immersive practice. Powered by advanced AI.',
  openGraph: {
    title: 'Shinmen Takezo | Master Japanese with AI',
    description: 'From JLPT N5 to N1 - AI-powered Japanese learning platform',
    type: 'website',
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} ${notoSansJP.variable} antialiased`}
        suppressHydrationWarning
      >
        <PostHogProvider>
          <Providers>
            <ThemeProvider>{children}</ThemeProvider>
          </Providers>
        </PostHogProvider>
        <Analytics />
        <SpeedInsights />
      </body>
    </html>
  )
}
