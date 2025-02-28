import { PrismaPrescriptionRepository } from "@/repositories/Prisma/prisma-prescription-repository";
import { GetAllPrescription } from "@/use-cases/prescription/getPrescription";

export function makeGetAllPrescriptionUseCase() {
    const prescriptionRepository = new PrismaPrescriptionRepository()
    const useCase = new GetAllPrescription(prescriptionRepository)

    return useCase
}
