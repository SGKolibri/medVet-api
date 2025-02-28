import { PrismaEnchiridionRepository } from '@/repositories/Prisma/prisma-enchiridion-repository'  
import { PrismaWeightRepository } from '@/repositories/Prisma/prisma-weight-repository'
import { UpdateEnchiridionUseCase} from '@/use-cases/enchiridion/updateEnchiridion'
import { PrismaVaccinationRepository} from '@/repositories/Prisma/prisma-vacination-repository'  


export function makeUpdateUseCase() {
  const enchiridionRepository = new PrismaEnchiridionRepository() 
  const vaccinationRepository = new PrismaVaccinationRepository() 
  const weightRepository = new PrismaWeightRepository()
  const useCase = new  UpdateEnchiridionUseCase(enchiridionRepository, weightRepository, vaccinationRepository)

  return useCase
}