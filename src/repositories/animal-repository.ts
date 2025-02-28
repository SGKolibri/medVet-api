import { Prisma, Animal } from '@prisma/client'

export interface AnimalRepository {
  sequence(): Promise<string>
  findById(id: string): Promise<Animal | null>
  findBySequence(sequence: string): Promise<Animal | null>
  createAnimal(data: Prisma.AnimalUncheckedCreateInput): Promise<String>
  findManyIdTutor(tutor_id: string): Promise<Animal[]>
  getAllAnimals(page: number, numberOfItems: number): Promise<Animal[]>
  findByTutor(id: string): Promise<Animal[]>
  findByNameAgeSpecies(name: string, age: string, species: string, tutor_id: string): Promise<Animal | null>
  markAsDelete(id: string): any
  searchByNameAnimalorSequence(q: string, page: number): Promise<Animal[]>
}