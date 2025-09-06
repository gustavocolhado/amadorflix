import { withAuth } from 'next-auth/middleware'

export default withAuth(
  function middleware(req) {
    // Middleware personalizado aqui se necessário
  },
  {
    callbacks: {
      authorized: ({ token }) => !!token,
    },
  }
)

export const config = {
  matcher: [
    // Rotas que precisam de autenticação
    '/dashboard/:path*',
    '/profile/:path*',
    '/upload/:path*',
  ],
} 