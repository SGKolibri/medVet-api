import { FastifyRequest, FastifyReply } from "fastify";
import { PrismaAnimalsRepository } from "@/repositories/Prisma/prisma-animals-repository";
import { GetAllAnimalsUseCase } from "@/use-cases/animal/getAnimals";
import { z } from "zod";
import { AnimalNoexists } from "@/use-cases/errors/animal-errors";
import { makeGetAnimalId } from "@/use-cases/factories/animals/make-get-animal-id";
import { makeGetByTutorAnimalUseCase } from "@/use-cases/factories/animals/make-get-by-tutor-animal";
import { TutorNotExistsError } from "@/use-cases/errors/tutor-error";
import { makeGetAnimalSequence } from "@/use-cases/factories/animals/make-get-animal-sequence";
import { makeGetAnimalByNameTutor } from "@/use-cases/factories/animals/make-get-animal-by-name-tutor";
import { PrismaTutorsRepository } from "@/repositories/Prisma/prisma-tutors-repository"
import { PrismaWeightRepository } from "@/repositories/Prisma/prisma-weight-repository";
import { makeSearchAnimalByTutorBySequnce } from "@/use-cases/factories/animals/make-search-animal-sequence";


interface Params {
    id: string;
    sequence: string;
    name: string
}



export async function getAllAnimals(request: FastifyRequest, reply: FastifyReply) {
    const getQuerySchema = z.object({
        page: z.coerce.number(),
        numberOfItems: z.coerce.number()
    });
    const { page, numberOfItems } = getQuerySchema.parse(request.query);

    try {
        const prismaAnimalsRepository = new PrismaAnimalsRepository()
        const prismaTutorsRepository = new PrismaTutorsRepository()
        const prismaWeightRepository = new PrismaWeightRepository()
        const getAnimalsUseCase = new GetAllAnimalsUseCase(prismaAnimalsRepository, prismaTutorsRepository, prismaWeightRepository)

        const users = await getAnimalsUseCase.execute(page, numberOfItems)

        return reply.status(200).send(users)
    } catch (error) {
        if (error instanceof AnimalNoexists) {
            return reply.status(404).send({ message: error.message })
        }
    }
}


export async function getAnimalById(request: FastifyRequest<{ Params: Params }>, reply: FastifyReply) {
    const { id } = request.params
    const getAnimalByIdUseCase = makeGetAnimalId()

    try {
        const user = await getAnimalByIdUseCase.execute(id)

        return reply.status(200).send(user)

    } catch (err) {
        if (err instanceof AnimalNoexists) {
            return reply.status(404).send({ message: err.message })
        }
        throw err
    }
}

export async function getAnimalsByTutor(request: FastifyRequest, reply: FastifyReply) {
    const getQuerySchema = z.object({
        tutor_id: z.string()
    });

    const { tutor_id } = getQuerySchema.parse(request.params)

    try {
        const getusecase = makeGetByTutorAnimalUseCase()

        const animals = await getusecase.execute(tutor_id)

        return reply.status(200).send(animals)
    } catch (error) {
        if (error instanceof TutorNotExistsError) {
            return reply.status(404).send({ message: error.message })
        }

        if(error instanceof AnimalNoexists) {
            return reply.status(404).send({ message: error.message })
        }
        throw error
    }
}

export async function getAnimalBySequence(request: FastifyRequest<{ Params: Params }>, reply: FastifyReply) {
    const { sequence } = request.params
    const getAnimalBySequenceUseCase = makeGetAnimalSequence()

    try {
        const user = await getAnimalBySequenceUseCase.execute(sequence)
        return reply.status(200).send(user)

    } catch (err) {
        if (err instanceof AnimalNoexists) {
            return reply.status(404).send({ message: err.message })
        }
        throw err
    }
}

export async function getAnimalByNameTutor(request: FastifyRequest<{ Params: Params }>, reply: FastifyReply) {
    const { name } = request.params
    const getAnimalByNameTutorUseCase = makeGetAnimalByNameTutor()


    try {
        const user = await getAnimalByNameTutorUseCase.execute(name)
        return reply.status(200).send(user)

    } catch (err) {
        if (err instanceof TutorNotExistsError) {
            return reply.status(404).send({ message: 'Animal or tutor no exists' })
        }

        throw err
    }
}

export async function searchAnimalByNameOrSequnce(request: FastifyRequest, reply: FastifyReply) {
    const searchParmsSchema = z.object({
        q: z.string(),
        page: z.coerce.number().min(1).default(1)
    });

    try {
        const { q , page} = searchParmsSchema.parse(request.query);

        const useCase = makeSearchAnimalByTutorBySequnce();
        const data = await useCase.execute(q, page);
        
        return reply.status(200).send(data);
    } catch (err) {
        if (err instanceof AnimalNoexists) {
            return reply.status(404).send({ message: err.message });
        }
        throw err;
    }
}