import { PrismaConsultsRepository } from '@/repositories/Prisma/prisma-consults-repository'
import { UpdateConsultUseCase } from '@/use-cases/consult/updateConsults'

export function MakeUpdateConsultUseCase() {
  const consultRepository = new PrismaConsultsRepository()
  const useCase = new  UpdateConsultUseCase(consultRepository)

  return useCase
}