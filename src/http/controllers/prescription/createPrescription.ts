import { AnimalNoexists } from "@/use-cases/errors/animal-errors";
import { teacherNoexists } from "@/use-cases/errors/teacher-error";
import { makeCreatePrescriptionUseCase } from "@/use-cases/factories/prescription/make-create-prescription";
import { FastifyReply, FastifyRequest } from "fastify";
import { z } from "zod";

export async function createPrescription(request: FastifyRequest, reply: FastifyReply) {
    const validateIdParamsSchema = z.object({
        animal_id: z.string(),
        teacher_id: z.string(),
        medications: z.any()
    });

    const { animal_id, teacher_id, medications } = validateIdParamsSchema.parse(request.body);

    try {
        const createPrescriptionUseCase = makeCreatePrescriptionUseCase();

        const {prescription} = await createPrescriptionUseCase.execute({
            animal_id,
            teacher_id,
            medications
        });


        return reply.status(201).send(prescription.id);
        
    } catch (error) {
        if (error instanceof teacherNoexists || error instanceof AnimalNoexists){
            return reply.status(409).send({ message: error.message });
        }
        throw error;
    }
}
