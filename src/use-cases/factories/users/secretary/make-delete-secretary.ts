import { PrismaUsersRepository } from '@/repositories/Prisma/prisma-users-repository'
import { MarkAsDeleteSecretaryUseCase } from '@/use-cases/users/secretary/deleteSecretary'

export function makeMarkAsDeleteUseCase() {
  const usersRepository = new PrismaUsersRepository()
  const useCase = new MarkAsDeleteSecretaryUseCase(usersRepository)

  return useCase
}
