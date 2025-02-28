import {
  searchStudentByRegistrationUseCase,
  searchStudentByNameUseCase,
} from "@/use-cases/users/student/getStudent";
import { PrismaUsersRepository } from "@/repositories/Prisma/prisma-users-repository";

export function makeSearchStudentByRegistration() {
  const studentRepository = new PrismaUsersRepository();
  const useCase = new searchStudentByRegistrationUseCase(studentRepository);

  return useCase;
}

export function makeSearchStudentByName() {
  const studentRepository = new PrismaUsersRepository();
  const useCase = new searchStudentByNameUseCase(studentRepository);

  return useCase;
}
