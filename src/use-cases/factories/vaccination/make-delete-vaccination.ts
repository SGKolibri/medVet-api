import { PrismaVaccinationRepository} from '@/repositories/Prisma/prisma-vacination-repository'  
import { deleteVaccinationUseCase } from '@/use-cases/vaccination/deleteVaccination'


export function makeDeleteUseCase() {
  const vaccinationRepository = new PrismaVaccinationRepository() 
  const useCase = new  deleteVaccinationUseCase(vaccinationRepository)

  return useCase
}