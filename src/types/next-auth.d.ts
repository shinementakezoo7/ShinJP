import 'next-auth'
import { UserRole } from '@/lib/auth/roles'

declare module 'next-auth' {
  interface Session {
    user: {
      id: string
      name?: string | null
      email?: string | null
      image?: string | null
      username?: string | null
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
