import { PrismaTutorsRepository } from './../../../repositories/Prisma/prisma-tutors-repository';
import { PrismaAnimalsRepository } from "@/repositories/Prisma/prisma-animals-repository";
import { GetAnimalById } from "@/use-cases/animal/getAnimals";

export function makeGetAnimalId() {
    const prismaAnimalsRepository = new PrismaAnimalsRepository()
    const prismaTutorsRepository = new PrismaTutorsRepository()
    const useCase = new GetAnimalById(prismaAnimalsRepository, prismaTutorsRepository)

    return useCase
}

