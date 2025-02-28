
import { vaccinationNotExistsError } from '@/use-cases/errors/vaccination-errors';
import { FastifyReply, FastifyRequest } from 'fastify'
import { z } from 'zod'
import { makeUpdateUseCase } from '@/use-cases/factories/vaccination/make-update-vaccination';

export async function updateVaccination(request: FastifyRequest, reply: FastifyReply) {

    const registerBodySchema = z.object({
        vaccinations: z.any()
    });

    const { vaccinations } = registerBodySchema.parse(request.body);


    try {
        const updateUserCase = makeUpdateUseCase()

     const Returnvaccinations =   await updateUserCase.execute(
            vaccinations
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
