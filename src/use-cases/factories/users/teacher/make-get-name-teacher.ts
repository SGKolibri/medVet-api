import { PrismaUsersRepository } from "@/repositories/Prisma/prisma-users-repository"
import { SearchTeacherByNameUseCase } from "@/use-cases/users/teacher/getTeachers"

export function getNameTeachers() {
    const usersRepository = new PrismaUsersRepository()
    const useCase = new SearchTeacherByNameUseCase(usersRepository)

    return useCase
}
