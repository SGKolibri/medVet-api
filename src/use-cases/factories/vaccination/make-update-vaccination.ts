import { PrismaVaccinationRepository} from '@/repositories/Prisma/prisma-vacination-repository'  
import { UpdateVaccinationUseCase} from '@/use-cases/vaccination/updateVaccinations'


export function makeUpdateUseCase() {
  const vaccinationRepository = new PrismaVaccinationRepository() 
  const useCase = new  UpdateVaccinationUseCase(vaccinationRepository)

  return useCase
}