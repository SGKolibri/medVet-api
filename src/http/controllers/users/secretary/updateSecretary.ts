import { FastifyReply, FastifyRequest } from 'fastify'
import { z } from 'zod'
import { Validation } from '@/utils/validation'
import { MakeUpdateSecretaryUseCase } from '@/use-cases/factories/users/secretary/make-update-secretary';
import { NoExistsUsersError } from '@/use-cases/errors/user-error';


export async function updateSecretary(request: FastifyRequest, reply: FastifyReply) {

	const registerBodySchema = z.object({
        id: z.string(),
        name: z.string(),
        email: z.string().email(),
        cpf: z.string().refine(Validation.isValidCPF, {
            message: "CPF inválido",
        }),
        password: z.string(),
        phone: z.string().nullable(),
    });

    const { id, name, email, cpf, password, phone } = registerBodySchema.parse(request.body);

	try {
		const updateUserCase = MakeUpdateSecretaryUseCase()

		await updateUserCase.execute({
            id,
			name,
            email,
            cpf,
            password,
            phone
		})
	} catch (err) {
		if (err instanceof NoExistsUsersError) {
			return reply.status(409).send({ message: err.message })
		}

		throw err
	}

	return reply.status(201).send()
}
