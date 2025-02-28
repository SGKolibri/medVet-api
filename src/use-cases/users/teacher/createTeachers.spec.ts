import { InMemoryUsersRepository } from '@/repositories/in-memory/in-memory-users-repository'
import { expect, describe, it, beforeEach } from 'vitest'
import { CreateTeachersUseCase} from '@/use-cases/users/teacher/createTeachers'
import { UserAlreadyExistsError } from '@/use-cases/errors/user-error'




let usersRepository: InMemoryUsersRepository
let sut: CreateTeachersUseCase

describe('Create Teacher Use Case', () => {
    beforeEach(() => {
        usersRepository = new InMemoryUsersRepository() //istanciar meu repositório
        sut = new CreateTeachersUseCase(  usersRepository)


        usersRepository.createTeachers({
            id: '6616d924ee0af0e50602ca14',
            name: 'João',
            cpf: '12345678900',
            password_hash: 'senha_hash',
            email: 'joao@example.com',
            registration: '123456',
            course: 'Veterinária',
            shift: 'Manhã',
            phone: '(11) 12345-6789',
            role: 'TEACHER',
            created_at: new Date(),
          })




    })

    it('should to create Teacher', async () => {


        const { user } = await sut.execute({
            name: 'Alura',
            cpf: '02336937182',
            password: 'senha_hash',
            email: 'filpstr2004@gmail.comd',
            registration: '64321',
            course: 'Veterinária',
            shift: 'Manhã',
            phone: '(64) 99909-4004',
        })

        expect(user.id).toEqual(expect.any(String))
        expect(user).toBeTypeOf('object')
        expect(user.name).toEqual('Alura')
        expect(user.status_delete).toBeFalsy()
    })


    it('Shown error User not exist (cpf) ', async () => {
        await expect(sut.execute({
            name: 'Claudio',
            cpf: '12345678900',
            password: 'senha_hash',
            email: 'filpstr2004@gmail.comd',
            registration: '6436',
            course: 'Veterinária',
            shift: 'Manhã',
            phone: '(64) 99909-4004',
        })).rejects.toBeInstanceOf(UserAlreadyExistsError)
    })

    it('Shown error User not exist (registration)', async () => {
        await expect(sut.execute({
            name: 'Claudio',
            cpf: '02336937182',
            password: 'senha_hash',
            email: 'filpstr2004@gmail.comd',
            registration: '123456',
            course: 'Veterinária',
            shift: 'Manhã',
            phone: '(64) 99909-4004',
        })).rejects.toBeInstanceOf(UserAlreadyExistsError)
    })





})
