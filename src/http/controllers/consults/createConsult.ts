import { TutorAlreadyExistsError } from '@/use-cases/errors/tutor-error';
import { FastifyReply, FastifyRequest } from 'fastify'
import { z } from 'zod'
import { makeRegisterUseCase } from '@/use-cases/factories/consult/make-create-consult';
import { Validation } from '@/utils/validation'


export async function createConsult(request: FastifyRequest, reply: FastifyReply) {

	const registerBodySchema = z.object({
		stringDate: z.string(),
		nameAnimal: z.string(),
		phone: z.string().refine(Validation.isValidPhoneNumber, {
			message: "Numero de contato inválido",
		}),
		species: z.string(),
		description: z.string().nullable(),
		nameTutor: z.string(),
	});

	const { 
		nameAnimal, 
		stringDate, 
		description, 
		species, 
		phone, 
		nameTutor 
	} = registerBodySchema.parse(request.body);

	try {
		const registerUserCase = makeRegisterUseCase()

		const consult = await registerUserCase.execute({
			nameAnimal, 
			stringDate, 
			description, 
			species, 
			phone, 
			nameTutor
		})
		
		return consult
	} catch (err) {
		if (err instanceof TutorAlreadyExistsError) {
			return reply.status(409).send({ message: err.message })
		}

		throw err
	}

	
}
