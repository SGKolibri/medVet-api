import { InMemoryAnimalRepository } from '@/repositories/in-memory/in-memory-animals-repository'
import { MarkAsDeleteUseCase } from './deleteAnimal'
import { describe, beforeEach, it, expect} from 'vitest'
import { AnimalNoexists } from '@/use-cases/errors/animal-errors'

let animalRepository: InMemoryAnimalRepository
let deleteAnimalTest: MarkAsDeleteUseCase

describe('test if the animal is mark as delete', () => {
    beforeEach(() => {
        animalRepository = new InMemoryAnimalRepository
        deleteAnimalTest = new MarkAsDeleteUseCase(animalRepository)

        animalRepository.createAnimal({
            id: '27b62603-c3a5-456e-bf25-d911de1138f3',
            sequence: "1",
            name: "name",
            created_at: new Date(),
            species: "buldog",
            race: "cachorro",
            gender: "masculino",
            age: "12",
            coat: "cinza",
            tutor_id: '2c05d159-abb8-466d-a6bd-90da8d0c2d6e'
        })
    })

    it('marking animal as delete', async () => {
        await deleteAnimalTest.execute('27b62603-c3a5-456e-bf25-d911de1138f3')

        const animal = await animalRepository.findById('27b62603-c3a5-456e-bf25-d911de1138f3')

        expect(animal?.id).toEqual('27b62603-c3a5-456e-bf25-d911de1138f3')
        expect(animal?.status_delete).toBeTruthy()
    })

    it('show error AnimalNoexists when the animal not exists', async () => {
        await expect(deleteAnimalTest.execute('12')).rejects.toBeInstanceOf(AnimalNoexists)
    })
})
