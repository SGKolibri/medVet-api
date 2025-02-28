import { MarkAsDeleteUseCase } from '@/use-cases/animal/deleteAnimal'
import { PrismaAnimalsRepository } from '@/repositories/Prisma/prisma-animals-repository'

export function MakeMarkAsDelete() {
  const animalRepository = new PrismaAnimalsRepository()
  const UseCase = new MarkAsDeleteUseCase(animalRepository)

  return UseCase
}
