import { PrismaAnimalsRepository } from '@/repositories/Prisma/prisma-animals-repository';
import { PrismaTutorsRepository } from '@/repositories/Prisma/prisma-tutors-repository'
import { MarkTutorAsDeleteUseCase } from '@/use-cases/tutor/deleteTutor'

export function MakeMarkTutorAsDelete() {
  const tutorsRepository = new PrismaTutorsRepository()
  const animalsRepository = new PrismaAnimalsRepository()
  const useCase = new  MarkTutorAsDeleteUseCase(tutorsRepository, animalsRepository)

  return useCase
}
