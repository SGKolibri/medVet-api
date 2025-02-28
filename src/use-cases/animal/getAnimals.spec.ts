import { AnimalNoexists } from '@/use-cases/errors/animal-errors';
import { InMemoryAnimalRepository } from '@/repositories/in-memory/in-memory-animals-repository';
import { beforeEach, expect, describe, it } from 'vitest';
import { GetAllAnimalsUseCase, GetAnimalByTutorUseCase, GetAnimalById } from './getAnimals';
import { InMemoryTutorRepository } from '@/repositories/in-memory/in-memory-tutor-repository';
import { TutorNotExistsError } from '../errors/tutor-error';

let tutorRepository: InMemoryTutorRepository
let animalRepository: InMemoryAnimalRepository
let getAllTest: GetAllAnimalsUseCase
let getAnimalByTutorTest: GetAnimalByTutorUseCase
let getAnimalByIdTest: GetAnimalById


describe('Get all Animal Use Case', () => {

    beforeEach(() => {

        animalRepository = new InMemoryAnimalRepository
        tutorRepository = new InMemoryTutorRepository

        getAllTest = new GetAllAnimalsUseCase(animalRepository, tutorRepository)

        tutorRepository.createTutor({
            id: '2c05d159-abb8-466d-a6bd-90da8d0c2d6e',
            sequence: "1",
            name: "nome",
            cpf: "21658235010",
            email: "email@eamil.com",
            phone: "(62)91234-1234",
            created_at: new Date(),
        })

        animalRepository.createAnimal({
            id:  '2c05d159-abb8-466d-a6bd-90da8d0c2d6e',
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

        animalRepository.createAnimal({
            id:  '27b62603-c3a5-456e-bf25-d911de1138f3',
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
    });

    it('get all animals from the database', async () => {
        const animal = await getAllTest.execute(1, 2)

        expect(animal).toHaveLength(2)
    })


    it('get all the animals with pagination', async () => {

        const  animal1  = await getAllTest.execute(1, 2)

        const animal2 = await getAllTest.execute(2, 1)

        expect(animal1).toHaveLength(2)
        expect(animal2).toHaveLength(1)// testar se retorna nada quando estiver em uma pagina sem dados
    })

    it('show Error AnimalNoexists', async () => {
        animalRepository.items = []

        await expect(getAllTest.execute(1,2)).rejects.toBeInstanceOf(AnimalNoexists)
    })
})

describe('Get Animal by the id of tutor', () => {
    beforeEach(() => {
        animalRepository = new InMemoryAnimalRepository()
        tutorRepository = new InMemoryTutorRepository()

        getAnimalByTutorTest = new GetAnimalByTutorUseCase(animalRepository, tutorRepository)

        tutorRepository.createTutor({
            id: '2c05d159-abb8-466d-a6bd-90da8d0c2d6e',
            sequence: "1",
            name: "nome",
            cpf: "21658235010",
            email: "email@eamil.com",
            phone: "(62)91234-1234",
            created_at: new Date(),
        })

        animalRepository.createAnimal({
            id:  'b4539f0f-34e1-4aa8-a49d-5f780670f35d',
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

        animalRepository.createAnimal({
            id:  '27b62603-c3a5-456e-bf25-d911de1138f3',
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

    it('return all animal`s tutor', async () => {
        const animals = await getAnimalByTutorTest.execute('2c05d159-abb8-466d-a6bd-90da8d0c2d6e')

        expect(animals).toHaveLength(2)
        expect(animals[0].id).toEqual('b4539f0f-34e1-4aa8-a49d-5f780670f35d')
        expect(animals[1].id).toEqual('27b62603-c3a5-456e-bf25-d911de1138f3')
    })

    it('show error TutorNotExists', async () => {


        await expect(getAnimalByTutorTest.execute('e24b8849-71c4-419b-a549-fb0560eaa2ff')).rejects.toBeInstanceOf(TutorNotExistsError)
    })

    it('show error AnimalNoExists when no animal exist in the tutor`s reference', async () => {

        animalRepository.items = []

        await expect(getAnimalByTutorTest.execute('2c05d159-abb8-466d-a6bd-90da8d0c2d6e')).rejects.toBeInstanceOf(AnimalNoexists)
    })
})

describe('Get Animal by it ID', () => {
    beforeEach(() => {
        animalRepository = new InMemoryAnimalRepository()
        tutorRepository = new InMemoryTutorRepository()

        getAnimalByIdTest = new GetAnimalById(animalRepository, tutorRepository)

        tutorRepository.createTutor({
            id: '2c05d159-abb8-466d-a6bd-90da8d0c2d6e',
            sequence: "1",
            name: "nome",
            cpf: "21658235010",
            email: "email@eamil.com",
            phone: "(62)91234-1234",
            created_at: new Date(),
        })

        animalRepository.createAnimal({
            id:  'b4539f0f-34e1-4aa8-a49d-5f780670f35d',
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

        animalRepository.createAnimal({
            id:  '27b62603-c3a5-456e-bf25-d911de1138f3',
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

    it('get the animal by his id', async () => {
        const animal = await getAnimalByIdTest.execute('b4539f0f-34e1-4aa8-a49d-5f780670f35d')
        const animal2 = await getAnimalByIdTest.execute('27b62603-c3a5-456e-bf25-d911de1138f3')

        expect(animal?.id).toEqual('b4539f0f-34e1-4aa8-a49d-5f780670f35d');
        expect(animal2?.id).toEqual('27b62603-c3a5-456e-bf25-d911de1138f3')
    })

    it('show the error AnimalNoexists when the animal id no is for a animal in the database', async () => {

        await expect(getAnimalByIdTest.execute('0bb53b14-d47d-4016-a3d6-551c79ac68a8')).rejects.toBeInstanceOf(AnimalNoexists)
    })
})
