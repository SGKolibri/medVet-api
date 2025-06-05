import { AnimalRepository } from "@/repositories/animal-repository";
import { prisma } from "@/lib/prisma";
import { Prisma } from "@prisma/client";

export class PrismaAnimalsRepository implements AnimalRepository {
  async findById(id: string) {
    const animal = await prisma.animal.findUnique({
      where: {
        id,
      },
    });

    return animal;
  }  async findBySequence(sequence: string) {
    // Se não temos uma sequência, não podemos buscar por ela
    if (!sequence) {
      return null;
    }
    
    const user = await prisma.animal.findFirst({
      where: {
        sequence,
      },
    });

    return user;
  }

  async findByNameAgeSpecies(
    name: string,
    age: string,
    species: string,
    tutor_id: string
  ) {
    const user = await prisma.animal.findFirst({
      where: {
        name,
        age,
        species,
        tutor_id,
      },
    });

    return user;
  }

  async getAllAnimals(page: number, numberOfItems: number) {
    const skipTtens = (page - 1) * numberOfItems;

    const animal = await prisma.animal.findMany({
      take: numberOfItems,
      skip: skipTtens,
    });

    return animal;
  }  async createAnimal(data: Prisma.AnimalUncheckedCreateInput) {
    try {
      // Adicionar sequence gerado automaticamente
      // Sempre geramos um novo sequence para evitar colisões
      const dataWithSequence = { ...data };
      
      // Gerar um novo valor de sequência mesmo se um foi fornecido
      // Isso garante que sempre teremos um valor único
      try {
        const newSequence = await this.sequence();
        dataWithSequence.sequence = newSequence;
        console.log("Criando animal com sequence:", dataWithSequence.sequence);
      } catch (seqError) {
        // Se falhar ao gerar a sequência, continue sem ela (é opcional)
        console.warn("Falha ao gerar sequência, continuando sem ela:", seqError);
        // Garantir que não seja undefined
        dataWithSequence.sequence = `manual-${Date.now()}`;
      }
      
      const animal = await prisma.animal.create({
        data: dataWithSequence,
      });

      return animal.id;
    } catch (error) {
      console.error("Erro ao criar animal:", error);
      throw error;
    }
  }

  async findManyIdTutor(tutor_id: string) {
    const allanimals = await prisma.animal.findMany({
      where: {
        tutor_id: tutor_id,
      },
    });

    return allanimals;
  }

  async findByTutor(id: string) {
    const animal = await prisma.animal.findMany({
      where: {
        tutor_id: id,
      },
    });

    return animal;
  }

  async searchByNameAnimalorSequence(q: string, page: number) {
    const queryNormalized = q.toLowerCase();

    const animal = await prisma.animal.findMany({
      where: {
        OR: [
          {
            name: {
              startsWith: queryNormalized,
              mode: "insensitive",
            },
          },
          {
            sequence: {
              startsWith: queryNormalized,
              mode: "insensitive",
            },
          },
        ],
        status_delete: false, // Only return non-deleted animals
      },
      select: {
        id: true,
        sequence: true,
        name: true,
        created_at: true,
        species: true,
        race: true,
        gender: true,
        age: true,
        coat: true,
        status_delete: true,
        tutor_id: true,
      },
      take: 10,
      skip: (page - 1) * 10,
    });

    return animal;
  }
  async sequence(): Promise<string> {
    try {
      // Buscar o animal com a maior sequência
      const highestSequence = await prisma.animal.findFirst({
        orderBy: {
          sequence: 'desc',
        },
      });
      
      // Se encontrou um animal, incrementa a sequência
      if (highestSequence && highestSequence.sequence) {
        const currentSequence = parseInt(highestSequence.sequence, 10);
        return (isNaN(currentSequence) ? 1 : currentSequence + 1).toString();
      }
      
      // Se não houver animais ou o valor da sequência for inválido, retorna "1"
      return "1";
    } catch (error) {
      console.error("Erro ao gerar sequence:", error);
      // Em caso de erro, garantir que retornamos um valor válido
      const timestamp = Date.now().toString();
      return `${timestamp.substring(timestamp.length - 6)}`;
    }
  }

  async markAsDelete(id: string) {
    await prisma.animal.update({
      where: {
        id: id,
      },
      data: {
        status_delete: true,
      },
    });
  }
}
