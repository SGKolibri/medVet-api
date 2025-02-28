import { searchAnimalByNameOrSequnce } from '@/use-cases/animal/getAnimals';
import { PrismaAnimalsRepository } from "@/repositories/Prisma/prisma-animals-repository";
import { PrismaTutorsRepository } from '@/repositories/Prisma/prisma-tutors-repository';

export function makeSearchAnimalByTutorBySequnce() {
        const prismaAnimalsRepository = new PrismaAnimalsRepository();
        const prismaTutorsRepository = new PrismaTutorsRepository()

        const useCase = new searchAnimalByNameOrSequnce(prismaAnimalsRepository, prismaTutorsRepository);

    
    return useCase
}

