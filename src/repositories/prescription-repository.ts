import { Prisma, Prescription } from "@prisma/client";

export interface PrescriptionRepository {
    createPrescription(data: Prisma.PrescriptionUncheckedCreateInput): Promise<Prescription>
    markAsDelete(id: string): any
    findById(id: string): Promise<Prescription | null>
    getPrescriptionByAnimalId(animal_id: string): Promise<Prescription[]>
    getAllPrescription(page: number): Promise<Prescription[]>

}