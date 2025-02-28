
import { vaccinationNotExistsError } from '@/use-cases/errors/vaccination-errors';
import { FastifyReply, FastifyRequest } from 'fastify'
import { z } from 'zod'
import { makeUpdateUseCase } from '@/use-cases/factories/vaccination/make-update-vaccination';
import { makeDeleteUseCase } from '@/use-cases/factories/vaccination/make-delete-vaccination';

export async function deleteVaccination(request: FastifyRequest, reply: FastifyReply) {

    const registerBodySchema = z.object({
        ids: z.array(z.string())
    });

    const { ids } = registerBodySchema.parse(request.body);


    try {
        const deleteUserCase = makeDeleteUseCase()

     const Returnvaccinations = await deleteUserCase.execute(
            ids
        )

        return Returnvaccinations

    } catch (err) {
        if (err instanceof vaccinationNotExistsError) {
            return reply.status(409).send({ message: err.message })
        }

        throw err
    }

    return reply.status(201).send()
}