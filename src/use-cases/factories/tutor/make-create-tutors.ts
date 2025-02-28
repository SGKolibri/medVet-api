import { PrismaTutorsRepository } from '@/repositories/Prisma/prisma-tutors-repository';
import { CreateTutorsUseCase } from '../../tutor/createTutor';

export function makeRegisterUseCase() {
  const tutorsRepository = new PrismaTutorsRepository()
  // const aniamalsRepository = new PrismaAnimalsRepository() 
  const useCase = new CreateTutorsUseCase(tutorsRepository)

  return useCase
}