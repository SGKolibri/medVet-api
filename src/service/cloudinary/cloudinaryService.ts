import { v2 as cloudinary, UploadApiResponse } from 'cloudinary';
import { Readable } from 'stream';

// Configuração da Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

interface UploadedFile {
    buffer: Buffer;
    mimetype: string;
  }

export class CloudinaryService {
  // Método para fazer upload de imagens
  async uploadImage(file: UploadedFile, folder: string): Promise<string> {
    if (!file) {
      throw new Error('Arquivo inválido');
    }

    const uploadStream = (fileBuffer: Buffer): Promise<UploadApiResponse> => {
      return new Promise((resolve, reject) => {
        const stream = cloudinary.uploader.upload_stream(
          {
            folder, // Define a pasta no Cloudinary
          },
          (error, result) => {
            if (error) {
              return reject(error);
            }
            if (!result) {
              return reject(new Error('Resultado indefinido do Cloudinary'));
            }
            resolve(result);
          }
        );

        // Envia o buffer do arquivo para o stream
        Readable.from(fileBuffer).pipe(stream);
      });
    };

    // Faz upload e retorna a URL segura
    const result = await uploadStream(file.buffer);
    return result.secure_url;
  }

  // Método para extrair o Public ID de uma URL
  getPublicIdFromUrl(imageUrl: string): string {
    const segments = new URL(imageUrl).pathname.split('/');
    const publicIdWithExtension = `${segments[segments.length - 2]}/${segments[segments.length - 1]}`;
    return publicIdWithExtension.replace(/\.[^/.]+$/, ''); // Remove a extensão
  }

  // Método para deletar imagens
  async deleteImage(publicId: string): Promise<void> {
    const result = await cloudinary.uploader.destroy(publicId);
    if (result.result !== 'ok') {
      throw new Error(`Falha ao deletar imagem no Cloudinary. Public ID: ${publicId}`);
    }
  }
}