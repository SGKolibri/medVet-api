
import { EnchiridionNotExitsError } from '@/use-cases/errors/enchiridion-errors';
import { FastifyReply, FastifyRequest } from 'fastify'
import { z } from 'zod'
import { makeUpdateUseCase } from '@/use-cases/factories/enchiridion/make-update-enchiridion';
import { Validation } from '@/utils/weight-validate';

export async function updateEnchiridion(request: FastifyRequest, reply: FastifyReply) {

    const registerBodySchema = z.object({
        stringDate: z.string(),
        id: z.string(),
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
        observations: z.string().nullable(),
        vaccination: z.any(),
    });

    const { id,  animal_id, teacher_id, stringDate, history, reason_consult, deworming, date_deworming, temperature, frequency_cardiac, frequency_respiratory, dehydration, lymph_node, type_mucous, whats_mucous, skin_annex, system_circulatory, system_respiratory, system_digestive, system_locomotor, system_nervous, system_genitourinary, others, complementary_exams, diagnosis, trataments, observations, weight, vaccination} = registerBodySchema.parse(request.body);


    try {
        const updateUserCase = makeUpdateUseCase()

        await updateUserCase.execute({
           id, animal_id, teacher_id, stringDate, history, reason_consult, deworming, date_deworming, temperature, frequency_cardiac, frequency_respiratory, dehydration, lymph_node, type_mucous, whats_mucous, skin_annex, system_circulatory, system_respiratory, system_digestive, system_locomotor, system_nervous, system_genitourinary, others, complementary_exams, diagnosis, trataments, observations, weight, vaccination 
        })
    } catch (err) {
        if (err instanceof EnchiridionNotExitsError) {
            return reply.status(409).send({ message: err.message })
        }

        throw err
    }

    return reply.status(201).send()
}
