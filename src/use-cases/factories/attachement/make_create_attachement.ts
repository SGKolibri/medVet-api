import { PrismaAttachementRepository } from '@/repositories/Prisma/prisma-attachement-repository';
import { CloudinaryService } from '@/service/cloudinary/cloudinaryService';
import { CreateAttachmentUseCase } from '@/use-cases/attachments/createAttachements';

export function makeAttachementUseCase() {
  const attachementRepository = new PrismaAttachementRepository
  const cloudinaryService = new  CloudinaryService
  const useCase = new CreateAttachmentUseCase( attachementRepository, cloudinaryService )

  return useCase
}