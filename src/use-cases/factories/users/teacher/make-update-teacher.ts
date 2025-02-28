import { PrismaUsersRepository } from "@/repositories/Prisma/prisma-users-repository"
import { UpdateTeacherUseCase } from "@/use-cases/users/teacher/updateTeacher"

export function MakeUpdateTeacherUseCase() {
  const userRepository = new PrismaUsersRepository()
  const useCase = new  UpdateTeacherUseCase(userRepository)

  return useCase
}