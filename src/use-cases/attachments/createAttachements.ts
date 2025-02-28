import { AttachementRepository } from '@/repositories/attachement-repository';

import { Attachment, Tutor } from '@prisma/client'
import { CloudinaryService } from '@/service/cloudinary/cloudinaryService';

interface UploadedFile {
    buffer: Buffer;       // Contém os dados do arquivo como um buffer
    mimetype: string;     // Define o tipo MIME do arquivo (ex.: 'image/jpeg', 'image/png')
    originalname?: string; // Opcional: Nome original do arquivo
  }


interface AttachementUseCaseRequest {
    animal_id: string,
    archive: UploadedFile
    name: string

}


export class CreateAttachmentUseCase {
    constructor(
        private attachmentRepository: AttachementRepository,
        private cloudinaryService: CloudinaryService
    ) { }


    async execute({
        animal_id,
        archive,
        name
    }: AttachementUseCaseRequest): Promise<Attachment> {

        if (!archive) {
            throw new Error('Arquivo inválido');
        }

        const folder = 'attachments'; // Define a pasta no Cloudinary
        const url = await this.cloudinaryService.uploadImage(archive, folder);

        const url_archive = url
        const attachment = await this.attachmentRepository.createAttachment({
            animal_id,
            url_archive,
            name

        });

        return attachment
    }
}
