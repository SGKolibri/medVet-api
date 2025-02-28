import { InMemoryUsersRepository } from '@/repositories/in-memory/in-memory-users-repository'
import { expect, describe, it, beforeEach } from 'vitest'
import { CreateSecretarysUseCase } from '@/use-cases/users/secretary/createSecretarys'
import { UserAlreadyExistsError } from '@/use-cases/errors/user-error'




let usersRepository: InMemoryUsersRepository
let sut:  CreateSecretarysUseCase 

describe('Create Secretary Use Case', () => {
    beforeEach(() => {
        usersRepository = new InMemoryUsersRepository() //istanciar meu repositório
        sut = new CreateSecretarysUseCase( usersRepository)


        usersRepository.createSecretarys({
            id: '6616d924ee0af0e50602ca14', 
            name: 'João',
            cpf: '12345678900',
            password_hash: 'senha_hash',
            email: 'joao@example.com',
            phone: '(11) 12345-6789', 
            role: 'SECRETARY',
            created_at: new Date(),
          })


    })

    it('should to create Secretary', async () => {

   
        const { user } = await sut.execute({
            name: 'Alura',
            cpf: '02336937182',
            password: 'senha_hash',
            email: 'filpstr2004@gmail.comd',
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
            phone: '(64) 99909-4004',
        })).rejects.toBeInstanceOf(UserAlreadyExistsError)
    })

})
