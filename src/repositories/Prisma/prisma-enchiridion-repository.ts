import { EnchiridionRepository } from '@/repositories/enchiridion-repository'
import { prisma } from '@/lib/prisma'
import { Prisma } from '@prisma/client'



export class PrismaEnchiridionRepository implements EnchiridionRepository {


  async findById(id: string) {
    const enchiridion = await prisma.enchiridion.findUnique({
      where: {
        id: id,
      },
    })

    return enchiridion
  }


  async createEnchiridion(data: Prisma.EnchiridionUncheckedCreateInput) {

    const enchiridion = await prisma.enchiridion.create({
      data,
    })

    return enchiridion
  }

  async findByIdAnimalEnchiridion(animalsId: string[]) {
    const enchiridions = await prisma.enchiridion.findMany({
      where: {
        animal_id: {
          in: animalsId,
        },
      },
    })

    return enchiridions
  }

  async findByIdUniqueAnimalEnchiridion(animal_id: string) {
    const enchiridion = await prisma.enchiridion.findMany({
      where: {
        animal_id: animal_id
      },
    })

    return enchiridion
  }




  async getAllEnchiridion(page: number, numberOfItems: number) {
    const skipItens = (page - 1) * numberOfItems

    const allEnchiridion = await prisma.enchiridion.findMany({
      take: numberOfItems,
      skip: skipItens,
      orderBy: {
        created_at: 'desc'
      }
    })

    return allEnchiridion
  }



  async findBySequenceEnchiridion(sequence: string) {
    const user = await prisma.enchiridion.findUnique({
      where: {
        sequence: sequence
      },
    })

    return user
  }

  async sequence(): Promise<string> {
    let nextSequence = await prisma.enchiridion.count() + 1

    let sequenceExists = true;

    while (sequenceExists) {
      const existingSequence = await prisma.enchiridion.findFirst({
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



  async updateEnchiridion(id: string, data: Prisma.EnchiridionUpdateInput) {

    const tutorUpdated = await prisma.enchiridion.update({
      where: {
        id: id
      },
      data
    });

    return tutorUpdated
  }



  async findEnchiridionById(id: string) {
    const user = await prisma.enchiridion.findUnique({
      where: {
        id,
      },
    })

    return user
  }

  async markAsDelete(id: string) {
    await prisma.enchiridion.update({
      where: {
        id: id
      },
      data: {
        status_delete: true
      }
    })
  }
}


