import { InMemoryConsultsRepository } from "@/repositories/in-memory/in-memory-consults-repository";
import { InMemoryTutorRepository } from "@/repositories/in-memory/in-memory-tutor-repository";
import { beforeEach, describe, expect, it } from "vitest";
import { CreateExistTutorConsultsUseCase } from "./createExistTutorConsults";
import { TutorNotExistsError } from "../errors/tutor-error";
import { InvalidDateError } from "../errors/invalid-date-error";


let consultRepository: InMemoryConsultsRepository
let tutorRepository: InMemoryTutorRepository

let createConsultTest: CreateExistTutorConsultsUseCase

describe('Create consult when tutor exists', () => {
    beforeEach(() => {
        consultRepository = new InMemoryConsultsRepository()
        tutorRepository = new InMemoryTutorRepository()

        createConsultTest = new CreateExistTutorConsultsUseCase(consultRepository, tutorRepository)

        tutorRepository.createTutor({
            id: "87aba491-3bc5-4428-ba0d-466d74e003af",
            name: "judas",
            cpf: "00538298081",
            email: "email@email.com",
            phone: "(62)91234-4321",
            sequence: "2"
        })
    })

    it('Creating the Consult.', async () => {
        const consult = await createConsultTest.execute({
            nameAnimal: "cotoco", 
            stringDate: "11/12/2022", 
            description: "Animaldo do meu coração", 
            species: "cachorro", 
            phone: "(62)920223241", 
            tutor_id: "87aba491-3bc5-4428-ba0d-466d74e003af"
        });
        
        expect(consult?.tutor_id).toEqual('87aba491-3bc5-4428-ba0d-466d74e003af')
        expect(consult?.nameAnimal).toEqual('cotoco')
    })

    it('Show error TutorNotExistsError when tutor not exists', async () => {
        await expect(createConsultTest.execute({
            nameAnimal: "cotoco", 
            stringDate: "11/12/2022", 
            description: "Animaldo do meu coração", 
            species: "cachorro", 
            phone: "(62)920223241", 
            tutor_id: "85c5ad6a-f669-4277-b463-2cd8fcb5e22a"    
        })).rejects.toBeInstanceOf(TutorNotExistsError)
    })

    it('Show error InvalidDateError when date is not valid', async () => {
        await expect(createConsultTest.execute({
            nameAnimal: "cotoco", 
            stringDate: "11122022", 
            description: "Animaldo do meu coração", 
            species: "cachorro", 
            phone: "(62)920223241", 
            tutor_id: "87aba491-3bc5-4428-ba0d-466d74e003af"    
        })).rejects.toBeInstanceOf(InvalidDateError)
    })
})