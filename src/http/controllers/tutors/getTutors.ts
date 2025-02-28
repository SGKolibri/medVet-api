import { getAllTutorUseCase } from '@/use-cases/factories/tutor/make-getall-tutors';
import { FastifyReply, FastifyRequest } from 'fastify'
import { getAllTutorsError, TutorNotExistsError } from '@/use-cases/errors/tutor-error';
import { z } from 'zod';
import { getNameTutors } from '@/use-cases/factories/tutor/make-get-name-tutor';
import { getPhoneTutors } from '@/use-cases/factories/tutor/make-getPhoneTutors'
import { getidTutors } from '@/use-cases/factories/tutor/make-get-id-tutor';


export async function getAllTutors(request: FastifyRequest, reply: FastifyReply) {
	const getAllQuerySchema = z.object({
		page: z.coerce.number(),
		numberOfItems: z.coerce.number()
	});

	const { page, numberOfItems } = getAllQuerySchema.parse(request.query);

	try {

		const getTutorUseCase = getAllTutorUseCase();
		const data = await getTutorUseCase.execute(page, numberOfItems);

		return reply.status(200).send(data)

	} catch (err) {
		if (err instanceof getAllTutorsError) {
			return reply.status(404).send({ message: err.message })
		}
		throw err
	};
}


export async function getTutorByName(request: FastifyRequest, reply: FastifyReply) {
	const searchTutorQuerySchema = z.object({
		q: z.string(),
		page: z.coerce.number().min(1).default(1),
	})


	const { q, page } = searchTutorQuerySchema.parse(request.query)
	try {
		const queryWithoutSpaces = q.replace('-', ' ')

		const searchNameTutorUseCase = getNameTutors()

		const tutors = await searchNameTutorUseCase.execute(
			queryWithoutSpaces,
			page,
		)

		return reply.status(200).send({
			tutors,
		})

	} catch (err) {
		if (err instanceof getAllTutorsError) {
			return reply.status(404).send({ message: err.message })
		}
		throw err

	}
}

export async function searchPhoneTutors(request: FastifyRequest, reply: FastifyReply) {
	const searchGymsQuerySchema = z.object({
		q: z.string(),
		page: z.coerce.number().min(1).default(1),
	})

	try {
		const { q, page } = searchGymsQuerySchema.parse(request.query)

		const searchPhoneTutorUseCase = getPhoneTutors()

		const tutors = await searchPhoneTutorUseCase.execute(
			q, page
		)

		return reply.status(200).send({
			tutors,
		})

	} catch (err) {
		if (err instanceof getAllTutorsError) {
			return reply.status(404).send({ message: err.message })
		}
		throw err

	}

}



	export async function getIdTutor(request: FastifyRequest, reply: FastifyReply) {
		const  validateSequenceParamsSchema = z.object({
			id: z.string(),
		})
	
		const { id } =  validateSequenceParamsSchema.parse(request.params)
	
		try {
	
			const getTutorUseCase = getidTutors();
			const data = await getTutorUseCase.execute(id);
	
			return data;
	
		} catch (err) {
	
			if (err instanceof TutorNotExistsError) {
				return reply.status(409).send({ message: err.message })
			}
	
			throw err
		};
	

}
