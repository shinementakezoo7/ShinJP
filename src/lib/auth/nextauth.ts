import type { NextAuthOptions } from 'next-auth'
import CredentialsProvider from 'next-auth/providers/credentials'
import GoogleProvider from 'next-auth/providers/google'
import { authenticateUser } from './index'
import type { UserRole } from './roles'

// Extend the built-in session types
declare module 'next-auth' {
  interface Session {
    user: {
      id: string
      name?: string
      email?: string
      image?: string
      username?: string
      role: UserRole
    }
  }

  interface User {
    id: string
    name?: string
    email: string
    image?: string
    username?: string
    role: UserRole
  }
}

declare module 'next-auth/jwt' {
  interface JWT {
    id: string
    username?: string
    role: UserRole
  }
}

// Configure NextAuth options with enhanced features
export const authOptions: NextAuthOptions = {
  providers: [
    // Email/password authentication with enhanced security
    CredentialsProvider({
      name: 'Credentials',
      credentials: {
        email: { label: 'Email', type: 'email' },
        password: { label: 'Password', type: 'password' },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          return null
        }

        // Authenticate user with enhanced security features
        const result = await authenticateUser(credentials.email, credentials.password)

        if (!result) {
          return null
        }

        return {
          id: result.user.id,
          name: result.user.full_name || result.user.username,
          email: result.user.email,
          image: result.user.avatar_url || undefined,
          username: result.user.username,
          role: result.user.role,
        }
      },
    }),
    // Google OAuth provider with enhanced session management
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID || '',
      clientSecret: process.env.GOOGLE_CLIENT_SECRET || '',
      authorization: {
        params: {
          scope: 'openid email profile',
          access_type: 'offline',
          prompt: 'consent',
        },
      },
    }),
  ],
  callbacks: {
    // JWT callback with role and username information
    async jwt({ token, user, account }) {
      if (user) {
        token.id = user.id
        token.username = user.username
        token.role = user.role
      }

      // Handle OAuth account linking
      if (account && user) {
        // Store OAuth session information
        // This would integrate with our oauthSessions system
      }

      return token
    },
    // Session callback with enhanced user information
    async session({ session, token }) {
      if (token && session.user) {
        session.user.id = token.id as string
        session.user.username = token.username as string
        session.user.role = token.role as UserRole
      }
      return session
    },
    // Redirect callback for custom routing
    async redirect({ url, baseUrl }) {
      // Allows relative callback URLs
      if (url.startsWith('/')) return `${baseUrl}${url}`
      // Allows callback URLs on the same origin
      else if (new URL(url).origin === baseUrl) return url
      return baseUrl
    },
  },
  events: {
    // Track successful sign-ins
    async signIn({ user, account, profile, isNewUser }) {
      // Log security event
      console.log(`User signed in: ${user.email}`, {
        userId: user.id,
        provider: account?.provider,
        isNewUser,
      })

      // Update last active timestamp
      if (user.id) {
        // This would integrate with our security system
      }
    },
    // Track sign-outs
    async signOut({ session, token }) {
      // Log security event
      console.log('User signed out', {
        userId: token?.id || session?.user?.id,
      })
    },
  },
  pages: {
    signIn: '/auth/signin',
    signOut: '/auth/signout',
    error: '/auth/error',
    newUser: '/auth/signup', // New users will be redirected here
  },
  secret: process.env.NEXTAUTH_SECRET,
  session: {
    strategy: 'jwt',
    maxAge: 24 * 60 * 60, // 24 hours
    updateAge: 1 * 60 * 60, // 1 hour
  },
  jwt: {
    secret: process.env.NEXTAUTH_SECRET,
    maxAge: 24 * 60 * 60, // 24 hours
  },
  // Debug mode in development
  debug: process.env.NODE_ENV === 'development',
}
