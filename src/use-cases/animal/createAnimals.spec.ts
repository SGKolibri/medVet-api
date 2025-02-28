import { describe, beforeEach, expect, it } from "vitest";
import { InMemoryAnimalRepository } from "@/repositories/in-memory/in-memory-animals-repository";
import { InMemoryTutorRepository } from "@/repositories/in-memory/in-memory-tutor-repository";
import { CreateAnimalsUsecase } from './createAnimals';
import { TutorNotExistsError } from '../errors/tutor-error';
import { AnimalAlreadyExistsError } from "../errors/animal-errors";

let animalRepository: InMemoryAnimalRepository
let tutorRepository: InMemoryTutorRepository
let createAnimalTest: CreateAnimalsUsecase

describe('Create animal use case', () => {
    beforeEach(async () => {
        animalRepository = new InMemoryAnimalRepository
        tutorRepository = new InMemoryTutorRepository

        createAnimalTest = new CreateAnimalsUsecase(animalRepository, tutorRepository)

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
            id: '2c05d159-abb8-466d-a6bd-90da8d0c2d6e',
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

    it('Creating animal', async () => {
        const animal = await createAnimalTest.execute({
            name: "Secundario",
            species: "buldog",
            race: "cachorro",
            gender: "masculino",
            age: "12",
            coat: "cinza",
            tutor_id: '2c05d159-abb8-466d-a6bd-90da8d0c2d6e'
        })

        expect(animal).toBeTypeOf('string')
    })


    it('Shown error Tutor not exist', async () => {
        await expect(createAnimalTest.execute({
            name: "name",
            species: "buldog",
            race: "cachorro",
            gender: "masculino",
            age: "12",
            coat: "cinza",
            tutor_id: '2c032159-abb8-466d-a6bd-90da8d0c2d6e'
        })).rejects.toBeInstanceOf(TutorNotExistsError)
    })
    it('Shown error Animal already exists', async () => {
        await expect(
            createAnimalTest.execute({
                name: "name",
                species: "buldog",
                race: "cachorro",
                gender: "masculino",
                age: "12",
                coat: "cinza",
                tutor_id: '2c05d159-abb8-466d-a6bd-90da8d0c2d6e',
            })
        ).rejects.toBeInstanceOf(AnimalAlreadyExistsError);
    });
})
