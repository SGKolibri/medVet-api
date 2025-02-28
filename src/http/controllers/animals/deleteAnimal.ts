import { MakeMarkAsDelete } from '@/use-cases/factories/animals/make-delete-animal'
import { AnimalNoexists } from '@/use-cases/errors/animal-errors'
import { z } from 'zod'
import { FastifyReply, FastifyRequest } from 'fastify'

export async function deleteAnimal(request: FastifyRequest, reply: FastifyReply) {
	const DeleteBodySchema = z.object({
		id: z.string()
	})

	const { id } = DeleteBodySchema.parse(request.body)

	try {
		const deleteAnimalUseCase = MakeMarkAsDelete()

		await deleteAnimalUseCase.execute(id)

		return reply.status(200).send()

	} catch (err) {
		if(err instanceof AnimalNoexists) {
			return reply.status(409).send({ message: err.message })
		}

		throw err
	}
}
