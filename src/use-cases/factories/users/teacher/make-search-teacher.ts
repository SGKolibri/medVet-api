import { GetTeachersByRegistrationUseCase } from "@/use-cases/users/teacher/getTeachers";
import { PrismaUsersRepository } from "@/repositories/Prisma/prisma-users-repository";

export function searchTeachersByRegistration() {
    const teacherRepository = new PrismaUsersRepository()
    const useCase = new GetTeachersByRegistrationUseCase(teacherRepository)

    return useCase
}