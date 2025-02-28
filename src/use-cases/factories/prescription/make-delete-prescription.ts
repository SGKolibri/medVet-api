import { MarkPrescriptionAsDeleteUseCase } from "@/use-cases/prescription/deletePrescription";
import { PrismaPrescriptionRepository } from "@/repositories/Prisma/prisma-prescription-repository";

export function MakeDeletePrescription() {
    const prescriptionRespository = new PrismaPrescriptionRepository()
    const UseCase = new MarkPrescriptionAsDeleteUseCase(prescriptionRespository)

    return UseCase
}