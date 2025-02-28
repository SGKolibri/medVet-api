import { getAllConsultsUseCase } from '@/use-cases/factories/consult/make-get-consults';
import { FastifyReply, FastifyRequest } from 'fastify'
import { ConsultsNotExistsError, getAllConsultsError } from '@/use-cases/errors/consult-error';
import { PrismaConsultsRepository } from '@/repositories/Prisma/prisma-consults-repository';
import { GetConsultBySequenceUseCase } from '@/use-cases/consult/getConsults';

interface Params {
	sequence: string;
}

export async function getAllConsults(request: FastifyRequest, reply: FastifyReply) {
	try {

		const getAllConsults = getAllConsultsUseCase();
		const data = await getAllConsults.execute();

		return data;

	} catch (err) {
		if (err instanceof getAllConsultsError) {
			return reply.status(404).send({ message: err.message })
		}

		throw err
	};
}

export async function getConsultBySequence(request: FastifyRequest<{ Params: Params }>, reply: FastifyReply) {
	try {
		const prismaConsultRepository = new PrismaConsultsRepository();
		const getConsultBySequenceUseCase = new GetConsultBySequenceUseCase(prismaConsultRepository)

		const { sequence } = request.params;

		const user = await getConsultBySequenceUseCase.execute(sequence);

		return reply.status(200).send({
			user: {
				...user,
			}
		});
	} catch (err) {
		if (err instanceof ConsultsNotExistsError) {
			return reply.status(404).send({ message: err.message })
		}

		throw err

	}
}
