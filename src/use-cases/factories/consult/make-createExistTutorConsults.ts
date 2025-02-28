import { PrismaConsultsRepository } from '@/repositories/Prisma/prisma-consults-repository'
import { CreateExistTutorConsultsUseCase } from '@/use-cases/consult/createExistTutorConsults';
import { PrismaTutorsRepository } from '@/repositories/Prisma/prisma-tutors-repository';

export function makeRegisterUseCase() {
  const tutorsRepository = new PrismaTutorsRepository()
  const usersRepository = new PrismaConsultsRepository() //istanciar meu repositório
  const useCase = new CreateExistTutorConsultsUseCase(usersRepository, tutorsRepository)

  return useCase
}