import { PrismaTutorsRepository } from '@/repositories/Prisma/prisma-tutors-repository';
import { PrismaConsultsRepository } from '@/repositories/Prisma/prisma-consults-repository';
import { GetAllConsultsUseCase } from '@/use-cases/consult/getConsults';

export function getAllConsultsUseCase() {
  const consultsRepository = new PrismaConsultsRepository()
  const tutorsRepository = new PrismaTutorsRepository()
  const useCase = new GetAllConsultsUseCase(consultsRepository, tutorsRepository)

  return useCase
}
