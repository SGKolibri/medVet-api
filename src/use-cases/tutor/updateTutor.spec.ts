import { InMemoryTutorRepository } from "@/repositories/in-memory/in-memory-tutor-repository";
import { beforeEach, describe, expect, it } from "vitest";
import { TutorAlreadyExistsError, TutorNotExistsError } from "../errors/tutor-error";
import { UpdateTutorUseCase } from './updateTutor';

let tutorRepository: InMemoryTutorRepository
let updateTutorTest: UpdateTutorUseCase

describe('testing the update tutors use case', () => {
    beforeEach(() => {
        tutorRepository = new InMemoryTutorRepository
        updateTutorTest = new UpdateTutorUseCase(tutorRepository)

        tutorRepository.createTutor({
            id: '1234',
            sequence: '2',
            name: 'jonas',
            email: 'clod@email.com',
            cpf: '02286831068',
            phone: '62912341234',
            adress: 'rua tocoiabas'
        })
    })

    it('updating all data Tutor', async () => {
        const tutor = await updateTutorTest.execute({
            id: '1234',
            name: 'clodovil',
            email: 'clod@email.com',
            cpf: '02286831068',
            phone: '62912341234',
            adress: 'rua moraoes'
        })

        expect(tutor).toBeInstanceOf(Object)
        expect(tutor.name).toEqual('clodovil')
        expect(tutor.email).toEqual('clod@email.com')
        expect(tutor.cpf).toEqual('02286831068')
        expect(tutor.phone).toEqual('62912341234')
        expect(tutor.adress).toEqual('rua moraoes')
    })

    it('update just tutor name ', async () => {

        const tutor = await updateTutorTest.execute({
            id: '1234',
            name: 'clodovil',
            email: 'clod@email.com',
            cpf: '02286831068',
            phone: '62912341234',
            adress: 'av tocoxiba'
        })

        expect(tutor).toBeInstanceOf(Object)
        expect(tutor.id).toEqual('1234')
        expect(tutor.name).toEqual('clodovil')
        expect(tutor.email).toEqual('clod@email.com')
        expect(tutor.cpf).toEqual('02286831068')
        expect(tutor.phone).toEqual('62912341234')
        expect(tutor.adress).toEqual('av tocoxiba')
    })

    it('show error TutorNotExistsError when the the tutor with same id not exists', async () => {
        await expect(updateTutorTest.execute({
            id: '2',
            name: 'croves',
            email: 'clod@email.com',
            cpf: '02286831068',
            phone: '62912341234',
            adress: 'rua amores'
        })).rejects.toBeInstanceOf(TutorNotExistsError)
    })
})
