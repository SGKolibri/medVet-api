import '@fastify/jwt'

declare module '@fastify/jwt' {
  export interface FastifyJWT {
    user: {
      role: 'ADMIN' | 'TEACHER' | 'STUDENT'| 'SECRETARY'
      sub: string
    }
  }
}

