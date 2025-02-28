import { beforeEach, describe, expect, it } from "vitest";
import { MarkAsDoneConsultUseCase } from "./deleteConsults";
import { InMemoryTutorRepository } from "@/repositories/in-memory/in-memory-tutor-repository";
import { InMemoryConsultsRepository } from "@/repositories/in-memory/in-memory-consults-repository";
import { ConsultsNotExistsError } from "../errors/consult-error";

let consultRepository: InMemoryConsultsRepository
let tutorRepository: InMemoryTutorRepository

let markAsDoneConsultTest: MarkAsDoneConsultUseCase

describe('Marking Consult as done Test Use case', () => {
    beforeEach(() => {
        consultRepository = new InMemoryConsultsRepository()
        tutorRepository = new InMemoryTutorRepository()

        markAsDoneConsultTest = new MarkAsDoneConsultUseCase(consultRepository)

        tutorRepository.createTutor({
            id: "87aba491-3bc5-4428-ba0d-466d74e003af",
            name: "judas",
            cpf: "00538298081",
            email: "email@email.com",
            adress: 'rua dos macacos',
            phone: "(62)91234-4321",
            sequence: "2"
        })

        consultRepository.createConsults({
            id: '42',
            sequence: '1',
            date: '01/01/2023',
            nameAnimal: 'tonico',
            phone: '(62)91234-4321',
            species: 'cachorro',
            description: 'Titiozin do meu cora',
            tutor_id: '87aba491-3bc5-4428-ba0d-466d74e003af',
        })
    })

    it('updating the data consult', async () => {
        await markAsDoneConsultTest.execute('42');

        const consult = await consultRepository.findById('42');

        expect(consult?.id).toEqual('42')
        expect(consult?.done).toBeTruthy()
    })

    it('show the error ConsultsNotExitsError when consult whit the id not found', async () => {
        await expect(markAsDoneConsultTest.execute('1231')).rejects.toBeInstanceOf(ConsultsNotExistsError)
    })
})
