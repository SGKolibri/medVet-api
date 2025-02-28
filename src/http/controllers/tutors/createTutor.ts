import { TutorAlreadyExistsError } from '@/use-cases/errors/tutor-error';
import { FastifyReply, FastifyRequest } from 'fastify'
import { z } from 'zod'
import { makeRegisterUseCase } from '@/use-cases/factories/tutor/make-create-tutors';
import { Validation } from '@/utils/validation'


export async function createTutor(request: FastifyRequest, reply: FastifyReply) {

	const registerBodySchema = z.object({
		name: z.string(),
		cpf: z.string().refine(Validation.isValidCPForNull, {
			message: "CPF inválido",
		}),
		adress: z.string().nullable(),
		phone: z.string().refine(Validation.isValidPhoneNumber, {
			message: "Numero de contato inválido",
		}),
		email: z.union(
			[
				z.literal(''),
				z.string().email()
			]
		).nullable()
	});

	const { name, cpf, phone, email, adress } = registerBodySchema.parse(request.body);

	try {
		const registerUserCase = makeRegisterUseCase()

		await registerUserCase.execute({
			name,
			cpf,
			phone,
			email,
			adress
		})
	} catch (err) {
		if (err instanceof TutorAlreadyExistsError) {
			return reply.status(409).send({ message: err.message })
		}

		throw err
	}

	return reply.status(201).send()
}
