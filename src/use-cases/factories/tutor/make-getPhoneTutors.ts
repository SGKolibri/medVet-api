import { SearchPhoneTutorUseCase } from "@/use-cases/tutor/getTutors"
import { PrismaTutorsRepository } from '@/repositories/Prisma/prisma-tutors-repository'

export function getPhoneTutors() {
  const tutorsRepository = new PrismaTutorsRepository()
  const useCase = new SearchPhoneTutorUseCase(tutorsRepository)

  return useCase
}
