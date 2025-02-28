import { MakeUpdateTutorUseCase } from '@/use-cases/factories/tutor/make-update-tutors';
import { TutorNotExistsError } from '@/use-cases/errors/tutor-error';
import { FastifyReply, FastifyRequest } from 'fastify'
import { z } from 'zod'
import { Validation } from '@/utils/validation'


export async function updateTutor(request: FastifyRequest, reply: FastifyReply) {

	const updateBodySchema = z.object({
		id: z.string(),
		name: z.string(),
		cpf: z.string().refine(Validation.isValidCPF, {
			message: "CPF inválido",
		}),
		adress: z.string().nullable(),
		phone: z.string().refine(Validation.isValidPhoneNumber, {
			message: "Numero de contato inválido",
		}),
		email: z.string().email().nullable()
	});

	const { id, name, cpf, phone, email, adress } = updateBodySchema.parse(request.body);

	try {
		const updateUserCase = MakeUpdateTutorUseCase()

		await updateUserCase.execute({
			id,
			name,
			cpf,
			phone,
			email,
			adress
		})
	} catch (err) {
		if (err instanceof TutorNotExistsError) {
			return reply.status(409).send({ message: err.message })
		}

		throw err
	}

	return reply.status(201).send()
}
