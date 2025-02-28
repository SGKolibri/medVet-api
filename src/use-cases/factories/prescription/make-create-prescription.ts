import { PrismaAnimalsRepository } from "@/repositories/Prisma/prisma-animals-repository";
import { PrismaMedicationRepository } from "@/repositories/Prisma/prisma-medication-repository";
import { PrismaPrescriptionRepository } from "@/repositories/Prisma/prisma-prescription-repository";
import { PrismaUsersRepository } from "@/repositories/Prisma/prisma-users-repository";
import { CreatePrescriptionUseCase } from "@/use-cases/prescription/createPrescription";

export function makeCreatePrescriptionUseCase() {
    const prescriptionRepository = new PrismaPrescriptionRepository()
    const aniamlRepository = new PrismaAnimalsRepository()
    const userRepository = new PrismaUsersRepository()
    const medicationRepository = new PrismaMedicationRepository()

    const useCase = new CreatePrescriptionUseCase(prescriptionRepository, aniamlRepository, userRepository,medicationRepository)

    return useCase
}
