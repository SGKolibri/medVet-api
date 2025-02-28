import { Prisma, Animal } from '@prisma/client'
import { randomUUID } from 'node:crypto'
import { AnimalRepository } from '@/repositories/animal-repository'

export class InMemoryAnimalRepository implements AnimalRepository {
    public items: Animal[] = []

    async createAnimal(data: Prisma.AnimalUncheckedCreateInput): Promise<string> {
        const animal = {
            id: data.id ?? randomUUID(),
            sequence: data.sequence,
            name: data.name,
            created_at: new Date(),
            species: data.species,
            race: data.race ?? null,
            gender: data.gender,
            age: data.age,
            status_delete: false,
            coat: data.coat ?? null,
            tutor_id: data.tutor_id,
            enchiridion: data.enchiridion ?? [],
        }

        this.items.push(animal)

        return animal.id
    }

    async findById(id: string): Promise<Animal | null> {
        return this.items.find((item) => item.id === id) ?? null
    }

    async findManyIdTutor(tutor_id: string): Promise<Animal[]> {
        return this.items.filter((item) => item.tutor_id === tutor_id)
    }

    async getAllAnimals(page: number, numberOfItems: number): Promise<Animal[]> {
        return this.items.slice((page - 1) * numberOfItems, page * numberOfItems)
    }

    async findByTutor(id: string): Promise<Animal[]> {
        return this.items.filter((item) => item.tutor_id === id)
    }

    async findBySequence(sequence: string): Promise<Animal | null> {
        return this.items.find((item) => item.sequence === sequence) ?? null
    }

    async findByNameAgeSpecies(name: string, age: string, species: string, tutor_id: string): Promise<Animal | null> {
        return this.items.find((item) =>
            item.name === name &&
            item.age === age &&
            item.species === species &&
            item.tutor_id === tutor_id
        ) ?? null
    }

    async sequence(): Promise<string> {
        // let nextSequence = await prisma.animal.count() + 1
        let nextSequence = this.items.length + 1

        let sequenceExists = true;

        while (sequenceExists) {
            const existingSequence = this.items.find((item) => {
                item.sequence == nextSequence.toString()
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
        const index = this.items.findIndex((item) => item.id === id)

        if(index === -1) {
            throw new Error('Enchiridion not found')
        }

        const enchiridion = {
            ...this.items[index],
            status_delete: true
        }

        this.items[index] = enchiridion as Animal
    }
}
