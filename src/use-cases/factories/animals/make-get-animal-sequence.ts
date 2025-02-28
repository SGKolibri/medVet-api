import { PrismaAnimalsRepository } from "@/repositories/Prisma/prisma-animals-repository";
import { GetAnimalBySequenceUseCase } from "@/use-cases/animal/getAnimals";

export function makeGetAnimalSequence() {
    const prismaAnimalsRepository = new PrismaAnimalsRepository()
    const useCase = new GetAnimalBySequenceUseCase(prismaAnimalsRepository)

    return useCase
}

