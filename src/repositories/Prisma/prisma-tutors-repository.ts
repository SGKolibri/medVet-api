import { TutorRepository } from "@/repositories/tutors-repository";
import { prisma } from "@/lib/prisma";
import { Prisma, Tutor } from "@prisma/client";
import { dataGetAllTutor } from "@/@types/return-type";

export class PrismaTutorsRepository implements TutorRepository {
  async findById(id: string) {
    const tutor = await prisma.tutor.findUnique({
      where: {
        id: id,
      },
    });

    return tutor;
  }

  async findByCpfTutor(cpf: string) {
    const tutor = await prisma.tutor.findUnique({
      where: {
        cpf,
      },
    });

    return tutor;
  }

  async findByPhoneTutor(phone: string) {
    const tutor = await prisma.tutor.findFirst({
      where: {
        phone,
      },
    });

    return tutor;
  }

  async searchByNameTutor(query: string) {
    const queryNormalized = query.toLowerCase();

    const tutors = await prisma.tutor.findMany({
      where: {
        name: {
          contains: queryNormalized,
          mode: "insensitive",
        },
      },
    });

    return tutors;
  }

  async findByPhoneandNameTutor(phone: string, name: string) {
    const tutor = await prisma.tutor.findFirst({
      where: {
        name,
        phone,
      },
    });

    return tutor;
  }
  async createTutor(data: Prisma.TutorCreateInput) {
    console.log("data: ", data);

    // Não precisamos mais buscar a sequência, pois o campo não é mais obrigatório
    // O ID será gerado automaticamente pelo Prisma

    const uniqueData = { ...data };
    if (!uniqueData.cpf) {
      uniqueData.cpf = `placeholder-cpf-${Date.now()}-${Math.random()
        .toString(36)
        .substring(2, 7)}`;
    }
    if (!uniqueData.email) {
      uniqueData.email = `placeholder-email-${Date.now()}-${Math.random()
        .toString(36)
        .substring(2, 7)}`;
    }

    // Usar o método sequence para gerar um número sequencial único se necessário
    const nextSequence = await this.sequence();

    const tutor = await prisma.tutor.create({
      data: {
        ...uniqueData,
        sequence: nextSequence, // O campo sequence agora é opcional
      },
    });

    return tutor;
  }

  async getAllTutors(
    page: number,
    numberOfItems: number
  ): Promise<dataGetAllTutor> {
    const count = await prisma.tutor.count();

    const numberOfPages = Math.floor((count - 1) / numberOfItems);

    const skipItens = (page - 1) * numberOfItems;

    const alltutors = await prisma.tutor.findMany({
      where: {
        status_delete: false,
      },
      take: numberOfItems,
      skip: skipItens,
    });

    const data: dataGetAllTutor = {
      numberOfPages: numberOfPages + 1,
      tutor: alltutors,
    };
    return data;
  }

  async searchManyPhone(query: string, page: number) {
    //buscar pelo nome e retorna a academia
    const tutors = await prisma.tutor.findMany({
      where: {
        phone: {
          contains: query, //se o titulo contem a query digitada
        },
      },
      take: 5,
      skip: (page - 1) * 5,
    });

    return tutors;
  }

  async findByCpfPhone(cpf: string, phone: string) {
    const tutor = await prisma.tutor.findUnique({
      where: {
        cpf: cpf,
        phone: phone,
      },
    });

    return tutor;
  }

  async updateTutor(id: string, data: Prisma.TutorUpdateInput) {
    const tutorUpdated = await prisma.tutor.update({
      where: {
        id: id,
      },
      data,
    });

    return tutorUpdated;
  }

  async markAsDelete(id: string) {
    await prisma.tutor.update({
      where: {
        id: id,
      },
      data: {
        status_delete: true,
      },
    });
  }

  async sequence(): Promise<string> {
    let nextSequence = (await prisma.tutor.count()) + 1;

    let sequenceExists = true;

    while (sequenceExists) {
      const existingSequence = await prisma.tutor.findFirst({
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
}
