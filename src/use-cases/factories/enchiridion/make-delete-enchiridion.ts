import { PrismaEnchiridionRepository } from '@/repositories/Prisma/prisma-enchiridion-repository'
import { MarkEnchiridionAsDeleteUseCase } from '@/use-cases/enchiridion/deleteEnchiridion'

export function MakeMarkEnchiridionAsDelete() {
  const enchiridionRepository = new PrismaEnchiridionRepository() //istanciar meu repositório
  const useCase = new  MarkEnchiridionAsDeleteUseCase(enchiridionRepository)

  return useCase
}
