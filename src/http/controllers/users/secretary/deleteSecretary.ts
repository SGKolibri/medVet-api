import { makeMarkAsDeleteUseCase } from '@/use-cases/factories/users/secretary/make-delete-secretary';
import { NoExistsUsersError } from '@/use-cases/errors/user-error';
import { FastifyReply, FastifyRequest } from 'fastify'
import { z } from 'zod'


export async function deleteSecretary(request: FastifyRequest, reply: FastifyReply) {

	const deleteBodySchema = z.object({
		id: z.string(),
	});

	const { id } = deleteBodySchema.parse(request.body);

	try {
		const deleteUserCase = makeMarkAsDeleteUseCase()

		await deleteUserCase.execute({
			id
		})
	} catch (err) {
		if (err instanceof NoExistsUsersError) {
			return reply.status(409).send({ message: err.message })
		}

		throw err
	}

	return reply.status(200).send()
}
