import { PrismaEnchiridionRepository } from '@/repositories/Prisma/prisma-enchiridion-repository'      
import {getAllEnchiridionUseCase} from '@/use-cases/enchiridion/getEnchiridion'
import { PrismaVaccinationRepository} from '@/repositories/Prisma/prisma-vacination-repository'  
import { PrismaWeightRepository } from '@/repositories/Prisma/prisma-weight-repository'

export function makegetAllEnchiridionUseCase() {
  const enchiridionRepository = new PrismaEnchiridionRepository() //istanciar meu repositório
  const vaccinationRepository = new PrismaVaccinationRepository() 
  const weightRepository = new PrismaWeightRepository()
  const useCase = new  getAllEnchiridionUseCase(enchiridionRepository, vaccinationRepository, weightRepository )

  return useCase
}