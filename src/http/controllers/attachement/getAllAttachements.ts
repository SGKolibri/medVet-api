import { FastifyReply, FastifyRequest } from 'fastify'
import { z } from 'zod'
import { makeGetAllAttachementUseCase } from '@/use-cases/factories/attachement/make-get-all-attachments';
import { AnimalNoexists } from '@/use-cases/errors/animal-errors';


export async function getAllAttachementController(request: FastifyRequest, reply: FastifyReply) {
	const getAllQuerySchema = z.object({
        animal_id: z.string(),  
		page: z.coerce.number(),
		numberOfItems: z.coerce.number()
	});

	const { animal_id, page, numberOfItems } = getAllQuerySchema.parse(request.query);

	try {

		const getAllAttachementUseCase = makeGetAllAttachementUseCase();
		const data = await getAllAttachementUseCase.execute(animal_id, page, numberOfItems);

		return data;

	} catch (err) {
        
        if (err instanceof AnimalNoexists) {
			return reply.status(409).send({ message: err.message })
		}

		throw err
	};
}