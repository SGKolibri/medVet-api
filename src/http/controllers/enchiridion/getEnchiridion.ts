import { TutorNotExistsError } from '@/use-cases/errors/tutor-error';
import {EnchiridionNotExitsError } from '@/use-cases/errors/enchiridion-errors';
import { AnimalNoexists} from '@/use-cases/errors/animal-errors';
import { FastifyReply, FastifyRequest } from 'fastify'
import { z } from 'zod'
import { makegetTutorIdEnchiridionUseCase} from '@/use-cases/factories/enchiridion/make-get-enchridiun-by-tutor'
import { makegetAnimalIdEnchiridionUseCase} from '@/use-cases/factories/enchiridion/make-get-enchridiun-by-animal'
import {makegetAllEnchiridionUseCase} from '@/use-cases/factories/enchiridion/make-get-all-enchiridion'
import {makegetSequenceEnchiridionUseCase} from '@/use-cases/factories/enchiridion/make-get-enchridiun-sequence'
import { makegetIdEnchiridionUseCase } from '@/use-cases/factories/enchiridion/make-get-encchiridion-id';



export async function getEnchiridionByTutor(request: FastifyRequest, reply: FastifyReply) {

	const validateIdParamsSchema = z.object({
		tutor_id: z.string(),
	})


	const { tutor_id } = validateIdParamsSchema.parse(request.params)

	try {
		const getTutorIdEnchiridionUseCase =  makegetTutorIdEnchiridionUseCase()

		const data = await getTutorIdEnchiridionUseCase.execute({
			 tutor_id
		})

        return data


	} catch (err) {
		if (err instanceof TutorNotExistsError) {
			return reply.status(409).send({ message: err.message })
		}

		throw err
	}


}



export async function getEnchiridionByAnimal(request: FastifyRequest, reply: FastifyReply) {

	const validateIdParamsSchema = z.object({
		animal_id: z.string(),
	})


	const { animal_id } = validateIdParamsSchema.parse(request.params)

	try {
		const getAnimalIdEnchiridionUseCase =  makegetAnimalIdEnchiridionUseCase()

		const data = await getAnimalIdEnchiridionUseCase.execute({
			animal_id
		})

        return data


	} catch (err) {
		if (err instanceof AnimalNoexists) {
			return reply.status(409).send({ message: err.message })
		}

		throw err
	}


}




export async function getAllEnchiridion(request: FastifyRequest, reply: FastifyReply) {
	const getAllQuerySchema = z.object({
		page: z.coerce.number(),
		numberOfItems: z.coerce.number()
	});

	const { page, numberOfItems } = getAllQuerySchema.parse(request.query);

	try {

		const getEnchiridionUseCase = makegetAllEnchiridionUseCase();
		const data = await getEnchiridionUseCase.execute(page, numberOfItems);

		return data;

	} catch (err) {



		throw err
	};
}

export async function getSequenceEnchiridion(request: FastifyRequest, reply: FastifyReply) {
	const  validateSequenceParamsSchema = z.object({
		sequence: z.string(),
	})

	const { sequence} =  validateSequenceParamsSchema.parse(request.params)

	try {

		const getEnchiridionUseCase = makegetSequenceEnchiridionUseCase();
		const data = await getEnchiridionUseCase.execute(sequence);

		return data;

	} catch (err) {

		if (err instanceof EnchiridionNotExitsError) {
			return reply.status(409).send({ message: err.message })
		}

		throw err
	};
}

export async function getIdEnchiridion(request: FastifyRequest, reply: FastifyReply) {
	const  validateSequenceParamsSchema = z.object({
		id: z.string(),
	})

	const { id} =  validateSequenceParamsSchema.parse(request.params)

	try {

		const getEnchiridionUseCase = makegetIdEnchiridionUseCase();
		const data = await getEnchiridionUseCase.execute(id);

		return data;

	} catch (err) {

		if (err instanceof EnchiridionNotExitsError) {
			return reply.status(409).send({ message: err.message })
		}

		throw err
	};
}


