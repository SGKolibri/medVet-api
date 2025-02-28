import { MakeMarkTutorAsDelete } from '@/use-cases/factories/tutor/make-delete-tutor';
import { TutorNotExistsError } from '@/use-cases/errors/tutor-error';
import { FastifyReply, FastifyRequest } from 'fastify'
import { z } from 'zod'
import { AnimalExist } from '@/use-cases/errors/animal-errors';


export async function deleteTutor(request: FastifyRequest, reply: FastifyReply) {

	const deleteBodySchema = z.object({
		id: z.string(),
	});

	const { id } = deleteBodySchema.parse(request.body);

	try {
		const deleteUserCase = MakeMarkTutorAsDelete()

		await deleteUserCase.execute(id)
	} catch (err) {

		if (err instanceof TutorNotExistsError) {
			return reply.status(409).send({ message: err.message })
		}

		if (err instanceof AnimalExist) {
			return reply.status(409).send({ message: err.message })
		}

		throw err
	}

	return reply.status(200).send()
}
