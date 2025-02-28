import { TutorNotExistsError } from '@/use-cases/errors/tutor-error';
import { FastifyReply, FastifyRequest } from 'fastify'
import { z } from 'zod'
import { makeRegisterUseCase } from '@/use-cases/factories/consult/make-createExistTutorConsults';
import { Validation } from '@/utils/validation'


export async function createExistTutorConsultsUseCase(request: FastifyRequest, reply: FastifyReply) {

	const validateIdParamsSchema = z.object({
		tutor_id: z.string(),
	})



	const registerBodySchema = z.object({
		nameAnimal: z.string(),
		species: z.string(),
		stringDate: z.string(),
		phone: z.string().refine(Validation.isValidPhoneNumber, {
			message: "Numero de contato inválido",
		}),

		description: z.string().nullable(),

	});

	const { nameAnimal, stringDate, description, species, phone } = registerBodySchema.parse(request.body);
	const { tutor_id } = validateIdParamsSchema.parse(request.params)

	try {
		const registerUserCase = makeRegisterUseCase()

		await registerUserCase.execute({
			nameAnimal, stringDate, description, species, phone, tutor_id
		})
	} catch (err) {
		if (err instanceof TutorNotExistsError) {
			return reply.status(409).send({ message: err.message })
		}

		throw err
	}

	return reply.status(201).send()
}
