import { DeleteTeacherUseCase } from '@/use-cases/users/teacher/deleteTeacher';
import { PrismaUsersRepository } from '@/repositories/Prisma/prisma-users-repository'

export function makeDeleteUseCase() {
  const usersRepository = new PrismaUsersRepository()
  const useCase = new DeleteTeacherUseCase(usersRepository)

  return useCase
}