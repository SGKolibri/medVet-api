import { Prisma, Attachment } from '@prisma/client'

export interface AttachementRepository {
  createAttachment(data: Prisma.AttachmentUncheckedCreateInput): Promise<Attachment>;

  getAllAttachmentsByAnimalId(
    animalId: string,
    page: number,
    numberOfItems: number
  ): Promise<Attachment[]>;
}
