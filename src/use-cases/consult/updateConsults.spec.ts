import { beforeEach, describe, expect, it } from "vitest";
import { UpdateConsultUseCase } from "./updateConsults";
import { InMemoryTutorRepository } from "@/repositories/in-memory/in-memory-tutor-repository";
import { InMemoryConsultsRepository } from "@/repositories/in-memory/in-memory-consults-repository";
import { ConsultsNotExistsError } from "../errors/consult-error";

let consultRepository: InMemoryConsultsRepository
let tutorRepository: InMemoryTutorRepository

let updateConsultTest: UpdateConsultUseCase

describe('Updating Consult Test Use case', () => {
    beforeEach(() => {
        consultRepository = new InMemoryConsultsRepository()
        tutorRepository = new InMemoryTutorRepository()

        updateConsultTest = new UpdateConsultUseCase(consultRepository)

        tutorRepository.createTutor({
            id: "87aba491-3bc5-4428-ba0d-466d74e003af",
            name: "judas",
            cpf: "00538298081",
            email: "email@email.com",
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
        const consult = await updateConsultTest.execute({
            id: '42',
            nameAnimal: 'lua',
            species: 'gato',
            stringDate: '12/05/2024',
            description: 'cachorro da rua atropelado por um gato',
        })

        expect(consult?.id).toEqual('42')
        expect(consult?.nameAnimal).toEqual('lua')
        expect(consult?.species).toEqual('gato')
        expect(consult?.date).toBeInstanceOf(Date)
        expect(consult?.description).toEqual('cachorro da rua atropelado por um gato')
    })

    it('show the error ConsultsNotExitsError when consult whit the id not found', async () => {
        await expect(updateConsultTest.execute({
            id: '1231',
            nameAnimal: 'lua',
            species: 'gato',
            stringDate: '12/05/2024',
            description: 'cachorro da rua atropelado por um gato',
        })).rejects.toBeInstanceOf(ConsultsNotExistsError)
    })
})