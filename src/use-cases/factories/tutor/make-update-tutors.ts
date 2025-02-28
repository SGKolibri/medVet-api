import { PrismaTutorsRepository } from '@/repositories/Prisma/prisma-tutors-repository'
import { UpdateTutorUseCase } from '@/use-cases/tutor/updateTutor'

export function MakeUpdateTutorUseCase() {
  const tutorsRepository = new PrismaTutorsRepository()
  const useCase = new  UpdateTutorUseCase(tutorsRepository)

  return useCase
}
