import { PrismaUsersRepository } from '@/repositories/Prisma/prisma-users-repository'
import { CreateStudentsUseCase } from '@/use-cases/users/student/createStudents'

export function makeRegisterUseCase() {
  const usersRepository = new PrismaUsersRepository() //istanciar meu repositório
  const useCase = new CreateStudentsUseCase(usersRepository)

  return useCase
}