import { PrismaAnimalsRepository } from '@/repositories/Prisma/prisma-animals-repository'
import { PrismaTutorsRepository } from '@/repositories/Prisma/prisma-tutors-repository'
import {GetAnimalByTutorUseCase } from '@/use-cases/animal/getAnimals'

export function makeGetByTutorAnimalUseCase() {
  const animalRepository = new PrismaAnimalsRepository() 
  const prismaTutorsRepository  = new PrismaTutorsRepository () 
  const useCase = new  GetAnimalByTutorUseCase(animalRepository, prismaTutorsRepository)

  return useCase
}
