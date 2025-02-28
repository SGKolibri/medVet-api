import { InMemoryTutorRepository } from "@/repositories/in-memory/in-memory-tutor-repository";
import { beforeEach, describe, expect, it } from "vitest";
import { CreateTutorsUseCase } from "./createTutor";
import { TutorAlreadyExistsError } from "../errors/tutor-error";

let tutorRepository: InMemoryTutorRepository
let createTutorTest: CreateTutorsUseCase

describe('testing the create tutors use case', () => {
    beforeEach(() => {
        tutorRepository = new InMemoryTutorRepository
        createTutorTest = new CreateTutorsUseCase(tutorRepository)

        tutorRepository.createTutor({
            sequence: '2',
            name: 'jonas',
            email: 'clod@email.com',
            cpf: '02286831068',
            phone: '62912341234',
            adress: 'rua dos caipavas'
        })
    })

    it('Creating a Tutor with all data', async () => {
        const tutor = await createTutorTest.execute({
            name: 'clodovil',
            email: 'clod@email.com',
            cpf: '26501216028',
            phone: '62987568213',
            adress: 'rua dos caiajos'
        })

        expect(tutor).toBeInstanceOf(Object)
        expect(tutor.name).toEqual('clodovil')
        expect(tutor.email).toEqual('clod@email.com')
        expect(tutor.cpf).toEqual('26501216028')
        expect(tutor.phone).toEqual('62987568213')
    })

    it('creating tutor without cpf and email', async () => {

        const tutor = await createTutorTest.execute({
            name: 'clodovil',
            email: '',
            cpf: '',
            phone: '62987568213',
            adress: 'rua muito engraçada'
        })

        expect(tutor).toBeInstanceOf(Object)
        expect(tutor.name).toEqual('clodovil')
        expect(tutor.email).toEqual('')
        expect(tutor.cpf).toEqual('')
        expect(tutor.phone).toEqual('62987568213')

    })

    it('show error TutorAlreadyExistsError when the the tutor with same phone and cpf exists', async () => {
        await expect(createTutorTest.execute({
            name: 'croves',
            email: 'clod@email.com',
            cpf: '02286831068',
            phone: '62912341234',
            adress: 'rua dos camarões'
        })).rejects.toBeInstanceOf(TutorAlreadyExistsError)
    })
})
