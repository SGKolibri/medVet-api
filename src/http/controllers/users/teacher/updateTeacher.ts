import { FastifyReply, FastifyRequest } from 'fastify'
import { z } from 'zod'
import { Validation } from '@/utils/validation'
import { MakeUpdateTeacherUseCase } from '@/use-cases/factories/users/teacher/make-update-teacher';
import { teacherNoexists } from '@/use-cases/errors/teacher-error';


export async function updateTeacher(request: FastifyRequest, reply: FastifyReply) {

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
        shift: z.string().nullable(), // Certifique-se de que este campo está definido como nullable
        phone: z.string().nullable(),
    });

    const { id, name, email, cpf, password, registration, course, shift, phone } = registerBodySchema.parse(request.body);

    try {
        const updateUserCase = MakeUpdateTeacherUseCase()

        await updateUserCase.execute({
            id,
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
        if (err instanceof teacherNoexists) {
            return reply.status(409).send({ message: err.message })
        }

        throw err
    }

    return reply.status(201)
}
