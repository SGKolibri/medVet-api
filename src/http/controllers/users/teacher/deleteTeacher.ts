import { makeDeleteUseCase } from '@/use-cases/factories/users/teacher/make-delete-teacher';
import { NoExistsUsersError } from '@/use-cases/errors/user-error';
import { FastifyReply, FastifyRequest } from 'fastify'
import { z } from 'zod'


export async function deleteTeacher(request: FastifyRequest, reply: FastifyReply) {

	const patchBodySchema = z.object({
		id: z.string(),
	});

	const { id }= patchBodySchema.parse(request.body);

	try {
		const deleteUserCase = makeDeleteUseCase()

		await deleteUserCase.execute(id)

		return reply.status(200).send()

	} catch (err) {
		if (err instanceof NoExistsUsersError) {
			return reply.status(409).send({ message: err.message })
		}

		throw err
	}

}
