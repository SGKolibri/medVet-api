import { InMemoryUsersRepository } from '@/repositories/in-memory/in-memory-users-repository'
import { expect, describe, it, beforeEach } from 'vitest'
import {UpdateSecretaryUseCase} from '@/use-cases/users/secretary/updateSecretary'
import { NoExistsUsersError } from '@/use-cases/errors/user-error'
import { compare } from 'bcryptjs'




let usersRepository: InMemoryUsersRepository
let sut: UpdateSecretaryUseCase

describe('Update Secretary Use Case', () => {
    beforeEach(() => {
        usersRepository = new InMemoryUsersRepository() //istanciar meu repositório
        sut = new UpdateSecretaryUseCase( usersRepository)


        usersRepository.createSecretarys({
            id: '6616d924ee0af0e50602ca14',
            nare: 'João',
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

        const { user } = await sut.execute({
            id: '6616d924ee0af0e50602ca14',
            name: 'felipe',
            cpf: '02336937182',
            password: password,
            email: 'filpstr2004@gmail.comd',
            phone: '(64) 99909-4004',
        })

        const doesPasswordMatch = await compare(password, user.password_hash);

        expect(user).toBeTypeOf('object')
        expect(user.name).toEqual('felipe')
        expect(user.cpf).toEqual('02336937182')
        expect(doesPasswordMatch).toBe(true);
        expect(user.email).toEqual('filpstr2004@gmail.comd')
        expect(user.phone).toEqual('(64) 99909-4004')
    })


    it('Should error', async () => {

        await expect(sut.execute({
            id: '663001cfdfda412be8b38771',
            name: 'felipe',
            cpf: '02336937182',
            password: 'senha123',
            email: 'filpstr2004@gmail.comd',
            phone: '(64) 99909-4004',
        })).rejects.toBeInstanceOf( NoExistsUsersError)

    })

})
