import { PrismaTutorsRepository } from '@/repositories/Prisma/prisma-tutors-repository'
import { GetTutorByIdUseCase } from '@/use-cases/tutor/getTutors'

export function getidTutors() {
    const tutorsRepository = new PrismaTutorsRepository()
    const useCase = new GetTutorByIdUseCase(tutorsRepository)

    return useCase
}