import { PrismaTutorsRepository } from '@/repositories/Prisma/prisma-tutors-repository'
import { SearchTutorByNameUseCase } from '@/use-cases/tutor/getTutors'

export function getNameTutors() {
    const tutorsRepository = new PrismaTutorsRepository()
    const useCase = new SearchTutorByNameUseCase(tutorsRepository)

    return useCase
}
