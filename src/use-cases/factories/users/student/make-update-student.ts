import { PrismaUsersRepository } from "@/repositories/Prisma/prisma-users-repository"
import { UpdateStudentUseCase } from "@/use-cases/users/student/updateStudent"

export function MakeUpdateStudentUseCase() {
  const userRepository = new PrismaUsersRepository()
  const useCase = new  UpdateStudentUseCase(userRepository)

  return useCase
}