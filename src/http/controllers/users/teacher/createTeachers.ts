import { FastifyReply, FastifyRequest } from 'fastify'
import { z } from 'zod'
import { makeRegisterUseCase } from '@/use-cases/factories/users/teacher/make-create-teachers';
import { UserAlreadyExistsError } from '@/use-cases/errors/user-error';
import { Validation } from '@/utils/validation'

export async function createTeacher(request: FastifyRequest, reply: FastifyReply)
 {
    const registerBodySchema = z.object({
        name: z.string(),
        email: z.union(
			[
				z.literal(''),
				z.string().email()
			]
		).nullable(),
        cpf: z.string().refine(Validation.isValidCPF, {
            message: "CPF inválido",
        }),
        password: z.string(),
        registration: z.string(),
        course: z.string().nullable(),
        shift: z.string().nullable(), // Certifique-se de que este campo está definido como nullable
        phone: z.string().nullable(),
    });

    const { name, email, cpf, password, registration, course, shift, phone } = registerBodySchema.parse(request.body);

    try {

        const registerUseCase = makeRegisterUseCase()

        await registerUseCase.execute({
            name,
            email,
            cpf,
            password,
            registration,
            course,
            shift,
            phone
        })
    } catch (err) {

        if (err instanceof UserAlreadyExistsError) {
            return reply.status(409).send({ message: err.message })
        }

        throw err
    }

    return reply.status(201).send()
}
