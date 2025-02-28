import { InMemoryUsersRepository } from '@/repositories/in-memory/in-memory-users-repository'
import { expect, describe, it, beforeEach } from 'vitest'
import { CreateStudentsUseCase } from '@/use-cases/users/student/createStudents'
import { UserAlreadyExistsError } from '@/use-cases/errors/user-error'




let usersRepository: InMemoryUsersRepository
let sut: CreateStudentsUseCase 

describe('Create Student Use Case', () => {
    beforeEach(() => {
        usersRepository = new InMemoryUsersRepository() //istanciar meu repositório
        sut = new CreateStudentsUseCase( usersRepository)


        usersRepository.createStudent({
            id: '6616d924ee0af0e50602ca14', 
            name: 'João',
            cpf: '12345678900',
            password_hash: 'senha_hash',
            email: 'joao@example.com',
            registration: '123456',
            course: 'Veterinária',
            shift: 'Manhã',
            phone: '(11) 12345-6789',
            period: 'noturno',
            role: 'STUDENT',
            created_at: new Date(),
          })




    })

    it('should to create Student', async () => {

   
        const { user } = await sut.execute({
            name: 'Alura',
            cpf: '02336937182',
            password: 'senha_hash',
            email: 'filpstr2004@gmail.comd',
            registration: '64321',
            course: 'Veterinária',
            shift: 'Manhã',
            period: 'noturno',
            phone: '(64) 99909-4004',
        })

        expect(user.id).toEqual(expect.any(String))
        expect(user).toBeTypeOf('object')
        expect(user.name).toEqual('Alura')
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
            period: 'noturno',
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
            period: 'noturno',
            phone: '(64) 99909-4004',
        })).rejects.toBeInstanceOf(UserAlreadyExistsError)
    })

})
