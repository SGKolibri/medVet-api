import { PrismaEnchiridionRepository } from '@/repositories/Prisma/prisma-enchiridion-repository'        
import {GetSequenceByEnchiridionUseCase} from '@/use-cases/enchiridion/getEnchiridion'
import { PrismaVaccinationRepository} from '@/repositories/Prisma/prisma-vacination-repository' 
import { PrismaWeightRepository } from '@/repositories/Prisma/prisma-weight-repository'

export function makegetSequenceEnchiridionUseCase() {
  const enchiridionRepository = new PrismaEnchiridionRepository() 
  const vaccinationRepository = new PrismaVaccinationRepository() 
  const weightRepository = new PrismaWeightRepository
  const useCase = new GetSequenceByEnchiridionUseCase(enchiridionRepository, vaccinationRepository, weightRepository )

  return useCase
}