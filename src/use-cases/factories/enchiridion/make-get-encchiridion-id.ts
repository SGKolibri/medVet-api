
import { PrismaEnchiridionRepository } from '@/repositories/Prisma/prisma-enchiridion-repository'        

import { PrismaVaccinationRepository} from '@/repositories/Prisma/prisma-vacination-repository' 
import { PrismaWeightRepository } from '@/repositories/Prisma/prisma-weight-repository'
import { GetEnchiridionByIdUseCase } from '@/use-cases/enchiridion/getEnchiridion'

export function makegetIdEnchiridionUseCase() {
  const enchiridionRepository = new PrismaEnchiridionRepository() 
  const vaccinationRepository = new PrismaVaccinationRepository() 
  const weightRepository = new PrismaWeightRepository
  const useCase = new  GetEnchiridionByIdUseCase(enchiridionRepository, vaccinationRepository, weightRepository )

  return useCase
}