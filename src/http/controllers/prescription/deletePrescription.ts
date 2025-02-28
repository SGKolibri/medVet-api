import { MakeDeletePrescription } from "@/use-cases/factories/prescription/make-delete-prescription";
import { PrescriptionNoExist } from "@/use-cases/errors/prescription-errors";
import { FastifyReply, FastifyRequest } from "fastify";
import { z } from "zod";

export async function deletePrescription(request: FastifyRequest, reply: FastifyReply) {
    
    const DeleteBodySchema = z.object({
        id: z.string()
    })

    const { id } = DeleteBodySchema.parse(request.body)

    try{
        const deletePrescription = MakeDeletePrescription();

        await deletePrescription.execute(id)

    } catch(error) {
        if(error instanceof PrescriptionNoExist){
            return reply.status(409).send({message: error.message})
        }

        throw error;
    }

    return reply.status(200).send();
}