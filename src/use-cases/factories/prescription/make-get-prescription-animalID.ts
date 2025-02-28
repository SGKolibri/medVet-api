import { PrismaAnimalsRepository } from "@/repositories/Prisma/prisma-animals-repository";
import { PrismaMedicationRepository } from "@/repositories/Prisma/prisma-medication-repository";
import { PrismaPrescriptionRepository } from "@/repositories/Prisma/prisma-prescription-repository";
import { GetPrescriptionByAnimalIdUseCase } from "@/use-cases/prescription/getPrescription";

export function makeGetPrescriptionByAnimalIdUseCase() {
    const prescriptionRepository = new PrismaPrescriptionRepository()
    const medicationRepository = new PrismaMedicationRepository()
    const animalRepository = new PrismaAnimalsRepository()

    const useCase = new GetPrescriptionByAnimalIdUseCase(prescriptionRepository, medicationRepository, animalRepository)

    return useCase
}
