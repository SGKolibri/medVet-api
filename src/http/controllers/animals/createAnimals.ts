import { TutorNotExistsError } from '@/use-cases/errors/tutor-error';
import { FastifyReply, FastifyRequest } from 'fastify'
import { z } from 'zod'
import { makeCreateAnimalUseCase } from '@/use-cases/factories/animals/make-create-animal';
import { AnimalAlreadyExistsError } from '@/use-cases/errors/animal-errors';


export async function createAnimals(request: FastifyRequest, reply: FastifyReply) {

	const validateIdParamsSchema = z.object({
		tutor_id: z.string(),
	})



	const animalsCreateBodySchema = z.object({
		name: z.string().min(1, { message: "Name cannot be empty" }),
		species: z.string().min(1, { message: "Species cannot be empty" }),
		age: z.string().min(1, { message: "Age cannot be empty" }),
		gender: z.string().min(1, { message: "Gender cannot be empty" }),
		coat: z.string().nullable(),
		race: z.string().nullable(),

	});



	const { name, species, race, gender, age, coat, } = animalsCreateBodySchema.parse(request.body);
	const { tutor_id } = validateIdParamsSchema.parse(request.params)

	try {
		const createAnimalUserCase = makeCreateAnimalUseCase()

		const animal = await createAnimalUserCase.execute({
			name, species, race, gender, age, coat, tutor_id
		})

		return reply.status(201).send(animal)

	} catch (err) {
		if (err instanceof TutorNotExistsError) {
			return reply.status(409).send({ message: err.message })
		}
		if (err instanceof AnimalAlreadyExistsError) {
			return reply.status(409).send({ message: err.message })
		}

		throw err
	}
}
