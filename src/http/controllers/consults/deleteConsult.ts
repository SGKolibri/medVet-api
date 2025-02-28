import { MakeDeleteConsultUseCase } from '@/use-cases/factories/consult/make-delete-consult';
import { FastifyReply, FastifyRequest } from 'fastify'
import { z } from 'zod'
import { ConsultsNotExistsError } from '@/use-cases/errors/consult-error';


export async function deleteConsult(request: FastifyRequest, reply: FastifyReply) {

	const updateBodySchema = z.object({
		id: z.string(),
	});

	const { id } = updateBodySchema.parse(request.body);

	try {
		const updateUserCase = MakeDeleteConsultUseCase()

		await updateUserCase.execute(id)
	} catch (err) {
		if (err instanceof ConsultsNotExistsError) {
			return reply.status(409).send({ message: err.message })
		}

		throw err
	}

	return reply.status(200).send()
}
