import { InMemoryUsersRepository } from '@/repositories/in-memory/in-memory-users-repository'
import { expect, describe, it, beforeEach } from 'vitest'
import { MarkAsDeleteSecretaryUseCase } from '@/use-cases/users/secretary/deleteSecretary'
import { NoExistsUsersError } from '@/use-cases/errors/user-error'
import { compare } from 'bcryptjs'

let usersRepository: InMemoryUsersRepository
let markAsDeleteTest: MarkAsDeleteSecretaryUseCase

describe('Mark Secretary as delete Use Case', () => {
    beforeEach(() => {
        usersRepository = new InMemoryUsersRepository() //istanciar meu repositório
        markAsDeleteTest = new MarkAsDeleteSecretaryUseCase( usersRepository)


        usersRepository.createSecretarys({
            id: '6616d924ee0af0e50602ca14',
            name: 'João',
            cpf: '12345678900',
            password_hash: '6436612873',
            email: 'joao@example.com',
            phone: '(11) 12345-6789',
            role: 'SECRETARY',
            created_at: new Date(),
          })
    })

    it('should update Secretary', async () => {



        const password = 'senha123';

        await markAsDeleteTest.execute({
            id: '6616d924ee0af0e50602ca14',
        })

        const user = await usersRepository.findSecretaryById('6616d924ee0af0e50602ca14')

        expect(user?.status_delete).toBeTruthy()
    })


    it('Should error', async () => {


        await expect(markAsDeleteTest.execute({
            id: '663001cfdfda412be8b38771'
        })).rejects.toBeInstanceOf( NoExistsUsersError)


    })

})
