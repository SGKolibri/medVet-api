import { FastifyReply, FastifyRequest } from 'fastify'
import { MakeMarkEnchiridionAsDelete } from '@/use-cases/factories/enchiridion/make-delete-enchiridion'
import { z } from 'zod'
import { EnchiridionNotExitsError } from '@/use-cases/errors/enchiridion-errors'

export async function DeleteEnchiridion(request: FastifyRequest, reply: FastifyReply) {
    const validateBody = z.object({
        id: z.string()
    })

    const { id } = validateBody.parse(request.body)

    try {
        const deleteEchiridionUseCase = MakeMarkEnchiridionAsDelete()

        await deleteEchiridionUseCase.execute(id)

        return reply.status(200).send()
    } catch(err) {
        if (err instanceof EnchiridionNotExitsError) {
            return reply.status(409).send({message: err.message})
        }

        throw err
    }
}
