import { PrismaUsersRepository } from '@/repositories/Prisma/prisma-users-repository'
import { AuthenticateUseCase } from '@/use-cases/users/authenticate'

export function makeAuthenticateUseCase() {
  const usersRepository = new PrismaUsersRepository() //istanciar meu repositório
  const authenticateUseCase = new AuthenticateUseCase(usersRepository)

  return authenticateUseCase
}
