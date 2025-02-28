import { PrismaConsultsRepository } from '@/repositories/Prisma/prisma-consults-repository'
import { MarkAsDoneConsultUseCase } from '@/use-cases/consult/deleteConsults'

export function MakeDeleteConsultUseCase() {
  const consultRepository = new PrismaConsultsRepository()
  const useCase = new  MarkAsDoneConsultUseCase(consultRepository)

  return useCase
}
