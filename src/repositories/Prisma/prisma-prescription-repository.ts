import { prisma } from "@/lib/prisma";
import { Prescription, Prisma } from "@prisma/client";
import { PrescriptionRepository } from "../prescription-repository";

export class PrismaPrescriptionRepository implements PrescriptionRepository {

    async findById(id: string): Promise<Prescription | null> {
        const prescription = await prisma.prescription.findUnique({
            where: {
                id: id
            }
        })
        
        return prescription
    }
    
    async createPrescription(data: Prisma.PrescriptionUncheckedCreateInput) {
        const prescription = await prisma.prescription.create({
            data,
        })
        return prescription
    }

    async markAsDelete(id: string) {
        await prisma.prescription.update({
            where: {
                id: id
            },
            data: {
                status_delete: true
            }
        })
    }
    async getPrescriptionByAnimalId(animla_id: string){
        const prescription = await prisma.prescription.findMany({
            where: {
                animal_id: animla_id
            }
        })
        return prescription
    }

    async getAllPrescription(page: number){
        const prescription = await prisma.prescription.findMany({
            take: 10,
            skip: (page - 1) * 10,
        })

        return prescription;
    }

}