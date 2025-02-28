import { PrismaUsersRepository } from '@/repositories/Prisma/prisma-users-repository'
import { MarkAsDeleteStudentUseCase } from '@/use-cases/users/student/deleteStudent'

export function makeMarkAsDeleteUseCase() {
  const usersRepository = new PrismaUsersRepository()
  const useCase = new MarkAsDeleteStudentUseCase(usersRepository)


  return useCase
}
