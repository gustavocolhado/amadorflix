import { PrismaAdapter } from '@next-auth/prisma-adapter'
import { AuthOptions } from 'next-auth'
import CredentialsProvider from 'next-auth/providers/credentials'
import { prisma } from '@/lib/prisma'
import bcrypt from 'bcrypt'

async function verifyPassword(inputPassword: string, storedPassword: string): Promise<boolean> {
  return await bcrypt.compare(inputPassword, storedPassword)
}

export const authOptions: AuthOptions = {
  adapter: PrismaAdapter(prisma),
  providers: [
    CredentialsProvider({
      name: 'Credentials',
      credentials: {
        email: { label: 'Email', type: 'text' },
        password: { label: 'Password', type: 'password' },
        source: { label: 'Source', type: 'text' },
      },
      async authorize(credentials, req) {
        const email = credentials?.email
        const password = credentials?.password
        const source = String(credentials?.source || '')

        if (!email || !password) {
          throw new Error('Email e senha são obrigatórios')
        }

        const user = await prisma.user.findUnique({
          where: { email },
        })

        if (!user || !user.password) {
          throw new Error('Email ou senha incorretos')
        }

        const isPasswordValid = await verifyPassword(password, user.password)
        if (!isPasswordValid) {
          throw new Error('Email ou senha incorretos')
        }

        if (!user.signupSource) {
          await prisma.user.update({
            where: { email },
            data: { signupSource: source },
          })
        }

        return {
          id: user.id,
          email: user.email,
          premium: user.premium,
          username: user.username,
          name: user.name,
        }
      },
    }),
  ],
  session: {
    strategy: 'jwt',
    maxAge: 30 * 24 * 60 * 60, // 30 dias
  },
  secret: process.env.NEXTAUTH_SECRET,
  callbacks: {
    async signIn({ user, account, profile, credentials }) {
      const source = String(credentials?.source || 'website')
      return true
    },
    async session({ session, token }) {
      if (token && token.email) {
        const user = await prisma.user.findUnique({
          where: { email: token.email as string },
        })

        if (user) {
          // Verifica se a assinatura premium expirou
          const now = new Date()
          if (user.expireDate && user.expireDate < now && user.premium) {
            await prisma.user.update({
              where: { id: user.id },
              data: { premium: false },
            })
          }

          session.user = {
            ...session.user,
            id: user.id,
            username: user.username,
            name: user.name,
            email: user.email,
            premium: user.premium,
            expireDate: user.premium ? user.expireDate : null,
          }
        }
      }
      return session
    },
    async jwt({ token, user, account }) {
      // Persiste os dados do usuário no token
      if (user) {
        token.id = user.id
        token.username = user.username
        token.name = user.name
        token.premium = user.premium
        token.expireDate = user.expireDate || null
        token.email = user.email
      }

      // Atualiza o token quando o usuário faz login
      if (account) {
        token.accessToken = account.access_token
      }

      return token
    },
    async redirect({ url, baseUrl }) {
      // Permite redirecionamentos relativos e absolutos para o mesmo domínio
      if (url.startsWith('/')) return `${baseUrl}${url}`
      else if (new URL(url).origin === baseUrl) return url
      return baseUrl
    },
  },
  pages: {
    signIn: '/login',
    signOut: '/logout',
    error: '/auth/error',
    newUser: '/register', // Página para novos usuários (opcional)
  },
  events: {
    async signIn({ user, account, profile, isNewUser }) {
      // Log de atividades ou outras ações pós-login
      console.log(`User ${user.email} signed in via ${account?.provider}`)
    },
    async signOut({ token, session }) {
      // Limpeza ou log ao deslogar
      console.log('User signed out')
    },
  },
  debug: process.env.NODE_ENV === 'development',
} 