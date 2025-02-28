import { PrismaAnimalsRepository } from "@/repositories/Prisma/prisma-animals-repository";
import { PrismaMedicationRepository } from "@/repositories/Prisma/prisma-medication-repository";
import { PrismaPrescriptionRepository } from "@/repositories/Prisma/prisma-prescription-repository";
import { PrismaTutorsRepository } from "@/repositories/Prisma/prisma-tutors-repository";
import { PrismaUsersRepository } from "@/repositories/Prisma/prisma-users-repository";
import { GetPrescriptionByIdUseCase } from "@/use-cases/prescription/getPrescription";

export function makePdfPrescriptionUseCase() {
    const prescriptionRepository = new PrismaPrescriptionRepository()
    const medicationRepository = new PrismaMedicationRepository()
    const animalRepository = new PrismaAnimalsRepository()
    const teacherRepository = new PrismaUsersRepository()
    const tuturRepository = new PrismaTutorsRepository()

    const useCase = new GetPrescriptionByIdUseCase(prescriptionRepository, medicationRepository,animalRepository, teacherRepository, tuturRepository)

    return useCase
}
