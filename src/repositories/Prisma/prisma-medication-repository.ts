import { prisma } from "@/lib/prisma";
import { MedicationRepository } from "../medication-repository";


export class PrismaMedicationRepository implements MedicationRepository {

    async createMedication(data: any) {
        const medication = await prisma.medication.create({
            data,
        })

        return medication
    }

    async findMedicationsByPrescriptionId(prescription_id: string){
        const medications = await prisma.medication.findMany({
            where: { 
                prescription_id
             },
        });

        return medications;
    }
}