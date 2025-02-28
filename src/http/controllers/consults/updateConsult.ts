import { MakeUpdateConsultUseCase } from '@/use-cases/factories/consults/make-update-consult';
import { ConsultsNotExistsError } from '@/use-cases/errors/consult-error';
import { FastifyReply, FastifyRequest } from 'fastify'
import { z } from 'zod'
import { Validation } from '@/utils/validation'


export async function updateConsult(request: FastifyRequest, reply: FastifyReply) {

	const updateBodySchema = z.object({
		id: z.string(),
		nameAnimal: z.string(),
		species: z.string(),
		stringDate: z.string().refine(Validation.isValidDate, {
			message: "data inválida"
		}),
		description: z.string().nullable()
	});


	const { id, nameAnimal, species, stringDate, description } = updateBodySchema.parse(request.body);

	try {
		const updateUserCase = MakeUpdateConsultUseCase()

		await updateUserCase.execute({
			id,
			nameAnimal,
			species,
			stringDate,
			description,
		})
	} catch (err) {
		if (err instanceof ConsultsNotExistsError) {
			return reply.status(409).send({ message: err.message })
		}

		throw err
	}

	return reply.status(201).send()
}
