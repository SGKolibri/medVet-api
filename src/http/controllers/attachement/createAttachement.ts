import { FastifyReply, FastifyRequest } from 'fastify';
import { z } from 'zod';
import { makeAttachementUseCase } from '@/use-cases/factories/attachement/make_create_attachement';

export async function CreateAttchementController(request: FastifyRequest, reply: FastifyReply) {

  // console.log('Headers:', request.headers);
  // console.log('Body:', request.body);
  // console.log('Parts (files):', request.raw);



  // // const registerBodySchema = z.object({
  // //   animal_id: z.string(),
  // // });
  // const storage: any = request.body;
  // console.log("request eh esse", storage.animal_id.value);
  // // const { animal_id } = registerBodySchema.parse(request.body);

  // const animal_id = storage.animal_id.value;

  // const parts = request.parts();

  // let archive;
  // for await (const part of parts) {
  //   if (part.file) {
  //     // Captura o arquivo
  //     const buffers = [];
  //     for await (const chunk of part.file) {
  //       buffers.push(chunk);
  //     }
  //     const buffer = Buffer.concat(buffers);

  //     archive = {
  //       buffer,
  //       mimetype: part.mimetype,
  //       originalname: part.filename,
  //     };
  //     break;
  //   }
  // }

  // if (!archive) {
  //   return reply.status(400).send({ message: 'Arquivo não enviado' });
  // }

  try {
    const storage: any = request.body;

    // Validação básica
    if (!storage.animal_id || !storage.archive) {
      return reply.status(400).send({ message: 'Campos obrigatórios não fornecidos.' });
    }

    const animal_id = storage.animal_id.value;    //pegar  name também

    const name = storage.name.value;

    const archive = {
      buffer: storage.archive._buf, // Buffer do arquivo
      mimetype: storage.archive.mimetype, // Tipo MIME
      originalname: storage.archive.filename, // Nome original do arquivo 
    };

    // Processar o anexo usando o caso de uso
    const attachementUserCase = makeAttachementUseCase();

    const attachment = await attachementUserCase.execute({
      animal_id,
      archive,
      name
    });

    return reply.status(201).send(attachment);
  } catch (err) {
    console.error('Erro ao criar anexo:', err);
    return reply.status(500).send({ message: 'Erro interno do servidor' });
  }
}