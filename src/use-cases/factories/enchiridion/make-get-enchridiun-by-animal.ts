import { PrismaEnchiridionRepository } from '@/repositories/Prisma/prisma-enchiridion-repository'  
import { PrismaAnimalsRepository} from '@/repositories/Prisma/prisma-animals-repository'       
import { PrismaTutorsRepository} from '@/repositories/Prisma/prisma-tutors-repository' 
import { PrismaWeightRepository } from '@/repositories/Prisma/prisma-weight-repository'      
import { getAnimalIdEnchiridionUseCase} from '@/use-cases/enchiridion/getEnchiridion'
import { PrismaVaccinationRepository} from '@/repositories/Prisma/prisma-vacination-repository'   

export function makegetAnimalIdEnchiridionUseCase() {
  const enchiridionRepository = new PrismaEnchiridionRepository() //istanciar meu repositório
  const animalsRepository = new PrismaAnimalsRepository() //istanciar meu repositório
  const vaccinationRepository = new PrismaVaccinationRepository() 
  const weightRepository = new PrismaWeightRepository()
  const tutorRepository = new PrismaTutorsRepository() 
  const useCase = new  getAnimalIdEnchiridionUseCase(enchiridionRepository,  animalsRepository,  vaccinationRepository, tutorRepository, weightRepository)

  return useCase
}