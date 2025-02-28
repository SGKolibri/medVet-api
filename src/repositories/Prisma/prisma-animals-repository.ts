import { AnimalRepository } from '@/repositories/animal-repository';
import { prisma } from '@/lib/prisma'
import { Prisma } from '@prisma/client'



export class PrismaAnimalsRepository implements AnimalRepository {

  async findById(id: string) {
    const animal = await prisma.animal.findUnique({
      where: {
        id,
      },
    })

    return animal
  }

  async findBySequence(sequence: string) {
    const user = await prisma.animal.findUnique({
      where: {
        sequence,
      },
    })

    return user
  }

  async findByNameAgeSpecies(name: string, age: string, species: string, tutor_id: string) {
    const user = await prisma.animal.findFirst({
      where: {
        name,
        age,
        species,
        tutor_id
      },
    })

    return user
  }

  async getAllAnimals(page: number, numberOfItems: number) {
    const skipTtens = (page - 1) * numberOfItems

    const animal = await prisma.animal.findMany({
      take: numberOfItems,
      skip: skipTtens,
    })

    return animal
  }

  async createAnimal(data: Prisma.AnimalUncheckedCreateInput) {
    const animal = await prisma.animal.create({
      data,
    })

    return animal.id
  }

  async findManyIdTutor(tutor_id: string) {

    const allanimals = await prisma.animal.findMany({
      where: {
        tutor_id: tutor_id
      },
    })

    return allanimals
  }

  async findByTutor(id: string) {
    const animal = await prisma.animal.findMany({
      where: {
        tutor_id: id
      },
    });

    return animal
  }

  async searchByNameAnimalorSequence(q: string, page: number) {
    const queryNormalized = q.toLowerCase();

    const animal = await prisma.animal.findMany({
      where: {
        OR: [
          {
            name: {
              startsWith: queryNormalized,
              mode: 'insensitive',
            },
          },
          {
            sequence: {
              startsWith: queryNormalized,
              mode: 'insensitive',
            },
          },
        ],
      },

      take:10,
      skip: (page- 1) * 10,
    });

    return animal;
  }

  async sequence(): Promise<string> {
    let nextSequence = await prisma.animal.count() + 1

    let sequenceExists = true;

    while (sequenceExists) {
      const existingSequence = await prisma.animal.findFirst({
        where: {
          sequence: nextSequence.toString(),
        },
      });

      if (!existingSequence) {
        sequenceExists = false;
      } else {
        nextSequence++;
      }
    }

    return nextSequence.toString();
  }

  async markAsDelete(id: string) {
    await prisma.animal.update({
      where: {
        id: id,
      },
      data: {
        status_delete: true
      }
    })
  }
}
