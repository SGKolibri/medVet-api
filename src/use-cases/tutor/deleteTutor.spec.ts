import { InMemoryTutorRepository } from "@/repositories/in-memory/in-memory-tutor-repository";
import { beforeEach, describe, expect, it } from "vitest";
import { MarkTutorAsDeleteUseCase } from "./deleteTutor";
import { TutorNotExistsError } from "../errors/tutor-error";
import { InMemoryAnimalRepository } from "@/repositories/in-memory/in-memory-animals-repository";
import { AnimalExist } from "../errors/animal-errors";

let tutorRepository: InMemoryTutorRepository
let animalRepository: InMemoryAnimalRepository
let deleteTutorTest: MarkTutorAsDeleteUseCase

describe('testing the create tutors use case', () => {
    beforeEach(() => {
        tutorRepository = new InMemoryTutorRepository
        animalRepository = new InMemoryAnimalRepository
        deleteTutorTest = new MarkTutorAsDeleteUseCase(tutorRepository, animalRepository)

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

        tutorRepository.createTutor({
            id: '2c05d159-abb8-466d-a6bd-90da8d0c2d6e',
            sequence: '2',
            name: 'jonas',
            email: 'clod@email.com',
            cpf: '02286831068',
            phone: '62912341234'
        })

        tutorRepository.createTutor({
            id: '2c05d159-abb8-466d-a6bd-90da8d0c2d63',
            sequence: '2',
            name: 'gomes',
            email: 'gomes@email.com',
            cpf: '34685921089',
            phone: '62991234521'
        })
    })

    it('Deleting a Tutor with id', async () => {
        await deleteTutorTest.execute('2c05d159-abb8-466d-a6bd-90da8d0c2d63')

        const tutor = await tutorRepository.findById('2c05d159-abb8-466d-a6bd-90da8d0c2d63')

        expect(tutor).toBeTruthy()
    })

    it('show error TutorNotExists when the the tutor with same phone and cpf exists', async () => {
        await expect(deleteTutorTest.execute('1231')).rejects.toBeInstanceOf(TutorNotExistsError)
    })

    it('show error Animal Exists when the the tutor with same phone and cpf exists', async () => {
        await expect(deleteTutorTest.execute('2c05d159-abb8-466d-a6bd-90da8d0c2d6e')).rejects.toBeInstanceOf(AnimalExist)
    })
})
