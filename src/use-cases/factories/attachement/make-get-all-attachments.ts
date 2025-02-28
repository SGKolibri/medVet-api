import { PrismaAnimalsRepository } from '@/repositories/Prisma/prisma-animals-repository';
import { PrismaAttachementRepository } from '@/repositories/Prisma/prisma-attachement-repository';

import { CreateAttachmentUseCase } from '@/use-cases/attachments/createAttachements';
import { GetAllAttachmentUseCase } from '@/use-cases/attachments/getAllAttachmenst';

export function makeGetAllAttachementUseCase() {
  const attachementRepository = new PrismaAttachementRepository
const animalRepository = new PrismaAnimalsRepository
  const useCase = new GetAllAttachmentUseCase( attachementRepository,  animalRepository )

  return useCase
}