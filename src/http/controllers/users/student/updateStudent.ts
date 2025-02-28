import { FastifyReply, FastifyRequest } from 'fastify'
import { z } from 'zod'
import { Validation } from '@/utils/validation'
import { MakeUpdateStudentUseCase } from '@/use-cases/factories/users/student/make-update-student';
import { NoExistsUsersError } from '@/use-cases/errors/user-error';


export async function updateStudent(request: FastifyRequest, reply: FastifyReply) {

	const registerBodySchema = z.object({
        id: z.string(),
        name: z.string(),
        email: z.string().email(),
        cpf: z.string().refine(Validation.isValidCPF, {
            message: "CPF inválido",
        }),
        password: z.string(),
        registration: z.string(),
        course: z.string().nullable(),
        shift: z.string().nullable(),
        period: z.string().nullable(),
        phone: z.string().nullable(),
    });

    const { id, name, email, cpf, password, registration, course, shift, period, phone } = registerBodySchema.parse(request.body);

	try {
		const updateUserCase = MakeUpdateStudentUseCase()

		await updateUserCase.execute({
            id,
			name,
            email,
            cpf,
            password,
            registration,
            course,
            period,
            shift,
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
