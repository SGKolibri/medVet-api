import { PrismaEnchiridionRepository } from '@/repositories/Prisma/prisma-enchiridion-repository'  
import { PrismaAnimalsRepository} from '@/repositories/Prisma/prisma-animals-repository'    
import { PrismaTutorsRepository} from '@/repositories/Prisma/prisma-tutors-repository'    
import { PrismaWeightRepository } from '@/repositories/Prisma/prisma-weight-repository'
import { PrismaVaccinationRepository} from '@/repositories/Prisma/prisma-vacination-repository'    
import { getTutorIdEnchiridionUseCase} from '@/use-cases/enchiridion/getEnchiridion'

export function makegetTutorIdEnchiridionUseCase() {
  const enchiridionRepository = new PrismaEnchiridionRepository() //istanciar meu repositório
  const animalsRepository = new PrismaAnimalsRepository() 
  const tutorRepository = new PrismaTutorsRepository() 
  const vaccinationRepository = new PrismaVaccinationRepository() 
  const weightREpository = new PrismaWeightRepository()
  const useCase = new  getTutorIdEnchiridionUseCase(enchiridionRepository, tutorRepository ,  animalsRepository, vaccinationRepository, weightREpository )

  return useCase
}