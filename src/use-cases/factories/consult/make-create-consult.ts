import { PrismaTutorsRepository } from '@/repositories/Prisma/prisma-tutors-repository';
import { PrismaConsultsRepository } from '@/repositories/Prisma/prisma-consults-repository'
import { CreateConsultsUseCase } from '@/use-cases/consult/createConsults';

export function makeRegisterUseCase() {
  const tutorsRepository = new PrismaTutorsRepository() //istanciar meu repositório
  const consultsRepository = new PrismaConsultsRepository() //istanciar meu repositório
  const useCase = new CreateConsultsUseCase(consultsRepository, tutorsRepository,)

  return useCase
}