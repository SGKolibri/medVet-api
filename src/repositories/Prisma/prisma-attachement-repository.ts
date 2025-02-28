import { AttachementRepository } from "../attachement-repository";
import { prisma } from '@/lib/prisma'
import { Attachment, Prisma } from '@prisma/client'

export class PrismaAttachementRepository implements AttachementRepository{
 
    async createAttachment(data: Prisma.AttachmentUncheckedCreateInput): Promise<Attachment> {
        const attachement =  await prisma.attachment.create({
            data
        })
        return attachement
    }

    async getAllAttachmentsByAnimalId(
        animalId: string,
        page: number,
        numberOfItems: number
      ): Promise<Attachment[]> {
        const skip = (page - 1) * numberOfItems;
    
        const attachments = await prisma.attachment.findMany({
          where: { animal_id: animalId },
          skip,
          take: numberOfItems,
        });
    
        return attachments;
      }

}