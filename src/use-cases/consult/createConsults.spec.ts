import { InMemoryConsultsRepository } from "@/repositories/in-memory/in-memory-consults-repository";
import { InMemoryTutorRepository } from "@/repositories/in-memory/in-memory-tutor-repository";
import { beforeEach, describe, expect, it } from "vitest";
import { CreateConsultsUseCase } from './createConsults';
import { Consult } from "@prisma/client";
import { TutorAlreadyExistsError } from "../errors/tutor-error";
import { InvalidDateError } from "../errors/invalid-date-error";

let consultRepository: InMemoryConsultsRepository
let tutorRepository: InMemoryTutorRepository

let createConsultTest: CreateConsultsUseCase

describe('Create consult use case', () => {
    beforeEach(() => {
        tutorRepository = new InMemoryTutorRepository
        consultRepository = new InMemoryConsultsRepository
        createConsultTest = new CreateConsultsUseCase(consultRepository, tutorRepository)

        tutorRepository.createTutor({
            name: "thomas",
            cpf: "35074133025",
            email: "email@email.com",
            phone: "(62)91234-1234",
            sequence: "2"
        })

        tutorRepository.createTutor({
            name: "judas",
            cpf: "00538298081",
            email: "email@email.com",
            phone: "(62)91234-4321",
            sequence: "2"
        })
    })

    it('Creating the consult when the tutor no exists', async () => {
        const consult: Consult = await createConsultTest.execute({
            nameAnimal: "pitoko",
            stringDate: "12/04/2060",
            description: "Cachorro com problema",
            species: "cachorro",
            phone: "(34)93423-2312",
            nameTutor: "Pedro"
        })

        expect(consult).toBeTypeOf('object')
        expect(consult.nameAnimal).toEqual('pitoko')
        expect(consult.date).toBeInstanceOf(Date)
        expect(consult.description).toEqual('Cachorro com problema')
        expect(consult.species).toEqual('cachorro')
        expect(consult.phone).toEqual('(34)93423-2312')
    });

    it('Create the tutor', async () => {
        const consult = await createConsultTest.execute({
            nameAnimal: "pitoko",
            stringDate: "12/04/2060",
            description: "Cachorro com problema",
            species: "cachorro",
            phone: "(34)93423-2312",
            nameTutor: "Pedro"
        })

        const tutor = await tutorRepository.findById(consult.tutor_id)
        
        expect(tutor?.id).toEqual(consult.tutor_id)
    })

    it('Show error InvalidDateError when the date doesn have the /', async () => {
        await expect(createConsultTest.execute({
            nameAnimal: "pitoko",
            stringDate: "12042023",
            description: "Cachorro com problema",
            species: "cachorro",
            phone: "(34)93423-2312",
            nameTutor: "Pedro"
        })).rejects.toBeInstanceOf(InvalidDateError)
    })

    it('Show error InvalidDateError when the mounth is bigger than 12', async () => {
        await expect(createConsultTest.execute({
            nameAnimal: "pitoko",
            stringDate: "12/13/2023",
            description: "Cachorro com problema",
            species: "cachorro",
            phone: "(34)93423-2312",
            nameTutor: "Pedro"
        })).rejects.toBeInstanceOf(InvalidDateError)
    })

    it('Show error InvalidDateError when the day is bigger than 31 or less than 1', async () => {
        await expect(createConsultTest.execute({
            nameAnimal: "pitoko",
            stringDate: "0/10/2023",
            description: "Cachorro com problema",
            species: "cachorro",
            phone: "(34)93423-2312",
            nameTutor: "Pedro"
        })).rejects.toBeInstanceOf(InvalidDateError)
    })

    it('Show error InvalidDateError when the day is bigger than 31 or less than 1', async () => {
        await expect(createConsultTest.execute({
            nameAnimal: "pitoko",
            stringDate: "33/12/2023",
            description: "Cachorro com problema",
            species: "cachorro",
            phone: "(34)93423-2312",
            nameTutor: "Pedro"
        })).rejects.toBeInstanceOf(InvalidDateError)
    })

    it('Show TutorAlreadyExistsError when the tutor that is in the consult data actually exists in database', async () => {

        await expect(createConsultTest.execute({
            nameAnimal: "pitoko",
            stringDate: "12/04/2023",
            description: "Cachorro com problema",
            species: "cachorro",
            phone: "(62)91234-1234",
            nameTutor: "thomas"
        })).rejects.toBeInstanceOf(TutorAlreadyExistsError)
    })
})