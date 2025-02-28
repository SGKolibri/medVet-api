import { InvalidDateError } from '@/use-cases/errors/invalid-date-error';
import { AnimalNoexists } from '@/use-cases/errors/animal-errors';
import { teacherNoexists } from '@/use-cases/errors/teacher-error';
import { FastifyReply, FastifyRequest } from 'fastify'
import { z } from 'zod'
import { makeRegisterUseCase } from '@/use-cases/factories/enchiridion/make-create-enchiridion';
import { Validation } from '@/utils/weight-validate';

export async function createEnchiridion(request: FastifyRequest, reply: FastifyReply) {

    const registerBodySchema = z.object({
        vaccination: z.any(),
        stringDate: z.string(),
        animal_id: z.string(),
        teacher_id: z.string(),
        weight: z.number().refine(Validation.isValidWeight, {
			message: "Invalid weight",
		}),
        history: z.string().nullable(),
        reason_consult: z.string().nullable(),
        deworming: z.string().nullable(),
        date_deworming: z.string().nullable(),
        temperature: z.string().nullable(),
        frequency_cardiac: z.string().nullable(),
        frequency_respiratory: z.string().nullable(),
        dehydration: z.string().nullable(),
        lymph_node: z.string().nullable(),
        type_mucous: z.string().nullable(),
        whats_mucous: z.string().nullable(),
        skin_annex: z.string().nullable(),
        system_circulatory: z.string().nullable(),
        system_respiratory: z.string().nullable(),
        system_digestive: z.string().nullable(),
        system_locomotor: z.string().nullable(),
        system_nervous: z.string().nullable(),
        system_genitourinary: z.string().nullable(),
        others: z.string().nullable(),
        complementary_exams: z.string().nullable(),
        diagnosis: z.string().nullable(),
        trataments: z.string().nullable(),
        observations: z.string().nullable()
    });

    const { vaccination, animal_id, teacher_id, stringDate, history, reason_consult, deworming, date_deworming, temperature, frequency_cardiac, frequency_respiratory, dehydration, lymph_node, type_mucous, whats_mucous, skin_annex, system_circulatory, system_respiratory, system_digestive, system_locomotor, system_nervous, system_genitourinary, others, complementary_exams, diagnosis, trataments, observations, weight} = registerBodySchema.parse(request.body);


    try {
        const registerUserCase = makeRegisterUseCase()

        await registerUserCase.execute({
            animal_id, teacher_id, stringDate, history, reason_consult, vaccination, deworming, date_deworming, temperature, frequency_cardiac, frequency_respiratory, dehydration, lymph_node, type_mucous, whats_mucous, skin_annex, system_circulatory, system_respiratory, system_digestive, system_locomotor, system_nervous, system_genitourinary, others, complementary_exams, diagnosis, trataments, observations, weight 
        })
    } catch (err) {
        if (err instanceof InvalidDateError) {
            return reply.status(409).send({ message: err.message })
        }

        if (err instanceof AnimalNoexists) {
            return reply.status(409).send({ message: err.message })
        }

        if (err instanceof teacherNoexists) {
            return reply.status(409).send({ message: err.message })
        }

        throw err
    }

    return reply.status(201).send()
}
