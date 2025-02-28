import { PrismaUsersRepository } from "@/repositories/Prisma/prisma-users-repository"
import { UpdateSecretaryUseCase } from "@/use-cases/users/secretary/updateSecretary"

export function MakeUpdateSecretaryUseCase() {
  const userRepository = new PrismaUsersRepository()
  const useCase = new  UpdateSecretaryUseCase(userRepository)

  return useCase
}
