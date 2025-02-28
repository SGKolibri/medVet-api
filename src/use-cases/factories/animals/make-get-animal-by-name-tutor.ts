import { PrismaAnimalsRepository } from "@/repositories/Prisma/prisma-animals-repository";
import { PrismaTutorsRepository } from "@/repositories/Prisma/prisma-tutors-repository";
import { GetAnimalByNameTutorUseCase } from "@/use-cases/animal/getAnimals";

export function makeGetAnimalByNameTutor() {
    const prismaAnimalsRepository = new PrismaAnimalsRepository()
    const prismaTutorRepository = new PrismaTutorsRepository()
    const useCase = new GetAnimalByNameTutorUseCase(prismaAnimalsRepository, prismaTutorRepository)

    return useCase
}

